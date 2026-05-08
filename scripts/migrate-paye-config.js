const { ensureCompanyTaxSetup } = require("./ensure-company-tax-setup")

ensureCompanyTaxSetup({ log: console.log })
  .then(() => {
    process.exit(0)
  })
  .catch((error) => {
    console.error("PAYE migration failed.", error)
    process.exit(1)
  })
