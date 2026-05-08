const { configureDesktopEnv, normalizeArgValue } = require("./desktop-env")
const { ensureCompanyTaxSetup } = require("./ensure-company-tax-setup")

async function main() {
  const desktopMode = normalizeArgValue("--desktop") || "local"
  const desktopHost = normalizeArgValue("--host")
  const port = normalizeArgValue("--port")
  const apiPrefix = normalizeArgValue("--api-prefix")
  const skipTaxSetup = process.argv.includes("--skip-tax-setup")

  const desktopConfig = configureDesktopEnv({
    mode: desktopMode,
    host: desktopHost,
    port,
    apiPrefix
  })

  console.log(`Configured HexaPay desktop app to use ${desktopConfig.baseUrl}`)
  desktopConfig.updatedPaths.forEach((targetPath) => {
    console.log(`Updated desktop runtime config: ${targetPath}`)
  })

  if (skipTaxSetup) {
    console.log("Skipped company tax setup by request.")
    return
  }

  const summary = await ensureCompanyTaxSetup({ log: console.log })
  console.log(
    `Setup complete: ${summary.companiesProcessed} compan${summary.companiesProcessed === 1 ? "y" : "ies"} ready, ` +
    `${summary.legacyPayeRulesArchived} legacy PAYE rule(s) archived.`
  )
}

main().catch((error) => {
  console.error("HexaPay setup failed.", error)
  process.exit(1)
})
