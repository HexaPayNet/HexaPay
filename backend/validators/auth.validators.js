const {
  composeValidators,
  createError,
  getFieldValue,
  isPlainObject,
  validateAllowedFields,
  validateCountryCodeField,
  validateCurrencyCodeField,
  validateEmailField,
  validateObjectIdBody,
  validateOptionalStringField,
  validateRequiredStringField
} = require("./_shared")

function validatePasswordField(field){
  return (req) => {
    const value = getFieldValue(req, "body", field)
    if(typeof value !== "string" || !value){
      return [createError(`body.${field}`, `${field} is required.`)]
    }

    const errors = []

    if(value.length < 8){
      errors.push(createError(`body.${field}`, `${field} must be at least 8 characters long.`))
    }

    if(value.length > 128){
      errors.push(createError(`body.${field}`, `${field} must be at most 128 characters long.`))
    }

    const hasUppercase = /[A-Z]/.test(value)
    const hasLowercase = /[a-z]/.test(value)
    const hasDigit = /\d/.test(value)
    const hasSpecialCharacter = /[^A-Za-z0-9]/.test(value)

    if(!(hasUppercase && hasLowercase && hasDigit && hasSpecialCharacter)){
      errors.push(createError(
        `body.${field}`,
        `${field} must include at least one uppercase letter, one lowercase letter, one number, and one special character.`
      ))
    }

    return errors
  }
}

function validateLoginPasswordField(field){
  return (req) => {
    const value = getFieldValue(req, "body", field)
    if(typeof value !== "string" || !value){
      return [createError(`body.${field}`, `${field} is required.`)]
    }

    return value.length <= 128
      ? []
      : [createError(`body.${field}`, `${field} must be at most 128 characters long.`)]
  }
}

function validateCompanyPayload(req){
  const company = getFieldValue(req, "body", "company")
  if(!isPlainObject(company)){
    return [createError("body.company", "company must be an object.")]
  }

  const companyRequest = {
    body: company
  }

  return [
    ...validateRequiredStringField("name", { maxLength: 160 })(companyRequest),
    ...validateRequiredStringField("industry", { maxLength: 120 })(companyRequest),
    ...validateCurrencyCodeField("currency_code", { required: true })(companyRequest),
    ...validateCountryCodeField("country_code", { required: true })(companyRequest),
    ...validateRequiredStringField("timezone", { maxLength: 100 })(companyRequest),
    ...validateOptionalStringField("logo_url", { allowEmpty: true })(companyRequest)
  ].map((error) => ({
    ...error,
    field: error.field.replace(/^body\./, "body.company.")
  }))
}

function validateProfileUpdatePayload(req){
  const allowedFields = new Set(["display_name", "avatar_url"])
  const providedFields = Object.keys(req.body || {})

  if(!providedFields.length){
    return [createError("body", "At least one profile field is required.")]
  }

  const fieldErrors = validateAllowedFields(allowedFields)(req)
  return [
    ...fieldErrors,
    ...validateOptionalStringField("display_name", { maxLength: 120 })(req),
    ...validateOptionalStringField("avatar_url", { allowEmpty: true })(req)
  ]
}

module.exports = {
  register: composeValidators("auth.register", [
    validateAllowedFields(new Set(["email", "password", "display_name", "company"])),
    validateEmailField("email", { required: true }),
    validatePasswordField("password"),
    validateRequiredStringField("display_name", { maxLength: 120 }),
    validateCompanyPayload
  ]),
  login: composeValidators("auth.login", [
    validateAllowedFields(new Set(["email", "password", "companyId"])),
    validateEmailField("email", { required: true }),
    validateLoginPasswordField("password"),
    validateObjectIdBody("companyId")
  ]),
  logout: composeValidators("auth.logout", [
    validateAllowedFields(new Set([]))
  ]),
  refresh: composeValidators("auth.refresh", [
    validateAllowedFields(new Set(["refresh_token"])),
    validateRequiredStringField("refresh_token", { maxLength: 4096 })
  ]),
  me: composeValidators("auth.me", [
    validateAllowedFields(new Set([]))
  ]),
  updateMe: composeValidators("auth.updateMe", [
    validateProfileUpdatePayload
  ]),
  switchCompany: composeValidators("auth.switchCompany", [
    validateAllowedFields(new Set(["companyId"])),
    validateObjectIdBody("companyId", { required: true })
  ])
}
