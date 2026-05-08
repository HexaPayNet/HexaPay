const {
  composeValidators,
  validateAllowedFields,
  validateCountryCodeField,
  validateCurrencyCodeField,
  validateEmailField,
  validateObjectIdParam,
  validateOptionalStringField
} = require("./_shared")

const allowedCompanyUpdateFields = new Set([
  "name",
  "industry",
  "email",
  "currency_code",
  "country_code",
  "timezone",
  "logo_url"
])

module.exports = {
  getCompany: composeValidators("companies.getCompany", [
    validateObjectIdParam("companyId")
  ]),
  updateCompany: composeValidators("companies.updateCompany", [
    validateObjectIdParam("companyId"),
    validateAllowedFields(allowedCompanyUpdateFields, "At least one company field must be provided."),
    validateEmailField("email", { label: "email" }),
    validateCurrencyCodeField("currency_code", { label: "currency_code" }),
    validateCountryCodeField("country_code", { label: "country_code" }),
    validateOptionalStringField("name", { maxLength: 160 }),
    validateOptionalStringField("industry", { maxLength: 120 }),
    validateOptionalStringField("timezone", { maxLength: 100 }),
    validateOptionalStringField("logo_url", { allowEmpty: true, maxLength: 2000 })
  ])
}
