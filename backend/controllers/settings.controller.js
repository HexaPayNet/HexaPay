const { Company, serializeCompany } = require("../utils/auth")
const CompanySetting = require("../models/CompanySetting")
const FinancialRule = require("../models/FinancialRule")
const { AUDIT_ACTIONS, AUDIT_TARGETS, recordAuditEvent } = require("../services/audit.service")
const {
  serializePayeConfigurationForApi
} = require("../services/paye.service")
const {
  STATUTORY_DEDUCTION_CONFIGURATION_SETTING_KEY,
  normalizeStatutoryConfiguration,
  serializeStatutoryConfigurationForApi
} = require("../services/statutory-deductions.service")

const DEFAULT_APPEARANCE = {
  theme: "system",
  font_scale: 100
}

const DEFAULT_PAYROLL_CALENDAR = {
  payday_day: null,
  salary_type: "monthly",
  approval_chain: ["ADMIN"]
}

const DEFAULT_BACKUP_PREFERENCES = {
  auto_backup: false,
  last_backup_at: null
}

function mergeDefaults(defaultValue, storedValue){
  return {
    ...defaultValue,
    ...(storedValue || {})
  }
}

function serializeCurrencySettings(company, storedValue = {}){
  return {
    currency_code: company.currencyCode,
    country_code: company.countryCode,
    timezone: company.timezone,
    rates_last_synced_at: storedValue.rates_last_synced_at || null,
    applied_at: storedValue.applied_at || null
  }
}

async function getActiveCompany(companyId){
  return Company.findOne({
    _id: companyId,
    status: "active"
  })
}

async function getSettingsMap(companyId){
  const settings = await CompanySetting.find({ companyId })
  return new Map(settings.map((setting) => [setting.key, setting]))
}

async function upsertSetting(companyId, key, valueJson, userId){
  return CompanySetting.findOneAndUpdate(
    { companyId, key },
    {
      $set: {
        valueJson,
        updatedByUserId: userId
      }
    },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true
    }
  )
}

function buildSettingsBundle(company, settingsMap){
  const appearance = mergeDefaults(DEFAULT_APPEARANCE, settingsMap.get("appearance")?.valueJson)
  const payrollCalendar = mergeDefaults(DEFAULT_PAYROLL_CALENDAR, settingsMap.get("payroll_calendar")?.valueJson)
  const backupPreferences = mergeDefaults(DEFAULT_BACKUP_PREFERENCES, settingsMap.get("backup_preferences")?.valueJson)
  const currency = serializeCurrencySettings(company, settingsMap.get("currency")?.valueJson)
  const statutoryConfig = normalizeStatutoryConfiguration(settingsMap.get(STATUTORY_DEDUCTION_CONFIGURATION_SETTING_KEY)?.valueJson || {})
  const tax = {
    paye: serializePayeConfigurationForApi(statutoryConfig.paye),
    statutory_deductions: serializeStatutoryConfigurationForApi(statutoryConfig)
  }

  return {
    company_id: String(company._id),
    company: serializeCompany(company),
    appearance,
    currency,
    tax,
    payroll_calendar: payrollCalendar,
    backup_preferences: backupPreferences
  }
}

function serializeFinancialRule(rule){
  if(!rule){
    return null
  }

  return {
    id: String(rule._id),
    company_id: String(rule.companyId),
    rule_type: rule.ruleType,
    name: rule.name,
    value_type: rule.valueType,
    value: rule.value,
    taxable: rule.taxable !== false,
    income_category: rule.incomeCategory || "other_taxable_income",
    scope: rule.scope,
    target_type: rule.targetType,
    target_id: rule.targetId ? String(rule.targetId) : null,
    status: rule.status,
    effective_from: rule.effectiveFrom,
    effective_to: rule.effectiveTo
  }
}

async function getSettings(req, res, next){
  try{
    const company = await getActiveCompany(req.params.companyId)

    if(!company){
      return res.status(404).json({
        error: {
          code: "COMPANY_NOT_FOUND",
          message: "Company was not found."
        }
      })
    }

    const settingsMap = await getSettingsMap(req.params.companyId)

    res.status(200).json({
      settings: buildSettingsBundle(company, settingsMap)
    })
  } catch (error){
    next(error)
  }
}

