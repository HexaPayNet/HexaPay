const { clipboard, contextBridge, ipcRenderer } = require("electron");

const DEFAULT_API_BASE_URL = "http://127.0.0.1:4000/api/v1";
const DEFAULT_HEALTH_TIMEOUT_MS = 8000;

function normalizeApiBaseUrl(value) {
  const trimmedValue = String(value || "").trim();
  if (!trimmedValue) {
    return DEFAULT_API_BASE_URL;
  }

  const withoutTrailingSlash = trimmedValue.replace(/\/+$/, "");
  return /\/api\/v\d+$/i.test(withoutTrailingSlash)
    ? withoutTrailingSlash
    : `${withoutTrailingSlash}/api/v1`;
}

function getRuntimeConfigFromArguments() {
  const argumentPrefix = "--hexapay-runtime-config=";
  const configArgument = process.argv.find((value) => String(value).startsWith(argumentPrefix));

  if (!configArgument) {
    return Object.freeze({
      apiBaseUrl: DEFAULT_API_BASE_URL,
      isPackaged: false,
      apiBaseUrlSource: "default",
      apiBaseUrlConfigPath: ""
    });
  }

  try {
    const encodedValue = configArgument.slice(argumentPrefix.length);
    const parsedValue = JSON.parse(decodeURIComponent(encodedValue));

    return Object.freeze({
      apiBaseUrl: normalizeApiBaseUrl(parsedValue.apiBaseUrl),
      isPackaged: Boolean(parsedValue.isPackaged),
      apiBaseUrlSource: parsedValue.apiBaseUrlSource || "default",
      apiBaseUrlConfigPath: parsedValue.apiBaseUrlConfigPath || ""
    });
  } catch (error) {
    console.error("Failed to parse HexaPay runtime config.", error);
    return Object.freeze({
      apiBaseUrl: DEFAULT_API_BASE_URL,
      isPackaged: false,
      apiBaseUrlSource: "default",
      apiBaseUrlConfigPath: ""
    });
  }
}

function resolveHealthCheckUrl(apiBaseUrl) {
  const url = new URL(normalizeApiBaseUrl(apiBaseUrl));
  url.pathname = "/health";
  url.search = "";
  url.hash = "";
  return url.toString();
}

function getHealthCheckTimeout(timeoutMs) {
  const numericTimeout = Number(timeoutMs);
  if (!Number.isFinite(numericTimeout) || numericTimeout <= 0) {
    return DEFAULT_HEALTH_TIMEOUT_MS;
  }

  return Math.round(numericTimeout);
}

function normalizeHealthPayload(payload) {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  return {
    name: payload.name || "",
    status: payload.status || "",
    environment: payload.environment || ""
  };
}

function formatHealthCheckFailureMessage(response, payload, healthUrl) {
  const payloadMessage = payload?.error?.message || payload?.message || "";

  if (payloadMessage) {
    return payloadMessage;
  }

  if (response.status === 404) {
    return `Health endpoint not found at ${healthUrl}.`;
  }

  return `Backend health check failed with status ${response.status}.`;
}

async function checkBackendHealth(options = {}) {
  const timeoutMs = getHealthCheckTimeout(options.timeoutMs);
  const healthUrl = resolveHealthCheckUrl(desktopRuntimeConfig.apiBaseUrl);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(healthUrl, {
      method: "GET",
      headers: {
        Accept: "application/json"
      },
      cache: "no-store",
      signal: controller.signal
    });

    const payload = await response.json().catch(() => null);
    const normalizedPayload = normalizeHealthPayload(payload);

    if (!response.ok) {
      return {
        ok: false,
        healthUrl,
        statusCode: response.status,
        payload: normalizedPayload,
        message: formatHealthCheckFailureMessage(response, payload, healthUrl)
      };
    }

    if (String(normalizedPayload?.status || "").trim().toLowerCase() !== "ok") {
      return {
        ok: false,
        healthUrl,
        statusCode: response.status,
        payload: normalizedPayload,
        message: "Backend health responded, but HexaPay is not ready yet."
      };
    }

    return {
      ok: true,
      healthUrl,
      statusCode: response.status,
      payload: normalizedPayload,
      message: "HexaPay backend health check passed."
    };
  } catch (error) {
    const message = error?.name === "AbortError"
      ? `Timed out after ${timeoutMs}ms while checking the HexaPay backend.`
      : `Unable to reach the HexaPay backend. ${error?.message || "Connection failed."}`;

    return {
      ok: false,
      healthUrl,
      statusCode: 0,
      payload: null,
      message
    };
  } finally {
    clearTimeout(timeout);
  }
}

const desktopRuntimeConfig = getRuntimeConfigFromArguments();

contextBridge.exposeInMainWorld("HexaPayDesktop", Object.freeze({
  runtime: Object.freeze({
    isDesktopApp: true,
    platform: process.platform,
    apiBaseUrl: desktopRuntimeConfig.apiBaseUrl,
    isPackaged: desktopRuntimeConfig.isPackaged,
    apiBaseUrlSource: desktopRuntimeConfig.apiBaseUrlSource,
    apiBaseUrlConfigPath: desktopRuntimeConfig.apiBaseUrlConfigPath,
    healthUrl: resolveHealthCheckUrl(desktopRuntimeConfig.apiBaseUrl),
    versions: Object.freeze({
      electron: process.versions.electron,
      chrome: process.versions.chrome
    })
  }),
  clipboard: Object.freeze({
    writeText(value) {
      if (!clipboard || typeof clipboard.writeText !== "function" || typeof value !== "string") {
        return false;
      }

      clipboard.writeText(value);
      return true;
    }
  }),
  startup: Object.freeze({
    checkBackendHealth,
    openMainApp() {
      return ipcRenderer.invoke("startup:open-main-window");
    },
    exitApp() {
      return ipcRenderer.invoke("startup:exit-app");
    }
  })
}));
