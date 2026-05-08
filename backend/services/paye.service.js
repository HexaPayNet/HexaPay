const CompanySetting = require("../models/CompanySetting")
const sharedPaye = require("../../shared/paye")

const PAYE_CONFIGURATION_SETTING_KEY = "paye_configuration"

function serializePayeConfigurationForApi(config = {}){
  const normalizedConfig = sharedPaye.serializePayeConfiguration(config)
  return {
    paye_bands: normalizedConfig.payeBands.map((band) => ({
      up_to: Number.isFinite(band.upTo) ? band.upTo : null,
      rate: band.rate
    })),
    personal_relief: normalizedConfig.personalRelief
  }
}

async function getCompanyPayeConfiguration(companyId){
  const setting = await CompanySetting.findOne({
    companyId,
    key: PAYE_CONFIGURATION_SETTING_KEY
  }).lean()

  return sharedPaye.normalizePayeConfiguration(setting?.valueJson || {})
}

module.exports = {
  PAYE_CONFIGURATION_SETTING_KEY,
  DEFAULT_PAYE_CONFIGURATION: sharedPaye.DEFAULT_PAYE_CONFIGURATION,
  calculatePAYE: sharedPaye.calculatePAYE,
  normalizePayeConfiguration: sharedPaye.normalizePayeConfiguration,
  serializePayeConfigurationForApi,
  getCompanyPayeConfiguration
}
