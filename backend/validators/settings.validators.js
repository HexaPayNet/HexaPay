const { MEMBERSHIP_ROLES } = require("../models/constants")
const { parseIsoDate } = require("./_shared")

function validateObjectIdParam(paramName){
  return (req) => {
    const value = req.params?.[paramName]
    const objectIdPattern = /^[a-f\d]{24}$/i

    if(!value){
      return [{
        field: `params.${paramName}`,
        message: `${paramName} is required.`
      }]
    }

    return objectIdPattern.test(String(value))
      ? []
      : [{
          field: `params.${paramName}`,
          message: `${paramName} must be a valid ObjectId.`
        }]
  }
}

function validateAllowedTopLevelFields(req){
  const allowedFields = new Set([
    "appearance",
    "currency",
    "payroll_calendar",
    "backup_preferences"
  ])
  const body = req.body || {}
  const providedFields = Object.keys(body)

  if(!providedFields.length){
    return [{
      field: "body",
      message: "At least one settings section must be provided."
    }]
  }

  return providedFields
    .filter((field) => !allowedFields.has(field))
    .map((field) => ({
      field: `body.${field}`,
      message: `${field} is not allowed.`
    }))
}

function validateAppearanceObject(req){
  const value = req.body?.appearance
  if(value === undefined){
    return []
  }

  if(!value || typeof value !== "object" || Array.isArray(value)){
    return [{
      field: "body.appearance",
      message: "appearance must be an object."
    }]
  }

  const allowedFields = new Set(["theme", "font_scale"])
  return Object.keys(value)
    .filter((field) => !allowedFields.has(field))
    .map((field) => ({
      field: `body.appearance.${field}`,
      message: `${field} is not allowed in appearance settings.`
    }))
}

function validateAppearanceTheme(value, fieldPath){
  if(value === undefined){
    return []
  }

  return ["light", "dark", "system"].includes(String(value))
    ? []
    : [{
        field: fieldPath,
        message: "theme must be one of: light, dark, system."
      }]
}

function validateAppearanceFontScale(value, fieldPath){
  if(value === undefined){
    return []
  }

  const numericValue = Number(value)
  return Number.isFinite(numericValue) && numericValue >= 50 && numericValue <= 200
    ? []
    : [{
        field: fieldPath,
        message: "font_scale must be a number between 50 and 200."
      }]
}

function validateCurrencyObject(req){
  const value = req.body?.currency
  if(value === undefined){
    return []
  }

  if(!value || typeof value !== "object" || Array.isArray(value)){
    return [{
      field: "body.currency",
      message: "currency must be an object."
    }]
  }

  const allowedFields = new Set(["currency_code", "country_code", "timezone", "rates_last_synced_at"])
  return Object.keys(value)
    .filter((field) => !allowedFields.has(field))
    .map((field) => ({
      field: `body.currency.${field}`,
      message: `${field} is not allowed in currency settings.`
    }))
}

function validateCurrencyFieldsFromObject(currency, prefix){
  if(!currency || typeof currency !== "object" || Array.isArray(currency)){
    return []
  }

  const errors = []
  if(currency.currency_code !== undefined && !/^[A-Za-z]{3}$/.test(String(currency.currency_code).trim())){
    errors.push({
      field: `${prefix}.currency_code`,
      message: "currency_code must be a 3-letter currency code."
    })
  }
  if(currency.country_code !== undefined && !/^[A-Za-z]{2}$/.test(String(currency.country_code).trim())){
    errors.push({
      field: `${prefix}.country_code`,
      message: "country_code must be a 2-letter country code."
    })
  }
  if(currency.timezone !== undefined && !String(currency.timezone).trim()){
    errors.push({
      field: `${prefix}.timezone`,
      message: "timezone cannot be empty."
    })
  }
  if(currency.rates_last_synced_at !== undefined && Number.isNaN(new Date(currency.rates_last_synced_at).getTime())){
    errors.push({
      field: `${prefix}.rates_last_synced_at`,
      message: "rates_last_synced_at must be a valid date."
    })
  }

  return errors
}

