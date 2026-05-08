const { EMPLOYMENT_TYPES, PAYMENT_TYPES, PAYMENT_BASIS_TYPES, RECORD_STATUSES } = require("../models/constants")
const {
  composeValidators,
  createError,
  getFieldValue,
  isPlainObject,
  parseIsoDate,
  validateAllowedFields,
  validateBooleanField,
  validateCurrencyCodeField,
  validateEnumField,
  validateNumberField,
  validateObjectIdBody,
  validateObjectIdParam,
  validateOptionalStringField,
  validateRequiredStringField,
  validateStrictDateField
} = require("./_shared")

const MAX_MONEY_VALUE = 1000000000

function validateOptionalFinancialProfile(req){
  const value = getFieldValue(req, "body", "financial_profile")
  if(value === undefined){
    return []
  }

  if(!isPlainObject(value)){
    return [createError("body.financial_profile", "financial_profile must be an object.")]
  }

  const profileRequest = { body: value }
  const errors = [
    ...validateBooleanField("apply_tax_financials")(profileRequest).map((error) => ({
      ...error,
      field: error.field.replace(/^body\./, "body.financial_profile.")
    }))
  ]

  if(value.statutory !== undefined){
    if(!isPlainObject(value.statutory)){
      errors.push(createError("body.financial_profile.statutory", "statutory must be an object."))
    } else {
      const statutoryRequest = { body: value.statutory }
      ;["paye", "shif", "nssf", "housing_levy", "pension", "insurance"].forEach((field) => {
        errors.push(...validateBooleanField(field)(statutoryRequest).map((error) => ({
          ...error,
          field: error.field.replace(/^body\./, "body.financial_profile.statutory.")
        })))
      })
    }
  }

  if(value.loan !== undefined){
    if(!isPlainObject(value.loan)){
      errors.push(createError("body.financial_profile.loan", "loan must be an object."))
    } else {
      const loanRequest = { body: value.loan }

      errors.push(
        ...validateBooleanField("enabled")(loanRequest).map((error) => ({
          ...error,
          field: error.field.replace(/^body\./, "body.financial_profile.loan.")
        })),
        ...validateOptionalStringField("name", { maxLength: 120 })(loanRequest).map((error) => ({
          ...error,
          field: error.field.replace(/^body\./, "body.financial_profile.loan.")
        })),
        ...validateEnumField("installment_frequency", ["Weekly", "Monthly"])(loanRequest).map((error) => ({
          ...error,
          field: error.field.replace(/^body\./, "body.financial_profile.loan.")
        })),
        ...validateNumberField("principal_amount", { min: 0, max: MAX_MONEY_VALUE })(loanRequest).map((error) => ({
          ...error,
          field: error.field.replace(/^body\./, "body.financial_profile.loan.")
        })),
        ...validateNumberField("balance_amount", { min: 0, max: MAX_MONEY_VALUE })(loanRequest).map((error) => ({
          ...error,
          field: error.field.replace(/^body\./, "body.financial_profile.loan.")
        })),
        ...validateNumberField("installment_amount", { min: 0, max: MAX_MONEY_VALUE })(loanRequest).map((error) => ({
          ...error,
          field: error.field.replace(/^body\./, "body.financial_profile.loan.")
        })),
        ...validateNumberField("total_installments", { min: 0, max: 10000, integer: true })(loanRequest).map((error) => ({
          ...error,
          field: error.field.replace(/^body\./, "body.financial_profile.loan.")
        })),
        ...validateNumberField("installments_paid", { min: 0, max: 10000, integer: true })(loanRequest).map((error) => ({
          ...error,
          field: error.field.replace(/^body\./, "body.financial_profile.loan.")
        })),
        ...validateNumberField("installments_remaining", { min: 0, max: 10000, integer: true })(loanRequest).map((error) => ({
          ...error,
          field: error.field.replace(/^body\./, "body.financial_profile.loan.")
        })),
        ...validateOptionalStringField("source_change_id", { maxLength: 120 })(loanRequest).map((error) => ({
          ...error,
          field: error.field.replace(/^body\./, "body.financial_profile.loan.")
        }))
      )

      const nextDeductionDate = value.loan.next_deduction_date
      if(nextDeductionDate !== undefined && !parseIsoDate(nextDeductionDate)){
        errors.push(createError(
          "body.financial_profile.loan.next_deduction_date",
          "next_deduction_date must be a valid date in YYYY-MM-DD format."
        ))
      }
    }
  }

  return errors
}

