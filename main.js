const fs = require("fs");
const { app, BrowserWindow, ipcMain, nativeImage } = require("electron");
const path = require("path");
const dotenv = require("dotenv");

const APP_NAME = "HexaPay";
const APP_USER_MODEL_ID = "com.hexapay.desktop";
const DEFAULT_API_BASE_URL = "http://127.0.0.1:4000/api/v1";
const DESKTOP_ENV_FILE_NAME = "hexapay.desktop.env";
const MAIN_WINDOW_SIZE = Object.freeze({
  width: 1750,
  height: 980
});
const SPLASH_WINDOW_SIZE = Object.freeze({
  width: Math.max(Math.round(MAIN_WINDOW_SIZE.width * 0.3), 520),
  height: Math.max(Math.round(MAIN_WINDOW_SIZE.height * 0.35), 420)
});
const CUSTOM_APPDATA_ENV_KEYS = Object.freeze([
  "HEXAPAY_APPDATA_DIR",
  "HEXAPAY_USER_DATA_ROOT"
]);

let mainWindow = null;
let splashWindow = null;

function configureAppDataOverride() {
  const customAppDataRoot = CUSTOM_APPDATA_ENV_KEYS
    .map((key) => String(process.env[key] || "").trim())
    .find(Boolean);

  if (!customAppDataRoot) {
    return;
  }

  const resolvedAppDataRoot = path.resolve(customAppDataRoot);
  const resolvedUserDataPath = path.join(resolvedAppDataRoot, APP_NAME);
  const resolvedSessionDataPath = path.join(resolvedUserDataPath, "Session Data");
  const resolvedCachePath = path.join(resolvedUserDataPath, "Cache");

  fs.mkdirSync(resolvedSessionDataPath, { recursive: true });
  fs.mkdirSync(resolvedCachePath, { recursive: true });

  app.setPath("appData", resolvedAppDataRoot);
  app.setPath("userData", resolvedUserDataPath);
  app.setPath("sessionData", resolvedSessionDataPath);
  app.setPath("cache", resolvedCachePath);
}

configureAppDataOverride();

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

function getDesktopEnvCandidatePaths() {
  const candidatePaths = [];

  if (process.env.HEXAPAY_DESKTOP_ENV_PATH) {
    candidatePaths.push(path.resolve(process.env.HEXAPAY_DESKTOP_ENV_PATH));
  }

  candidatePaths.push(path.join(path.dirname(process.execPath), DESKTOP_ENV_FILE_NAME));
  candidatePaths.push(path.join(__dirname, DESKTOP_ENV_FILE_NAME));

  if (process.resourcesPath) {
    candidatePaths.push(path.join(process.resourcesPath, DESKTOP_ENV_FILE_NAME));
  }

  return [...new Set(candidatePaths)];
}

function loadDesktopRuntimeConfig() {
  let envFilePath = "";
  let parsedEnv = {};

  for (const candidatePath of getDesktopEnvCandidatePaths()) {
    try {
      if (!candidatePath || !fs.existsSync(candidatePath)) {
        continue;
      }

      parsedEnv = dotenv.parse(fs.readFileSync(candidatePath));
      envFilePath = candidatePath;
      break;
    } catch (error) {
      console.error("Failed to read HexaPay desktop environment file.", error);
    }
  }

  const rawApiBaseUrl = process.env.HEXAPAY_API_BASE_URL || parsedEnv.HEXAPAY_API_BASE_URL || DEFAULT_API_BASE_URL;

  return Object.freeze({
    apiBaseUrl: normalizeApiBaseUrl(rawApiBaseUrl),
    isPackaged: app.isPackaged,
    apiBaseUrlSource: process.env.HEXAPAY_API_BASE_URL
      ? "process.env.HEXAPAY_API_BASE_URL"
      : envFilePath
        ? DESKTOP_ENV_FILE_NAME
        : "default",
    apiBaseUrlConfigPath: envFilePath || getDesktopEnvCandidatePaths()[0] || ""
  });
}

