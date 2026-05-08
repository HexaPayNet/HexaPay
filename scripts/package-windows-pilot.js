const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");
const electronRuntimeDir = path.join(rootDir, "node_modules", "electron", "dist");
const dotenvModuleDir = path.join(rootDir, "node_modules", "dotenv");
const outputDir = path.join(rootDir, "dist", "HexaPay-win-unpacked");
const appDir = path.join(outputDir, "resources", "app");
const packageJsonPath = path.join(rootDir, "package.json");
const desktopEnvPath = path.join(rootDir, "hexapay.desktop.env");

const appFilesToCopy = [
  "Assets",
  "shared",
  "css",
  "js",
  "Index.html",
  "main.js",
  "preload.js",
  "splash.html",
  "splash.js"
];

function ensurePathExists(targetPath, description) {
  if (!fs.existsSync(targetPath)) {
    throw new Error(`${description} was not found at ${targetPath}`);
  }
}

function copyPath(sourcePath, destinationPath) {
  fs.cpSync(sourcePath, destinationPath, {
    recursive: true,
    force: true
  });
}

function writeRuntimePackageJson() {
  const sourcePackageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
  const runtimePackageJson = {
    name: sourcePackageJson.name,
    version: sourcePackageJson.version,
    productName: "HexaPay",
    main: sourcePackageJson.main || "main.js"
  };

  fs.writeFileSync(
    path.join(appDir, "package.json"),
    `${JSON.stringify(runtimePackageJson, null, 2)}\n`
  );
}

function copyDesktopEnvFile() {
  if (!fs.existsSync(desktopEnvPath)) {
    return;
  }

  copyPath(desktopEnvPath, path.join(outputDir, "hexapay.desktop.env"));
  copyPath(desktopEnvPath, path.join(appDir, "hexapay.desktop.env"));
}

function renameElectronBinary() {
  const electronBinaryPath = path.join(outputDir, "electron.exe");
  const hexaPayBinaryPath = path.join(outputDir, "HexaPay.exe");

  if (!fs.existsSync(electronBinaryPath)) {
    return;
  }

  if (fs.existsSync(hexaPayBinaryPath)) {
    fs.rmSync(hexaPayBinaryPath, { force: true });
  }

  fs.renameSync(electronBinaryPath, hexaPayBinaryPath);
}

function packageDesktopBuild() {
  ensurePathExists(electronRuntimeDir, "Electron runtime");
  ensurePathExists(dotenvModuleDir, "dotenv module");

  fs.rmSync(outputDir, { recursive: true, force: true });
  fs.mkdirSync(appDir, { recursive: true });

  copyPath(electronRuntimeDir, outputDir);

  appFilesToCopy.forEach((relativePath) => {
    copyPath(
      path.join(rootDir, relativePath),
      path.join(appDir, relativePath)
    );
  });

  fs.mkdirSync(path.join(appDir, "node_modules"), { recursive: true });
  copyPath(dotenvModuleDir, path.join(appDir, "node_modules", "dotenv"));

  writeRuntimePackageJson();
  copyDesktopEnvFile();
  renameElectronBinary();

  console.log(`HexaPay pilot desktop package created at: ${outputDir}`);
  console.log(`Edit the LAN backend target in: ${path.join(outputDir, "hexapay.desktop.env")}`);
}

try {
  packageDesktopBuild();
} catch (error) {
  console.error("Failed to package the HexaPay pilot desktop build.", error);
  process.exitCode = 1;
}
