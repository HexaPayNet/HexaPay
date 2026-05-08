const statusTitle = document.getElementById("statusTitle");
const statusDetail = document.getElementById("statusDetail");
const retryButton = document.getElementById("retryButton");
const exitButton = document.getElementById("exitButton");
const errorBanner = document.getElementById("errorBanner");
const steps = {
  start: document.querySelector('[data-step="start"]'),
  connection: document.querySelector('[data-step="connection"]'),
  health: document.querySelector('[data-step="health"]')
};

let startupCheckInFlight = false;

function setStepState(stepName, state) {
  const step = steps[stepName];
  if (!step) {
    return;
  }

  step.dataset.state = state;
}

function setStatus(title, detail) {
  statusTitle.textContent = title;
  statusDetail.textContent = detail;
}

function showError(message) {
  errorBanner.textContent = message;
  errorBanner.dataset.visible = "true";
}

function hideError() {
  errorBanner.textContent = "";
  errorBanner.dataset.visible = "false";
}

function resetSteps() {
  setStepState("start", "active");
  setStepState("connection", "idle");
  setStepState("health", "idle");
}

function setLoadingMode(isLoading) {
  startupCheckInFlight = isLoading;
  retryButton.hidden = isLoading;
  retryButton.disabled = isLoading;
  exitButton.disabled = isLoading;
}

function wait(durationMs) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, durationMs);
  });
}

function getDesktopBridge() {
  return window.HexaPayDesktop || null;
}

function getStartupApi() {
  return getDesktopBridge()?.startup || null;
}

function getRuntime() {
  return getDesktopBridge()?.runtime || {};
}

async function waitForStartupBridge(timeoutMs = 1500) {
  const startedAt = Date.now();

  while (Date.now() - startedAt < timeoutMs) {
    const startupApi = getStartupApi();
    if (startupApi?.checkBackendHealth && startupApi?.openMainApp && startupApi?.exitApp) {
      return startupApi;
    }

    await wait(50);
  }

  return null;
}

function buildFailureMessage(result) {
  const message = result?.message || "Backend health validation failed.";
  const runtime = getRuntime();
  const healthUrl = result?.healthUrl || runtime.healthUrl || "configured health endpoint";
  return `${message} Retry after the backend is available at ${healthUrl}.`;
}

async function runStartupValidation() {
  if (startupCheckInFlight) {
    return;
  }

  const startupApi = await waitForStartupBridge();
  if (!startupApi) {
    setStatus("Startup bridge unavailable", "The secure startup API did not load correctly.");
    showError("HexaPay could not load its startup bridge. Restart the app.");
    retryButton.hidden = false;
    retryButton.disabled = false;
    return;
  }

  hideError();
  resetSteps();
  setLoadingMode(true);
  setStatus("Starting HexaPay", "Preparing startup checks.");

  await wait(160);
  setStepState("start", "complete");
  setStepState("connection", "active");
  const runtime = getRuntime();
  setStatus("Checking server connection", `Connecting to ${runtime.healthUrl || "the configured backend"}...`);

  const result = await startupApi.checkBackendHealth({
    timeoutMs: 8000
  });

  if (!result?.ok) {
    if (Number(result?.statusCode || 0) > 0) {
      setStepState("connection", "complete");
      setStepState("health", "error");
    } else {
      setStepState("connection", "error");
      setStepState("health", "idle");
    }
    setStatus("Backend unavailable", "HexaPay is waiting for the backend server.");
    showError(buildFailureMessage(result));
    setLoadingMode(false);
    return;
  }

  setStepState("connection", "complete");
  setStepState("health", "active");
  setStatus("Validating backend health", "Backend responded. Confirming readiness.");

  await wait(120);

  try {
    await startupApi.openMainApp();
    setStepState("health", "complete");
    setStatus("Opening workspace", "Backend validation passed. Loading HexaPay.");
  } catch (error) {
    setStepState("health", "error");
    setStatus("Startup failed", "Backend is healthy, but the main window could not open.");
    showError(error?.message || "HexaPay could not open the main workspace.");
    setLoadingMode(false);
  }
}

retryButton.addEventListener("click", () => {
  runStartupValidation().catch((error) => {
    setStatus("Startup failed", "An unexpected error interrupted startup.");
    showError(error?.message || "Unexpected startup error.");
    setLoadingMode(false);
  });
});

exitButton.addEventListener("click", async () => {
  exitButton.disabled = true;
  try {
    await getStartupApi()?.exitApp?.();
  } finally {
    exitButton.disabled = false;
  }
});

window.addEventListener("DOMContentLoaded", () => {
  runStartupValidation().catch((error) => {
    setStatus("Startup failed", "An unexpected error interrupted startup.");
    showError(error?.message || "Unexpected startup error.");
    setLoadingMode(false);
  });
});