const desktopRuntimeConfig = loadDesktopRuntimeConfig();
const encodedRuntimeConfig = encodeURIComponent(JSON.stringify(desktopRuntimeConfig));

function getWindowIcon() {
  const iconPath = path.join(__dirname, "Assets", "HexaPayEMBLEM.png");
  return nativeImage.createFromPath(iconPath);
}

function getSharedWindowPreferences() {
  return {
    preload: path.join(__dirname, "preload.js"),
    additionalArguments: [
      `--hexapay-runtime-config=${encodedRuntimeConfig}`
    ],
    nodeIntegration: false,
    contextIsolation: true,
    webSecurity: true
  };
}

function shouldOpenDevTools() {
  if (process.env.ELECTRON_DEVTOOLS === "true") {
    return true;
  }

  if (process.env.ELECTRON_DEVTOOLS === "false") {
    return false;
  }

  return !app.isPackaged;
}

function configureWindow(window) {
  window.webContents.setWindowOpenHandler(() => ({ action: "deny" }));
}

function createSplashWindow() {
  if (splashWindow && !splashWindow.isDestroyed()) {
    splashWindow.focus();
    return splashWindow;
  }

  splashWindow = new BrowserWindow({
    width: SPLASH_WINDOW_SIZE.width,
    height: SPLASH_WINDOW_SIZE.height,
    minWidth: SPLASH_WINDOW_SIZE.width,
    minHeight: SPLASH_WINDOW_SIZE.height,
    maxWidth: SPLASH_WINDOW_SIZE.width,
    maxHeight: SPLASH_WINDOW_SIZE.height,
    resizable: false,
    maximizable: false,
    minimizable: false,
    fullscreenable: false,
    useContentSize: true,
    center: true,
    frame: false,
    show: true,
    title: `${APP_NAME} Startup`,
    backgroundColor: "#163b3d",
    icon: getWindowIcon(),
    webPreferences: getSharedWindowPreferences()
  });

  configureWindow(splashWindow);
  splashWindow.removeMenu();
  splashWindow.loadFile("splash.html");

  splashWindow.on("closed", () => {
    splashWindow = null;
  });

  return splashWindow;
}

function createMainWindow() {
  if (mainWindow && !mainWindow.isDestroyed()) {
    return mainWindow;
  }

  mainWindow = new BrowserWindow({
    width: MAIN_WINDOW_SIZE.width,
    height: MAIN_WINDOW_SIZE.height,
    minWidth: 1500,
    minHeight: 900,
    title: APP_NAME,
    icon: getWindowIcon(),
    show: false,
    webPreferences: getSharedWindowPreferences()
  });

  configureWindow(mainWindow);
  mainWindow.loadFile("Index.html");

  if (shouldOpenDevTools()) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  return mainWindow;
}

function closeSplashWindow() {
  if (splashWindow && !splashWindow.isDestroyed()) {
    splashWindow.close();
  }
}

async function openMainWindowFromStartup() {
  const existingMainWindow = mainWindow && !mainWindow.isDestroyed()
    ? mainWindow
    : createMainWindow();

  if (existingMainWindow.isVisible()) {
    existingMainWindow.focus();
    closeSplashWindow();
    return { opened: true };
  }

  return new Promise((resolve) => {
    const showMainWindow = () => {
      existingMainWindow.show();
      existingMainWindow.focus();
      closeSplashWindow();
      resolve({ opened: true });
    };

    if (existingMainWindow.webContents.isLoading()) {
      existingMainWindow.once("ready-to-show", showMainWindow);
      return;
    }

    showMainWindow();
  });
}

function registerStartupIpc() {
  ipcMain.handle("startup:open-main-window", async () => openMainWindowFromStartup());
  ipcMain.handle("startup:exit-app", () => {
    app.quit();
    return { exiting: true };
  });
}

app.setName(APP_NAME);

if (process.platform === "win32") {
  app.setAppUserModelId(APP_USER_MODEL_ID);
}

app.whenReady().then(() => {
  registerStartupIpc();
  createSplashWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.focus();
    return;
  }

  createSplashWindow();
});