function validatePayrollCalendarObject(req){
  const value = req.body?.payroll_calendar
  if(value === undefined){
    return []
  }

  if(!value || typeof value !== "object" || Array.isArray(value)){
    return [{
      field: "body.payroll_calendar",
      message: "payroll_calendar must be an object."
    }]
  }

  const allowedFields = new Set(["payday_day", "salary_type", "approval_chain"])
  return Object.keys(value)
    .filter((field) => !allowedFields.has(field))
    .map((field) => ({
      field: `body.payroll_calendar.${field}`,
      message: `${field} is not allowed in payroll_calendar.`
    }))
}

function validatePayrollCalendarFields(req){
  const value = req.body?.payroll_calendar
  if(value === undefined || !value || typeof value !== "object" || Array.isArray(value)){
    return []
  }

  const errors = []
  if(value.payday_day !== undefined){
    const numericValue = Number(value.payday_day)
    if(!Number.isInteger(numericValue) || numericValue < 1 || numericValue > 31){
      errors.push({
        field: "body.payroll_calendar.payday_day",
        message: "payday_day must be an integer between 1 and 31."
      })
    }
  }

  if(value.salary_type !== undefined && !["monthly", "weekly"].includes(String(value.salary_type))){
    errors.push({
      field: "body.payroll_calendar.salary_type",
      message: "salary_type must be one of: monthly, weekly."
    })
  }

  if(value.approval_chain !== undefined){
    if(!Array.isArray(value.approval_chain)){
      errors.push({
        field: "body.payroll_calendar.approval_chain",
        message: "approval_chain must be an array."
      })
    } else {
      value.approval_chain.forEach((entry, index) => {
        const normalizedEntry = String(entry || "").trim().toUpperCase()
        if(!normalizedEntry){
          errors.push({
            field: `body.payroll_calendar.approval_chain.${index}`,
            message: "approval_chain entries cannot be empty."
          })
          return
        }

        if(!MEMBERSHIP_ROLES.includes(normalizedEntry)){
          errors.push({
            field: `body.payroll_calendar.approval_chain.${index}`,
            message: `approval_chain entries must be one of: ${MEMBERSHIP_ROLES.join(", ")}.`
          })
        }
      })
    }
  }

  return errors
}

function validateBackupPreferencesObject(req){
  const value = req.body?.backup_preferences
  if(value === undefined){
    return []
  }

  if(!value || typeof value !== "object" || Array.isArray(value)){
    return [{
      field: "body.backup_preferences",
      message: "backup_preferences must be an object."
    }]
  }

  const allowedFields = new Set(["auto_backup", "last_backup_at"])
  return Object.keys(value)
    .filter((field) => !allowedFields.has(field))
    .map((field) => ({
      field: `body.backup_preferences.${field}`,
      message: `${field} is not allowed in backup_preferences.`
    }))
}

function validateBackupPreferencesFields(req){
  const value = req.body?.backup_preferences
  if(value === undefined || !value || typeof value !== "object" || Array.isArray(value)){
    return []
  }

  const errors = []
  if(value.auto_backup !== undefined && typeof value.auto_backup !== "boolean"){
    errors.push({
      field: "body.backup_preferences.auto_backup",
      message: "auto_backup must be a boolean."
    })
  }
  if(value.last_backup_at !== undefined && value.last_backup_at !== null && Number.isNaN(new Date(value.last_backup_at).getTime())){
    errors.push({
      field: "body.backup_preferences.last_backup_at",
      message: "last_backup_at must be a valid date or null."
    })
  }
  return errors
}

function validateAppearancePatchBody(req){
  const body = req.body || {}
  const providedFields = Object.keys(body)
  const allowedFields = new Set(["theme", "font_scale"])

  if(!providedFields.length){
    return [{
      field: "body",
      message: "At least one appearance field must be provided."
    }]
  }

  return providedFields
    .filter((field) => !allowedFields.has(field))
    .map((field) => ({
      field: `body.${field}`,
      message: `${field} is not allowed in appearance settings.`
    }))
}

