const OBJECT_ID_PATTERN = /^[a-f\d]{24}$/i
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const CURRENCY_CODE_PATTERN = /^[A-Za-z]{3}$/
const COUNTRY_CODE_PATTERN = /^[A-Za-z]{2}$/
const ISO_DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/
const ISO_MONTH_PATTERN = /^(\d{4})-(\d{2})$/
const ISO_WEEK_PATTERN = /^(\d{4})-W(\d{2})$/
const TIME_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/

function createError(field, message){
  return { field, message }
}

function getNestedValue(target, path){
  return String(path || "")
    .split(".")
    .filter(Boolean)
    .reduce((value, segment) => value?.[segment], target)
}

function getFieldValue(req, source, path){
  return getNestedValue(req[source], path)
}

function toFieldPath(source, path){
  return `${source}.${path}`
}

function isPlainObject(value){
  return Boolean(value) && typeof value === "object" && !Array.isArray(value)
}

function isBlankString(value){
  return typeof value !== "string" || !value.trim()
}

function parseIsoDate(value){
  const match = ISO_DATE_PATTERN.exec(String(value || "").trim())
  if(!match){
    return null
  }

  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])
  const date = new Date(Date.UTC(year, month - 1, day))

  return date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
    ? date
    : null
}

function parseIsoMonth(value){
  const match = ISO_MONTH_PATTERN.exec(String(value || "").trim())
  if(!match){
    return null
  }

  const year = Number(match[1])
  const month = Number(match[2])
  if(month < 1 || month > 12){
    return null
  }

  return { year, month }
}

function parseIsoWeek(value){
  const match = ISO_WEEK_PATTERN.exec(String(value || "").trim())
  if(!match){
    return null
  }

  const year = Number(match[1])
  const week = Number(match[2])
  if(week < 1 || week > 53){
    return null
  }

  return { year, week }
}

function parseTimeValue(value){
  const match = TIME_PATTERN.exec(String(value || "").trim())
  if(!match){
    return null
  }

  return (Number(match[1]) * 60) + Number(match[2])
}

function composeValidators(name, validators){
  return {
    name,
    validate(req){
      return validators.flatMap((validator) => validator(req))
    }
  }
}

function validateAllowedFields(allowedFields, emptyMessage){
  return (req) => {
    const body = req.body || {}
    const providedFields = Object.keys(body)

    if(emptyMessage && !providedFields.length){
      return [createError("body", emptyMessage)]
    }

    return providedFields
      .filter((field) => !allowedFields.has(field))
      .map((field) => createError(toFieldPath("body", field), `${field} is not allowed.`))
  }
}

function validateObjectIdParam(paramName){
  return (req) => {
    const value = getFieldValue(req, "params", paramName)
    if(!value){
      return [createError(toFieldPath("params", paramName), `${paramName} is required.`)]
    }

    return OBJECT_ID_PATTERN.test(String(value))
      ? []
      : [createError(toFieldPath("params", paramName), `${paramName} must be a valid ObjectId.`)]
  }
}

function validateStringParam(paramName, options = {}){
  const { maxLength = null, label = paramName } = options

  return (req) => {
    const value = getFieldValue(req, "params", paramName)
    if(isBlankString(value)){
      return [createError(toFieldPath("params", paramName), `${label} is required.`)]
    }

    const normalizedValue = String(value).trim()
    return maxLength !== null && normalizedValue.length > maxLength
      ? [createError(toFieldPath("params", paramName), `${label} must be at most ${maxLength} characters long.`)]
      : []
  }
}

function validateObjectIdBody(field, options = {}){
  const { required = false } = options

  return (req) => {
    const value = getFieldValue(req, "body", field)
    if(value === undefined || value === null || value === ""){
      return required
        ? [createError(toFieldPath("body", field), `${field} is required.`)]
        : []
    }

    return OBJECT_ID_PATTERN.test(String(value))
      ? []
      : [createError(toFieldPath("body", field), `${field} must be a valid ObjectId.`)]
  }
}

function validateRequiredStringField(field, options = {}){
  const { maxLength = null, minLength = 1, label = field } = options

  return (req) => {
    const value = getFieldValue(req, "body", field)
    if(isBlankString(value)){
      return [createError(toFieldPath("body", field), `${label} is required.`)]
    }

    const normalizedValue = String(value).trim()
    const errors = []

    if(normalizedValue.length < minLength){
      errors.push(createError(toFieldPath("body", field), `${label} must be at least ${minLength} characters long.`))
    }

    if(maxLength !== null && normalizedValue.length > maxLength){
      errors.push(createError(toFieldPath("body", field), `${label} must be at most ${maxLength} characters long.`))
    }

    return errors
  }
}

