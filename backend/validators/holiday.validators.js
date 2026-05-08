const { HOLIDAY_SCOPES, RECORD_STATUSES } = require("../models/constants")
const {
  composeValidators,
  createError,
  getFieldValue,
  validateAllowedFields,
  validateCountryCodeField,
  validateEnumField,
  validateObjectIdParam,
  validateOptionalStringField,
  validateRequiredStringField,
  validateStrictDateField
} = require("./_shared")

const allowedHolidayFields = new Set(["scope", "name", "date", "country_code", "status"])

function validateHolidayScopeCountryCode(req){
  const scope = String(getFieldValue(req, "body", "scope") || "").trim().toLowerCase()
  const countryCode = getFieldValue(req, "body", "country_code")

  if(scope !== "company" || countryCode === undefined){
    return []
  }

  return String(countryCode || "").trim()
    ? [createError("body.country_code", "country_code is only allowed for national holidays.")]
    : []
}

module.exports = {
  listHolidays: composeValidators("holidays.listHolidays", [
    validateObjectIdParam("companyId")
  ]),
  createHoliday: composeValidators("holidays.createHoliday", [
    validateObjectIdParam("companyId"),
    validateAllowedFields(allowedHolidayFields),
    validateRequiredStringField("name", { maxLength: 160 }),
    validateStrictDateField("date", { required: true }),
    validateEnumField("scope", HOLIDAY_SCOPES),
    validateCountryCodeField("country_code"),
    validateEnumField("status", RECORD_STATUSES.company),
    validateHolidayScopeCountryCode,
    validateOptionalStringField("name", { maxLength: 160 })
  ]),
  getHoliday: composeValidators("holidays.getHoliday", [
    validateObjectIdParam("companyId"),
    validateObjectIdParam("holidayId")
  ]),
  updateHoliday: composeValidators("holidays.updateHoliday", [
    validateObjectIdParam("companyId"),
    validateObjectIdParam("holidayId"),
    validateAllowedFields(allowedHolidayFields, "At least one holiday field must be provided."),
    validateEnumField("scope", HOLIDAY_SCOPES),
    validateStrictDateField("date"),
    validateCountryCodeField("country_code"),
    validateEnumField("status", RECORD_STATUSES.company),
    validateHolidayScopeCountryCode,
    validateOptionalStringField("name", { maxLength: 160 })
  ]),
  deleteHoliday: composeValidators("holidays.deleteHoliday", [
    validateObjectIdParam("companyId"),
    validateObjectIdParam("holidayId")
  ])
}