function validateCurrencyPatchBody(req){
  const body = req.body || {}
  const providedFields = Object.keys(body)
  const allowedFields = new Set(["currency_code", "country_code", "timezone", "rates_last_synced_at"])

  if(!providedFields.length){
    return [{
      field: "body",
      message: "At least one currency field must be provided."
    }]
  }

  return providedFields
      .filter((field) => !allowedFields.has(field))
      .map((field) => ({
        field: `body.${field}`,
        message: `${field} is not allowed in currency settings.`
      }))
}

function validateAllowedFinancialRuleFields(req, requireAtLeastOne = false){
  const allowedFields = new Set([
    "rule_type",
    "name",
    "value_type",
    "value",
    "taxable",
    "income_category",
    "scope",
    "target_type",
    "target_id",
    "status",
    "effective_from",
    "effective_to"
  ])
  const body = req.body || {}
  const providedFields = Object.keys(body)

  if(requireAtLeastOne && !providedFields.length){
    return [{
      field: "body",
      message: "At least one financial rule field must be provided."
    }]
  }

  return providedFields
    .filter((field) => !allowedFields.has(field))
    .map((field) => ({
      field: `body.${field}`,
      message: `${field} is not allowed in financial rules.`
    }))
}

function validateFinancialRuleEnums(req, requireRequiredFields = false){
  const errors = []
  const body = req.body || {}

  const enumChecks = [
    ["rule_type", ["pension", "insurance", "custom_deduction", "bonus", "incentive", "overtime_rate"]],
    ["value_type", ["percentage", "flat_amount", "hourly_rate"]],
    ["scope", ["company", "department", "employee", "role"]],
    ["target_type", ["department", "employee", "role"]],
    ["status", ["active", "inactive"]]
  ]

  enumChecks.forEach(([field, allowedValues]) => {
    const value = body[field]
    if(value === undefined){
      if(requireRequiredFields && ["rule_type", "name", "value_type", "value", "scope"].includes(field)){
        errors.push({
          field: `body.${field}`,
          message: `${field} is required.`
        })
      }
      return
    }

    if(value === null || value === ""){
      if(field === "target_type"){
        return
      }
      errors.push({
        field: `body.${field}`,
        message: `${field} cannot be empty.`
      })
      return
    }

    if(!allowedValues.includes(String(value))){
      errors.push({
        field: `body.${field}`,
        message: `${field} must be one of: ${allowedValues.join(", ")}.`
      })
    }
  })

  if(requireRequiredFields && !String(body.name || "").trim()){
    errors.push({
      field: "body.name",
      message: "name is required."
    })
  }

  if(body.value !== undefined){
    const numericValue = Number(body.value)
    if(!Number.isFinite(numericValue) || numericValue < 0){
      errors.push({
        field: "body.value",
        message: "value must be a non-negative number."
      })
    }
  } else if(requireRequiredFields){
    errors.push({
      field: "body.value",
      message: "value is required."
    })
  }

  if(body.taxable !== undefined && typeof body.taxable !== "boolean"){
    errors.push({
      field: "body.taxable",
      message: "taxable must be a boolean."
    })
  }

  if(body.income_category !== undefined && !String(body.income_category || "").trim()){
    errors.push({
      field: "body.income_category",
      message: "income_category cannot be empty."
    })
  } else if(body.income_category !== undefined && String(body.income_category).trim().length > 80){
    errors.push({
      field: "body.income_category",
      message: "income_category must be at most 80 characters long."
    })
  }

  if(body.target_id !== undefined && body.target_id !== null && body.target_id !== "" && !/^[a-f\d]{24}$/i.test(String(body.target_id))){
    errors.push({
      field: "body.target_id",
      message: "target_id must be a valid ObjectId."
    })
  }

  if(body.effective_from !== undefined && body.effective_from !== null && !parseIsoDate(body.effective_from)){
    errors.push({
      field: "body.effective_from",
      message: "effective_from must be a valid date in YYYY-MM-DD format."
    })
  }

  if(body.effective_to !== undefined && body.effective_to !== null && !parseIsoDate(body.effective_to)){
    errors.push({
      field: "body.effective_to",
      message: "effective_to must be a valid date in YYYY-MM-DD format."
    })
  }

  if(body.rule_type !== undefined && String(body.rule_type || "").trim().toLowerCase() === "paye"){
    errors.push({
      field: "body.rule_type",
      message: "rule_type cannot be paye because PAYE is managed through the standard tax configuration."
    })
  }

  if(body.name !== undefined){
    const normalizedName = String(body.name || "").trim()
    if(!normalizedName){
      errors.push({
        field: "body.name",
        message: "name cannot be empty."
      })
    } else if(normalizedName.length > 160){
      errors.push({
        field: "body.name",
        message: "name must be at most 160 characters long."
      })
    }
  }

  const effectiveFrom = parseIsoDate(body.effective_from)
  const effectiveTo = parseIsoDate(body.effective_to)
  if(effectiveFrom && effectiveTo && effectiveTo.getTime() < effectiveFrom.getTime()){
    errors.push({
      field: "body.effective_to",
      message: "effective_to must be on or after effective_from."
    })
  }

  return errors
}