async function updateSettings(req, res, next){
  try{
    const company = await getActiveCompany(req.params.companyId)

    if(!company){
      return res.status(404).json({
        error: {
          code: "COMPANY_NOT_FOUND",
          message: "Company was not found."
        }
      })
    }

    const beforeSettingsMap = await getSettingsMap(req.params.companyId)
    const beforeSettings = buildSettingsBundle(company, beforeSettingsMap)

    if(req.body.currency){
      const currency = req.body.currency
      if(Object.prototype.hasOwnProperty.call(currency, "currency_code")){
        company.currencyCode = currency.currency_code
      }
      if(Object.prototype.hasOwnProperty.call(currency, "country_code")){
        company.countryCode = currency.country_code
      }
      if(Object.prototype.hasOwnProperty.call(currency, "timezone")){
        company.timezone = currency.timezone
      }
      await company.save()

      await upsertSetting(req.params.companyId, "currency", {
        rates_last_synced_at: currency.rates_last_synced_at || null,
        applied_at: new Date()
      }, req.currentUser._id)
    }

    if(req.body.appearance){
      await upsertSetting(req.params.companyId, "appearance", {
        ...mergeDefaults(DEFAULT_APPEARANCE, req.body.appearance)
      }, req.currentUser._id)
    }

    if(req.body.payroll_calendar){
      await upsertSetting(req.params.companyId, "payroll_calendar", {
        ...mergeDefaults(DEFAULT_PAYROLL_CALENDAR, req.body.payroll_calendar)
      }, req.currentUser._id)
    }

    if(req.body.backup_preferences){
      await upsertSetting(req.params.companyId, "backup_preferences", {
        ...mergeDefaults(DEFAULT_BACKUP_PREFERENCES, req.body.backup_preferences)
      }, req.currentUser._id)
    }

    const settingsMap = await getSettingsMap(req.params.companyId)
    const updatedSettings = buildSettingsBundle(company, settingsMap)

    await recordAuditEvent({
      req,
      action: AUDIT_ACTIONS.SETTINGS_UPDATED,
      target: {
        type: AUDIT_TARGETS.SETTINGS,
        id: req.params.companyId,
        label: company.name
      },
      before: beforeSettings,
      after: updatedSettings,
      metadata: {
        changed_sections: Object.keys(req.body || {})
      }
    })

    res.status(200).json({
      settings: updatedSettings
    })
  } catch (error){
    next(error)
  }
}

async function getAppearanceSettings(req, res, next){
  try{
    const company = await getActiveCompany(req.params.companyId)

    if(!company){
      return res.status(404).json({
        error: {
          code: "COMPANY_NOT_FOUND",
          message: "Company was not found."
        }
      })
    }

    const settingsMap = await getSettingsMap(req.params.companyId)

    res.status(200).json({
      appearance: mergeDefaults(DEFAULT_APPEARANCE, settingsMap.get("appearance")?.valueJson)
    })
  } catch (error){
    next(error)
  }
}

async function updateAppearanceSettings(req, res, next){
  try{
    const company = await getActiveCompany(req.params.companyId)

    if(!company){
      return res.status(404).json({
        error: {
          code: "COMPANY_NOT_FOUND",
          message: "Company was not found."
        }
      })
    }

    const currentSettingsMap = await getSettingsMap(req.params.companyId)
    const currentValue = currentSettingsMap.get("appearance")?.valueJson
    const beforeAppearance = mergeDefaults(DEFAULT_APPEARANCE, currentValue)
    const appearance = mergeDefaults(DEFAULT_APPEARANCE, {
      ...currentValue,
      ...req.body
    })

    await upsertSetting(req.params.companyId, "appearance", appearance, req.currentUser._id)

    await recordAuditEvent({
      req,
      action: AUDIT_ACTIONS.SETTINGS_UPDATED,
      target: {
        type: AUDIT_TARGETS.SETTINGS,
        id: req.params.companyId,
        label: `${company.name} appearance`
      },
      before: beforeAppearance,
      after: appearance,
      metadata: {
        setting_key: "appearance"
      }
    })

    res.status(200).json({
      appearance
    })
  } catch (error){
    next(error)
  }
}

async function getCurrencySettings(req, res, next){
  try{
    const company = await getActiveCompany(req.params.companyId)

    if(!company){
      return res.status(404).json({
        error: {
          code: "COMPANY_NOT_FOUND",
          message: "Company was not found."
        }
      })
    }

    const settingsMap = await getSettingsMap(req.params.companyId)

    res.status(200).json({
      currency: serializeCurrencySettings(company, settingsMap.get("currency")?.valueJson)
    })
  } catch (error){
    next(error)
  }
}

