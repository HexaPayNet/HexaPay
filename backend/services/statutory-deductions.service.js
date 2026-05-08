const CompanySetting = require("../models/CompanySetting")
const sharedStatutory = require("../../shared/statutory-deductions")
const { serializePayeConfigurationForApi } = require("./paye.service")

const STATUTORY_DEDUCTION_CONFIGURATION_SETTING_KEY = "statutory_deduction_configuration"

async function getCompanyStatutoryConfiguration(companyId){
  const setting = await CompanySetting.findOne({
    companyId,
    key: STATUTORY_DEDUCTION_CONFIGURATION_SETTING_KEY
  }).lean()

  return sharedStatutory.normalizeStatutoryConfiguration(setting?.valueJson || {})
}

function serializeStatutoryConfigurationForApi(config = {}){
  const normalizedConfig = sharedStatutory.normalizeStatutoryConfiguration(config)
  return {
    paye: serializePayeConfigurationForApi(normalizedConfig.paye),
    shif: {
      employee_rate: normalizedConfig.shif.employeeRate,
      minimum_contribution: normalizedConfig.shif.minimumContribution
    },
    nssf: {
      employee_rate: normalizedConfig.nssf.employeeRate,
      lower_earnings_limit: normalizedConfig.nssf.lowerEarningsLimit,
      upper_earnings_limit: normalizedConfig.nssf.upperEarningsLimit
    },
    housing_levy: {
      employee_rate: normalizedConfig.housingLevy.employeeRate
    }
  }
}

module.exports = {
  STATUTORY_DEDUCTION_CONFIGURATION_SETTING_KEY,
  DEFAULT_STATUTORY_CONFIGURATION: sharedStatutory.DEFAULT_STATUTORY_CONFIGURATION,
  normalizeStatutoryConfiguration: sharedStatutory.normalizeStatutoryConfiguration,
  calculatePayrollPreview: sharedStatutory.calculatePayrollPreview,
  calculateStatutoryDeductions: sharedStatutory.calculateStatutoryDeductions,
  calculateGrossPay: sharedStatutory.calculateGrossPay,
  calculateTaxablePay: sharedStatutory.calculateTaxablePay,
  normalizeIncomeItems: sharedStatutory.normalizeIncomeItems,
  validateGrossSalaryInput: sharedStatutory.validateGrossSalaryInput,
  getCompanyStatutoryConfiguration,
  serializeStatutoryConfigurationForApi
}
