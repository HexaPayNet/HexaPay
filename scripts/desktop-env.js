const fs = require("fs")
const os = require("os")
const path = require("path")

const rootDir = path.resolve(__dirname, "..")
const defaultPort = 4000
const defaultApiPrefix = "/api/v1"
const candidateDesktopEnvPaths = [
  path.join(rootDir, "hexapay.desktop.env"),
  path.join(rootDir, "dist", "electron-builder", "win-unpacked", "hexapay.desktop.env"),
  path.join(rootDir, "dist", "HexaPay-win-unpacked", "hexapay.desktop.env"),
  path.join(rootDir, "dist", "HexaPay-win-unpacked", "resources", "app", "hexapay.desktop.env")
]

function normalizeArgValue(prefix) {
  const argument = process.argv.find((value) => String(value).startsWith(`${prefix}=`))
  return argument ? argument.slice(prefix.length + 1).trim() : ""
}

function isPrivateIpv4(ipAddress) {
  if (!ipAddress || !/^\d+\.\d+\.\d+\.\d+$/.test(ipAddress)) {
    return false
  }

  const octets = ipAddress.split(".").map((value) => Number(value))

  if (octets[0] === 10 || octets[0] === 127) {
    return true
  }

  if (octets[0] === 192 && octets[1] === 168) {
    return true
  }

  return octets[0] === 172 && octets[1] >= 16 && octets[1] <= 31
}

function getDetectedIpv4Address() {
  const networkInterfaces = os.networkInterfaces()
  const privateAddresses = []
  const publicAddresses = []

  Object.values(networkInterfaces).forEach((interfaceAddresses) => {
    ;(interfaceAddresses || []).forEach((details) => {
      if (!details || details.family !== "IPv4" || details.internal) {
        return
      }

      if (isPrivateIpv4(details.address)) {
        privateAddresses.push(details.address)
        return
      }

      publicAddresses.push(details.address)
    })
  })

  return privateAddresses[0] || publicAddresses[0] || ""
}

function normalizePort(value) {
  const numericPort = Number(value)
  if (!Number.isFinite(numericPort) || numericPort <= 0) {
    return defaultPort
  }

  return Math.round(numericPort)
}

function normalizeApiPrefix(value) {
  const trimmedValue = String(value || "").trim()
  if (!trimmedValue) {
    return defaultApiPrefix
  }

  return trimmedValue.startsWith("/") ? trimmedValue : `/${trimmedValue}`
}

function normalizeBaseUrl(host, port, apiPrefix) {
  const sanitizedHost = String(host || "").trim().replace(/\/+$/, "")
  if (!sanitizedHost) {
    throw new Error("A backend host name or IP address is required.")
  }

  if (/^https?:\/\//i.test(sanitizedHost)) {
    const url = new URL(sanitizedHost)
    url.port = String(port)
    url.pathname = normalizeApiPrefix(apiPrefix)
    url.search = ""
    url.hash = ""
    return url.toString().replace(/\/+$/, "")
  }

  return `http://${sanitizedHost}:${port}${normalizeApiPrefix(apiPrefix)}`
}

function buildDesktopEnvFile(baseUrl, hostHint, mode = "local") {
  const guidanceLine = mode === "lan"
    ? "# Client computers should point to the computer running the HexaPay backend."
    : "# Local desktop runs should point to the HexaPay backend on this same computer."

  return [
    "# HexaPay desktop frontend API target.",
    guidanceLine,
    mode === "lan"
      ? "# Re-run `npm run setup:lan` on the server machine if its LAN IP changes."
      : "# Re-run `npm run setup:local` if you want to restore the desktop app to localhost.",
    `# Current backend host hint: ${hostHint}`,
    `HEXAPAY_API_BASE_URL=${baseUrl}`,
    ""
  ].join("\n")
}

function writeDesktopEnvFiles(contents) {
  const updatedPaths = []

  candidateDesktopEnvPaths.forEach((targetPath) => {
    const targetDir = path.dirname(targetPath)
    if (!fs.existsSync(targetDir)) {
      return
    }

    fs.writeFileSync(targetPath, contents, "utf8")
    updatedPaths.push(targetPath)
  })

  return updatedPaths
}

function resolveDesktopBaseUrl(options = {}) {
  const mode = String(options.mode || "local").trim().toLowerCase() === "lan" ? "lan" : "local"
  const requestedHost = String(options.host || "").trim()
  const detectedHost = getDetectedIpv4Address()
  const fallbackHost = os.hostname()
  const host = mode === "lan"
    ? (requestedHost || detectedHost || fallbackHost)
    : (requestedHost || "127.0.0.1")
  const port = normalizePort(options.port)
  const apiPrefix = normalizeApiPrefix(options.apiPrefix)

  return {
    mode,
    host,
    hostHint: mode === "lan" ? (detectedHost || fallbackHost) : "127.0.0.1",
    port,
    apiPrefix,
    baseUrl: normalizeBaseUrl(host, port, apiPrefix)
  }
}

function configureDesktopEnv(options = {}) {
  const resolved = resolveDesktopBaseUrl(options)
  const contents = buildDesktopEnvFile(resolved.baseUrl, resolved.hostHint, resolved.mode)
  const updatedPaths = writeDesktopEnvFiles(contents)

  if (!updatedPaths.length) {
    throw new Error("No desktop environment files were found to update.")
  }

  return {
    ...resolved,
    updatedPaths
  }
}

module.exports = {
  defaultPort,
  defaultApiPrefix,
  normalizeArgValue,
  getDetectedIpv4Address,
  normalizePort,
  normalizeApiPrefix,
  normalizeBaseUrl,
  buildDesktopEnvFile,
  writeDesktopEnvFiles,
  resolveDesktopBaseUrl,
  configureDesktopEnv
}