async function updateCurrencySettings(req, res, next){
  try{
    const company = await getActiveCompany(req.params.companyId)

    if(!company){
      return res.status(404).json({
        error: {
          code: "COMPANY_NOT_FOUND",
          message: "Company was not found."
        }
      })
    }

    const currentSettingsMap = await getSettingsMap(req.params.companyId)
    const beforeCurrency = serializeCurrencySettings(company, currentSettingsMap.get("currency")?.valueJson)

    if(Object.prototype.hasOwnProperty.call(req.body, "currency_code")){
      company.currencyCode = req.body.currency_code
    }
    if(Object.prototype.hasOwnProperty.call(req.body, "country_code")){
      company.countryCode = req.body.country_code
    }
    if(Object.prototype.hasOwnProperty.call(req.body, "timezone")){
      company.timezone = req.body.timezone
    }
    await company.save()

    const currency = await upsertSetting(req.params.companyId, "currency", {
      rates_last_synced_at: req.body.rates_last_synced_at || null,
      applied_at: new Date()
    }, req.currentUser._id)
    const updatedCurrency = serializeCurrencySettings(company, currency.valueJson)

    await recordAuditEvent({
      req,
      action: AUDIT_ACTIONS.SETTINGS_UPDATED,
      target: {
        type: AUDIT_TARGETS.SETTINGS,
        id: req.params.companyId,
        label: `${company.name} currency`
      },
      before: beforeCurrency,
      after: updatedCurrency,
      metadata: {
        setting_key: "currency"
      }
    })

    res.status(200).json({
      currency: updatedCurrency
    })
  } catch (error){
    next(error)
  }
}

async function getTaxSettings(req, res, next){
  try{
    const company = await getActiveCompany(req.params.companyId)

    if(!company){
      return res.status(404).json({
        error: {
          code: "COMPANY_NOT_FOUND",
          message: "Company was not found."
        }
      })
    }

    const settingsMap = await getSettingsMap(req.params.companyId)
    const statutoryConfig = normalizeStatutoryConfiguration(settingsMap.get(STATUTORY_DEDUCTION_CONFIGURATION_SETTING_KEY)?.valueJson || {})

    res.status(200).json({
      tax: {
        paye: serializePayeConfigurationForApi(statutoryConfig.paye),
        statutory_deductions: serializeStatutoryConfigurationForApi(statutoryConfig)
      }
    })
  } catch (error){
    next(error)
  }
}

async function listFinancialRules(req, res, next){
  try{
    const company = await getActiveCompany(req.params.companyId)
    if(!company){
      return res.status(404).json({
        error: {
          code: "COMPANY_NOT_FOUND",
          message: "Company was not found."
        }
      })
    }

    const rules = await FinancialRule.find({
      companyId: req.params.companyId
    }).sort({ ruleType: 1, name: 1 })
    const settingsMap = await getSettingsMap(req.params.companyId)
    const statutoryConfig = normalizeStatutoryConfiguration(settingsMap.get(STATUTORY_DEDUCTION_CONFIGURATION_SETTING_KEY)?.valueJson || {})

    res.status(200).json({
      financial_rules: rules
        .filter((rule) => !["paye", "pension", "insurance"].includes(String(rule.ruleType || "").trim().toLowerCase()))
        .map((rule) => serializeFinancialRule(rule)),
      paye_configuration: serializePayeConfigurationForApi(
        statutoryConfig.paye
      ),
      statutory_configuration: serializeStatutoryConfigurationForApi(statutoryConfig)
    })
  } catch (error){
    next(error)
  }
}