function validateOptionalStringField(field, options = {}){
  const {
    maxLength = null,
    minLength = 1,
    allowEmpty = false,
    label = field
  } = options

  return (req) => {
    const value = getFieldValue(req, "body", field)
    if(value === undefined || value === null){
      return []
    }

    if(typeof value !== "string"){
      return [createError(toFieldPath("body", field), `${label} must be a string.`)]
    }

    const normalizedValue = value.trim()
    if(!normalizedValue){
      return allowEmpty
        ? []
        : [createError(toFieldPath("body", field), `${label} cannot be empty.`)]
    }

    const errors = []

    if(normalizedValue.length < minLength){
      errors.push(createError(toFieldPath("body", field), `${label} must be at least ${minLength} characters long.`))
    }

    if(maxLength !== null && normalizedValue.length > maxLength){
      errors.push(createError(toFieldPath("body", field), `${label} must be at most ${maxLength} characters long.`))
    }

    return errors
  }
}

function validateEmailField(field, options = {}){
  const { required = false, maxLength = 254, label = field } = options

  return (req) => {
    const value = getFieldValue(req, "body", field)
    if(value === undefined || value === null || value === ""){
      return required
        ? [createError(toFieldPath("body", field), `${label} is required.`)]
        : []
    }

    if(typeof value !== "string"){
      return [createError(toFieldPath("body", field), `${label} must be a string.`)]
    }

    const normalizedValue = value.trim().toLowerCase()
    const errors = []

    if(!EMAIL_PATTERN.test(normalizedValue)){
      errors.push(createError(toFieldPath("body", field), `${label} must be a valid email address.`))
    }

    if(normalizedValue.length > maxLength){
      errors.push(createError(toFieldPath("body", field), `${label} must be at most ${maxLength} characters long.`))
    }

    return errors
  }
}

function validateEnumField(field, allowedValues, options = {}){
  const { required = false, label = field } = options

  return (req) => {
    const value = getFieldValue(req, "body", field)
    if(value === undefined || value === null || value === ""){
      return required
        ? [createError(toFieldPath("body", field), `${label} is required.`)]
        : []
    }

    return allowedValues.includes(String(value))
      ? []
      : [createError(toFieldPath("body", field), `${label} must be one of: ${allowedValues.join(", ")}.`)]
  }
}

function validateBooleanField(field, options = {}){
  const { required = false, label = field } = options

  return (req) => {
    const value = getFieldValue(req, "body", field)
    if(value === undefined){
      return required
        ? [createError(toFieldPath("body", field), `${label} is required.`)]
        : []
    }

    return typeof value === "boolean"
      ? []
      : [createError(toFieldPath("body", field), `${label} must be a boolean.`)]
  }
}

function validateStrictDateField(field, options = {}){
  const { required = false, label = field } = options

  return (req) => {
    const value = getFieldValue(req, "body", field)
    if(value === undefined || value === null || value === ""){
      return required
        ? [createError(toFieldPath("body", field), `${label} is required.`)]
        : []
    }

    return parseIsoDate(value)
      ? []
      : [createError(toFieldPath("body", field), `${label} must be a valid date in YYYY-MM-DD format.`)]
  }
}

function validateDateRange(fromField, toField){
  return (req) => {
    const fromDate = parseIsoDate(getFieldValue(req, "body", fromField))
    const toDate = parseIsoDate(getFieldValue(req, "body", toField))

    if(!fromDate || !toDate){
      return []
    }

    return toDate.getTime() >= fromDate.getTime()
      ? []
      : [createError(toFieldPath("body", toField), `${toField} must be on or after ${fromField}.`)]
  }
}

function validateTimeField(field, options = {}){
  const { required = false, label = field } = options

  return (req) => {
    const value = getFieldValue(req, "body", field)
    if(value === undefined || value === null || value === ""){
      return required
        ? [createError(toFieldPath("body", field), `${label} is required.`)]
        : []
    }

    return parseTimeValue(value) !== null
      ? []
      : [createError(toFieldPath("body", field), `${label} must be in HH:mm format.`)]
  }
}

function validateTimeOrder(startField, endField){
  return (req) => {
    const startTime = parseTimeValue(getFieldValue(req, "body", startField))
    const endTime = parseTimeValue(getFieldValue(req, "body", endField))

    if(startTime === null || endTime === null){
      return []
    }

    return endTime > startTime
      ? []
      : [createError(toFieldPath("body", endField), `${endField} must be after ${startField}.`)]
  }
}