const allowedEmployeeFields = new Set([
  "department_id",
  "employee_number",
  "full_name",
  "identification_number",
  "account_number",
  "account_details",
  "role_title",
  "employment_type",
  "payment_type",
  "payment_basis",
  "employment_date",
  "salary_amount",
  "salary_currency",
  "status",
  "payroll_status",
  "profile_image_url",
  "financial_profile"
])

module.exports = {
  listEmployees: composeValidators("employees.listEmployees", [
    validateObjectIdParam("companyId")
  ]),
  createEmployee: composeValidators("employees.createEmployee", [
    validateObjectIdParam("companyId"),
    validateAllowedFields(allowedEmployeeFields),
    validateRequiredStringField("full_name", { maxLength: 120 }),
    validateRequiredStringField("role_title", { maxLength: 120 }),
    validateEnumField("employment_type", EMPLOYMENT_TYPES, { required: true }),
    validateEnumField("payment_type", PAYMENT_TYPES, { required: true }),
    validateEnumField("payment_basis", PAYMENT_BASIS_TYPES),
    validateStrictDateField("employment_date", { required: true }),
    validateNumberField("salary_amount", { required: true, min: 0, max: MAX_MONEY_VALUE }),
    validateObjectIdBody("department_id"),
    validateCurrencyCodeField("salary_currency"),
    validateEnumField("status", RECORD_STATUSES.employee),
    validateEnumField("payroll_status", RECORD_STATUSES.payrollStatus),
    validateOptionalFinancialProfile,
    validateOptionalStringField("employee_number", { maxLength: 40 }),
    validateOptionalStringField("identification_number", { maxLength: 40 }),
    validateOptionalStringField("account_number", { maxLength: 60 }),
    validateOptionalStringField("account_details", { maxLength: 200 }),
    validateOptionalStringField("profile_image_url")
  ]),
  getEmployee: composeValidators("employees.getEmployee", [
    validateObjectIdParam("companyId"),
    validateObjectIdParam("employeeId")
  ]),
  updateEmployee: composeValidators("employees.updateEmployee", [
    validateObjectIdParam("companyId"),
    validateObjectIdParam("employeeId"),
    validateAllowedFields(allowedEmployeeFields, "At least one employee field must be provided."),
    validateObjectIdBody("department_id"),
    validateEnumField("employment_type", EMPLOYMENT_TYPES),
    validateEnumField("payment_type", PAYMENT_TYPES),
    validateEnumField("payment_basis", PAYMENT_BASIS_TYPES),
    validateStrictDateField("employment_date"),
    validateNumberField("salary_amount", { min: 0, max: MAX_MONEY_VALUE }),
    validateCurrencyCodeField("salary_currency"),
    validateEnumField("status", RECORD_STATUSES.employee),
    validateEnumField("payroll_status", RECORD_STATUSES.payrollStatus),
    validateOptionalFinancialProfile,
    validateOptionalStringField("employee_number", { maxLength: 40 }),
    validateOptionalStringField("full_name", { maxLength: 120 }),
    validateOptionalStringField("identification_number", { maxLength: 40 }),
    validateOptionalStringField("account_number", { maxLength: 60 }),
    validateOptionalStringField("account_details", { maxLength: 200 }),
    validateOptionalStringField("role_title", { maxLength: 120 }),
    validateOptionalStringField("profile_image_url")
  ]),
  deleteEmployee: composeValidators("employees.deleteEmployee", [
    validateObjectIdParam("companyId"),
    validateObjectIdParam("employeeId")
  ])
}