async function createFinancialRule(req, res, next){
  try{
    if(String(req.body.rule_type || "").trim().toLowerCase() === "paye"){
      return res.status(400).json({
        error: {
          code: "PAYE_CONFIGURATION_READ_ONLY",
          message: "PAYE is managed through the standard resident tax bands and is no longer editable as a percentage rule."
        }
      })
    }

    const company = await getActiveCompany(req.params.companyId)
    if(!company){
      return res.status(404).json({
        error: {
          code: "COMPANY_NOT_FOUND",
          message: "Company was not found."
        }
      })
    }

    const rule = await FinancialRule.create({
      companyId: req.params.companyId,
      ruleType: req.body.rule_type,
      name: req.body.name,
      valueType: req.body.value_type,
      value: req.body.value,
      taxable: req.body.taxable !== false,
      incomeCategory: req.body.income_category || "other_taxable_income",
      scope: req.body.scope,
      targetType: req.body.target_type || null,
      targetId: req.body.target_id || null,
      status: req.body.status || "active",
      effectiveFrom: req.body.effective_from || null,
      effectiveTo: req.body.effective_to || null
    })

    const createdRule = serializeFinancialRule(rule)

    await recordAuditEvent({
      req,
      action: AUDIT_ACTIONS.FINANCIAL_RULE_CREATED,
      target: {
        type: AUDIT_TARGETS.FINANCIAL_RULE,
        id: String(rule._id),
        label: rule.name
      },
      after: createdRule
    })

    res.status(201).json({
      financial_rule: createdRule
    })
  } catch (error){
    next(error)
  }
}

async function updateFinancialRule(req, res, next){
  try{
    const rule = await FinancialRule.findOne({
      _id: req.params.ruleId,
      companyId: req.params.companyId
    })

    if(!rule){
      return res.status(404).json({
        error: {
          code: "FINANCIAL_RULE_NOT_FOUND",
          message: "Financial rule was not found."
        }
      })
    }

    if(String(rule.ruleType || "").trim().toLowerCase() === "paye"){
      return res.status(400).json({
        error: {
          code: "PAYE_CONFIGURATION_READ_ONLY",
          message: "PAYE is managed through the standard resident tax bands and is no longer editable as a percentage rule."
        }
      })
    }

    const beforeRule = serializeFinancialRule(rule)

    const fieldMap = {
      rule_type: "ruleType",
      name: "name",
      value_type: "valueType",
      value: "value",
      taxable: "taxable",
      income_category: "incomeCategory",
      scope: "scope",
      target_type: "targetType",
      target_id: "targetId",
      status: "status",
      effective_from: "effectiveFrom",
      effective_to: "effectiveTo"
    }

    Object.entries(fieldMap).forEach(([requestKey, modelKey]) => {
      if(Object.prototype.hasOwnProperty.call(req.body, requestKey)){
        rule[modelKey] = req.body[requestKey] === "" ? null : req.body[requestKey]
      }
    })

    await rule.save()
    const updatedRule = serializeFinancialRule(rule)

    await recordAuditEvent({
      req,
      action: AUDIT_ACTIONS.FINANCIAL_RULE_UPDATED,
      target: {
        type: AUDIT_TARGETS.FINANCIAL_RULE,
        id: String(rule._id),
        label: rule.name
      },
      before: beforeRule,
      after: updatedRule
    })

    res.status(200).json({
      financial_rule: updatedRule
    })
  } catch (error){
    next(error)
  }
}

async function deleteFinancialRule(req, res, next){
  try{
    const rule = await FinancialRule.findOne({
      _id: req.params.ruleId,
      companyId: req.params.companyId
    })

    if(!rule){
      return res.status(404).json({
        error: {
          code: "FINANCIAL_RULE_NOT_FOUND",
          message: "Financial rule was not found."
        }
      })
    }

    if(String(rule.ruleType || "").trim().toLowerCase() === "paye"){
      return res.status(400).json({
        error: {
          code: "PAYE_CONFIGURATION_READ_ONLY",
          message: "PAYE is managed through the standard resident tax bands and is no longer editable as a percentage rule."
        }
      })
    }

    const beforeRule = serializeFinancialRule(rule)
    rule.status = "inactive"
    await rule.save()
    const archivedRule = serializeFinancialRule(rule)

    await recordAuditEvent({
      req,
      action: AUDIT_ACTIONS.FINANCIAL_RULE_ARCHIVED,
      target: {
        type: AUDIT_TARGETS.FINANCIAL_RULE,
        id: String(rule._id),
        label: rule.name
      },
      before: beforeRule,
      after: archivedRule
    })

    res.status(200).json({
      financial_rule: archivedRule,
      archived: true
    })
  } catch (error){
    next(error)
  }
}

module.exports = {
  getSettings,
  updateSettings,
  getAppearanceSettings,
  updateAppearanceSettings,
  getCurrencySettings,
  updateCurrencySettings,
  getTaxSettings,
  listFinancialRules,
  createFinancialRule,
  updateFinancialRule,
  deleteFinancialRule
}
