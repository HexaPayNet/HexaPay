const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");
const sourcePngPath = path.join(rootDir, "Assets", "HexaPayEMBLEM.png");
const outputIcoPath = path.join(rootDir, "Assets", "HexaPayEMBLEM.ico");

function readPngSize(pngBuffer) {
  const pngSignature = "89504e470d0a1a0a";
  if (pngBuffer.subarray(0, 8).toString("hex") !== pngSignature) {
    throw new Error("Source icon must be a valid PNG file.");
  }

  const width = pngBuffer.readUInt32BE(16);
  const height = pngBuffer.readUInt32BE(20);

  if (!width || !height) {
    throw new Error("Could not determine PNG dimensions.");
  }

  return { width, height };
}

function buildIcoBufferFromPng(pngBuffer) {
  const { width, height } = readPngSize(pngBuffer);
  const iconDir = Buffer.alloc(6);
  iconDir.writeUInt16LE(0, 0);
  iconDir.writeUInt16LE(1, 2);
  iconDir.writeUInt16LE(1, 4);

  const iconEntry = Buffer.alloc(16);
  iconEntry.writeUInt8(width >= 256 ? 0 : width, 0);
  iconEntry.writeUInt8(height >= 256 ? 0 : height, 1);
  iconEntry.writeUInt8(0, 2);
  iconEntry.writeUInt8(0, 3);
  iconEntry.writeUInt16LE(1, 4);
  iconEntry.writeUInt16LE(32, 6);
  iconEntry.writeUInt32LE(pngBuffer.length, 8);
  iconEntry.writeUInt32LE(iconDir.length + iconEntry.length, 12);

  return Buffer.concat([iconDir, iconEntry, pngBuffer]);
}

function main() {
  if (!fs.existsSync(sourcePngPath)) {
    throw new Error(`HexaPay emblem PNG not found at ${sourcePngPath}`);
  }

  const pngBuffer = fs.readFileSync(sourcePngPath);
  const icoBuffer = buildIcoBufferFromPng(pngBuffer);
  fs.writeFileSync(outputIcoPath, icoBuffer);

  console.log(`Windows icon generated at: ${outputIcoPath}`);
}

try {
  main();
} catch (error) {
  console.error("Failed to generate the Windows icon file.", error);
  process.exitCode = 1;
}