function composeValidators(name, validators){
  return {
    name,
    validate(req){
      return validators.flatMap((validator) => validator(req))
    }
  }
}

module.exports = {
  getSettings: composeValidators("settings.getSettings", [
    validateObjectIdParam("companyId")
  ]),
  updateSettings: composeValidators("settings.updateSettings", [
    validateObjectIdParam("companyId"),
    validateAllowedTopLevelFields,
    validateAppearanceObject,
    (req) => validateAppearanceTheme(req.body?.appearance?.theme, "body.appearance.theme"),
    (req) => validateAppearanceFontScale(req.body?.appearance?.font_scale, "body.appearance.font_scale"),
    validateCurrencyObject,
    (req) => validateCurrencyFieldsFromObject(req.body?.currency, "body.currency"),
    validatePayrollCalendarObject,
    validatePayrollCalendarFields,
    validateBackupPreferencesObject,
    validateBackupPreferencesFields
  ]),
  getAppearanceSettings: composeValidators("settings.getAppearanceSettings", [
    validateObjectIdParam("companyId")
  ]),
  updateAppearanceSettings: composeValidators("settings.updateAppearanceSettings", [
    validateObjectIdParam("companyId"),
    validateAppearancePatchBody,
    (req) => validateAppearanceTheme(req.body?.theme, "body.theme"),
    (req) => validateAppearanceFontScale(req.body?.font_scale, "body.font_scale")
  ]),
  getCurrencySettings: composeValidators("settings.getCurrencySettings", [
    validateObjectIdParam("companyId")
  ]),
  getTaxSettings: composeValidators("settings.getTaxSettings", [
    validateObjectIdParam("companyId")
  ]),
  updateCurrencySettings: composeValidators("settings.updateCurrencySettings", [
    validateObjectIdParam("companyId"),
    validateCurrencyPatchBody,
    (req) => validateCurrencyFieldsFromObject(req.body, "body")
  ]),
  listFinancialRules: composeValidators("settings.listFinancialRules", [
    validateObjectIdParam("companyId")
  ]),
  createFinancialRule: composeValidators("settings.createFinancialRule", [
    validateObjectIdParam("companyId"),
    (req) => validateAllowedFinancialRuleFields(req),
    (req) => validateFinancialRuleEnums(req, true)
  ]),
  updateFinancialRule: composeValidators("settings.updateFinancialRule", [
    validateObjectIdParam("companyId"),
    validateObjectIdParam("ruleId"),
    (req) => validateAllowedFinancialRuleFields(req, true),
    (req) => validateFinancialRuleEnums(req, false)
  ]),
  deleteFinancialRule: composeValidators("settings.deleteFinancialRule", [
    validateObjectIdParam("companyId"),
    validateObjectIdParam("ruleId")
  ])
}
