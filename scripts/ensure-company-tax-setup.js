const { connectDb } = require("../backend/config/db")
const Company = require("../backend/models/Company")
const CompanySetting = require("../backend/models/CompanySetting")
const FinancialRule = require("../backend/models/FinancialRule")
const {
  PAYE_CONFIGURATION_SETTING_KEY,
  DEFAULT_PAYE_CONFIGURATION,
  normalizePayeConfiguration
} = require("../backend/services/paye.service")
const {
  STATUTORY_DEDUCTION_CONFIGURATION_SETTING_KEY,
  DEFAULT_STATUTORY_CONFIGURATION,
  normalizeStatutoryConfiguration
} = require("../backend/services/statutory-deductions.service")

async function ensureCompanyTaxSetup(options = {}) {
  const logger = typeof options.log === "function" ? options.log : () => {}

  await connectDb()

  const companies = await Company.find({}).select({ _id: 1, name: 1 }).lean()
  const normalizedPayeConfiguration = normalizePayeConfiguration(DEFAULT_PAYE_CONFIGURATION)
  const normalizedStatutoryConfiguration = normalizeStatutoryConfiguration(DEFAULT_STATUTORY_CONFIGURATION)
  const summary = {
    companiesProcessed: 0,
    payeSettingsEnsured: 0,
    statutorySettingsEnsured: 0,
    legacyPayeRulesArchived: 0
  }

  for (const company of companies) {
    await CompanySetting.findOneAndUpdate(
      {
        companyId: company._id,
        key: PAYE_CONFIGURATION_SETTING_KEY
      },
      {
        $setOnInsert: {
          valueJson: {
            payeBands: normalizedPayeConfiguration.payeBands,
            personalRelief: normalizedPayeConfiguration.personalRelief
          }
        }
      },
      {
        upsert: true,
        new: true
      }
    )

    await CompanySetting.findOneAndUpdate(
      {
        companyId: company._id,
        key: STATUTORY_DEDUCTION_CONFIGURATION_SETTING_KEY
      },
      {
        $setOnInsert: {
          valueJson: {
            paye: normalizedStatutoryConfiguration.paye,
            shif: normalizedStatutoryConfiguration.shif,
            nssf: normalizedStatutoryConfiguration.nssf,
            housingLevy: normalizedStatutoryConfiguration.housingLevy
          }
        }
      },
      {
        upsert: true,
        new: true
      }
    )

    const archiveResult = await FinancialRule.updateMany(
      {
        companyId: company._id,
        ruleType: "paye",
        status: { $ne: "inactive" }
      },
      {
        $set: {
          status: "inactive"
        }
      }
    )

    summary.companiesProcessed += 1
    summary.payeSettingsEnsured += 1
    summary.statutorySettingsEnsured += 1
    summary.legacyPayeRulesArchived += Number(archiveResult.modifiedCount || 0)

    logger(
      `Ensured tax setup for ${company.name}: paye_configuration + statutory_deduction_configuration ready, archived ${archiveResult.modifiedCount || 0} legacy PAYE rule(s).`
    )
  }

  return summary
}

async function runAsScript() {
  const summary = await ensureCompanyTaxSetup({ log: console.log })
  console.log(
    `Completed tax setup for ${summary.companiesProcessed} compan${summary.companiesProcessed === 1 ? "y" : "ies"}. ` +
    `Ensured ${summary.payeSettingsEnsured} PAYE setting(s), ${summary.statutorySettingsEnsured} statutory setting(s), ` +
    `archived ${summary.legacyPayeRulesArchived} legacy PAYE rule(s).`
  )
}

if (require.main === module) {
  runAsScript()
    .then(() => {
      process.exit(0)
    })
    .catch((error) => {
      console.error("Tax setup failed.", error)
      process.exit(1)
    })
}

module.exports = {
  ensureCompanyTaxSetup
}
