const { configureDesktopEnv, normalizeArgValue } = require("./desktop-env")

function main() {
  const requestedHost = normalizeArgValue("--host")
  const port = normalizeArgValue("--port")
  const apiPrefix = normalizeArgValue("--api-prefix")
  const result = configureDesktopEnv({
    mode: "lan",
    host: requestedHost,
    port,
    apiPrefix
  })

  console.log(`Configured HexaPay desktop clients to use ${result.baseUrl}`)
  result.updatedPaths.forEach((targetPath) => {
    console.log(`Updated: ${targetPath}`)
  })
}

try {
  main()
} catch (error) {
  console.error("Failed to configure the HexaPay LAN backend target.", error)
  process.exitCode = 1
}