function validateNumberField(field, options = {}){
  const {
    required = false,
    min = null,
    max = null,
    integer = false,
    label = field
  } = options

  return (req) => {
    const value = getFieldValue(req, "body", field)
    if(value === undefined || value === null || value === ""){
      return required
        ? [createError(toFieldPath("body", field), `${label} is required.`)]
        : []
    }

    const numericValue = Number(value)
    if(!Number.isFinite(numericValue)){
      return [createError(toFieldPath("body", field), `${label} must be a valid number.`)]
    }

    const errors = []

    if(integer && !Number.isInteger(numericValue)){
      errors.push(createError(toFieldPath("body", field), `${label} must be an integer.`))
    }

    if(min !== null && numericValue < min){
      errors.push(createError(toFieldPath("body", field), `${label} must be at least ${min}.`))
    }

    if(max !== null && numericValue > max){
      errors.push(createError(toFieldPath("body", field), `${label} must be at most ${max}.`))
    }

    return errors
  }
}

function validateCurrencyCodeField(field, options = {}){
  const { required = false, label = field } = options

  return (req) => {
    const value = getFieldValue(req, "body", field)
    if(value === undefined || value === null || value === ""){
      return required
        ? [createError(toFieldPath("body", field), `${label} is required.`)]
        : []
    }

    return CURRENCY_CODE_PATTERN.test(String(value).trim())
      ? []
      : [createError(toFieldPath("body", field), `${label} must be a 3-letter currency code.`)]
  }
}

function validateCountryCodeField(field, options = {}){
  const { required = false, label = field } = options

  return (req) => {
    const value = getFieldValue(req, "body", field)
    if(value === undefined || value === null || value === ""){
      return required
        ? [createError(toFieldPath("body", field), `${label} is required.`)]
        : []
    }

    return COUNTRY_CODE_PATTERN.test(String(value).trim())
      ? []
      : [createError(toFieldPath("body", field), `${label} must be a 2-letter country code.`)]
  }
}

function validateMonthField(field, options = {}){
  const { required = false, label = field } = options

  return (req) => {
    const value = getFieldValue(req, "body", field)
    if(value === undefined || value === null || value === ""){
      return required
        ? [createError(toFieldPath("body", field), `${label} is required.`)]
        : []
    }

    return parseIsoMonth(value)
      ? []
      : [createError(toFieldPath("body", field), `${label} must be in YYYY-MM format.`)]
  }
}

function validateObjectField(field, options = {}){
  const { required = false, label = field } = options

  return (req) => {
    const value = getFieldValue(req, "body", field)
    if(value === undefined || value === null){
      return required
        ? [createError(toFieldPath("body", field), `${label} is required.`)]
        : []
    }

    return isPlainObject(value)
      ? []
      : [createError(toFieldPath("body", field), `${label} must be an object.`)]
  }
}

function validatePayrollPeriodField(field, salaryTypeField){
  return (req) => {
    const period = getFieldValue(req, "body", field)
    const salaryType = String(getFieldValue(req, "body", salaryTypeField) || "").trim().toLowerCase()

    if(!String(period || "").trim()){
      return [createError(toFieldPath("body", field), `${field} is required.`)]
    }

    if(salaryType === "daily"){
      return parseIsoDate(period)
        ? []
        : [createError(toFieldPath("body", field), `${field} must be in YYYY-MM-DD format for daily payroll.`)]
    }

    if(salaryType === "monthly"){
      return parseIsoMonth(period)
        ? []
        : [createError(toFieldPath("body", field), `${field} must be in YYYY-MM format for monthly payroll.`)]
    }

    if(salaryType === "weekly"){
      return parseIsoWeek(period)
        ? []
        : [createError(toFieldPath("body", field), `${field} must be in YYYY-W## format for weekly payroll.`)]
    }

    return [createError(
      toFieldPath("body", salaryTypeField),
      `${salaryTypeField} must be provided as daily, weekly, or monthly before validating ${field}.`
    )]
  }
}

module.exports = {
  composeValidators,
  createError,
  getFieldValue,
  isPlainObject,
  parseIsoDate,
  parseIsoMonth,
  parseIsoWeek,
  validateAllowedFields,
  validateBooleanField,
  validateCountryCodeField,
  validateCurrencyCodeField,
  validateDateRange,
  validateEmailField,
  validateEnumField,
  validateMonthField,
  validateNumberField,
  validateObjectField,
  validateObjectIdBody,
  validateObjectIdParam,
  validateOptionalStringField,
  validatePayrollPeriodField,
  validateRequiredStringField,
  validateStrictDateField,
  validateStringParam,
  validateTimeField,
  validateTimeOrder
}
