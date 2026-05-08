const { DEPARTMENT_SALARY_TYPES, RECORD_STATUSES } = require("../models/constants")
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
  validateMonthField,
  validateNumberField,
  validateObjectIdBody,
  validateObjectIdParam,
  validateOptionalStringField,
  validatePayrollPeriodField,
  validateRequiredStringField,
  validateStringParam
} = require("./_shared")

const MAX_MONEY_VALUE = 1000000000
const PAYROLL_SCOPE_VALUES = ["Individual", "Position", "Departmental-Bonus"]

function validateLoanDetails(req){
  const value = getFieldValue(req, "body", "loan_details")
  if(value === undefined || value === null){
    return []
  }

  if(!isPlainObject(value)){
    return [createError("body.loan_details", "loan_details must be an object.")]
  }

  const loanRequest = { body: value }
  const errors = [
    ...validateBooleanField("enabled")(loanRequest).map((error) => ({
      ...error,
      field: error.field.replace(/^body\./, "body.loan_details.")
    })),
    ...validateOptionalStringField("name", { maxLength: 120 })(loanRequest).map((error) => ({
      ...error,
      field: error.field.replace(/^body\./, "body.loan_details.")
    })),
    ...validateEnumField("installment_frequency", ["Weekly", "Monthly"])(loanRequest).map((error) => ({
      ...error,
      field: error.field.replace(/^body\./, "body.loan_details.")
    })),
    ...validateNumberField("principal_amount", { min: 0, max: MAX_MONEY_VALUE })(loanRequest).map((error) => ({
      ...error,
      field: error.field.replace(/^body\./, "body.loan_details.")
    })),
    ...validateNumberField("balance_amount", { min: 0, max: MAX_MONEY_VALUE })(loanRequest).map((error) => ({
      ...error,
      field: error.field.replace(/^body\./, "body.loan_details.")
    })),
    ...validateNumberField("installment_amount", { min: 0, max: MAX_MONEY_VALUE })(loanRequest).map((error) => ({
      ...error,
      field: error.field.replace(/^body\./, "body.loan_details.")
    })),
    ...validateNumberField("total_installments", { min: 0, max: 10000, integer: true })(loanRequest).map((error) => ({
      ...error,
      field: error.field.replace(/^body\./, "body.loan_details.")
    })),
    ...validateNumberField("installments_paid", { min: 0, max: 10000, integer: true })(loanRequest).map((error) => ({
      ...error,
      field: error.field.replace(/^body\./, "body.loan_details.")
    })),
    ...validateNumberField("installments_remaining", { min: 0, max: 10000, integer: true })(loanRequest).map((error) => ({
      ...error,
      field: error.field.replace(/^body\./, "body.loan_details.")
    }))
  ]

  if(value.next_deduction_date !== undefined && !parseIsoDate(value.next_deduction_date)){
    errors.push(createError(
      "body.loan_details.next_deduction_date",
      "next_deduction_date must be a valid date in YYYY-MM-DD format."
    ))
  }

  return errors
}

function validateRequiredPayrollScope(req){
  const value = getFieldValue(req, "body", "scope")
  if(!String(value || "").trim()){
    return [createError("body.scope", "scope is required.")]
  }

  return PAYROLL_SCOPE_VALUES.includes(String(value))
    ? []
    : [createError("body.scope", `scope must be one of: ${PAYROLL_SCOPE_VALUES.join(", ")}.`)]
}

module.exports = {
  getPayrollStructure: composeValidators("payroll.getPayrollStructure", [
    validateObjectIdParam("companyId")
  ]),
  createPayrollStructureChange: composeValidators("payroll.createPayrollStructureChange", [
    validateObjectIdParam("companyId"),
    validateAllowedFields(new Set([
      "kind",
      "type",
      "amount",
      "taxable",
      "income_category",
      "salary_type",
      "scope",
      "scope_label",
      "target_label",
      "target_employee_id",
      "target_department_id",
      "target_role_title",
      "loan_details"
    ]), "At least one payroll structure change field must be provided."),
    validateRequiredStringField("kind", { maxLength: 40 }),
    validateRequiredStringField("type", { maxLength: 80 }),
    validateNumberField("amount", { required: true, min: 0.01, max: MAX_MONEY_VALUE }),
    validateBooleanField("taxable"),
    validateOptionalStringField("income_category", { maxLength: 80 }),
    validateEnumField("salary_type", DEPARTMENT_SALARY_TYPES),
    validateRequiredPayrollScope,
    validateRequiredStringField("scope_label", { maxLength: 120 }),
    validateRequiredStringField("target_label", { maxLength: 120 }),
    validateOptionalStringField("target_role_title", { maxLength: 120 }),
    validateObjectIdBody("target_employee_id"),
    validateObjectIdBody("target_department_id"),
    validateLoanDetails
  ]),
  deletePayrollStructureChange: composeValidators("payroll.deletePayrollStructureChange", [
    validateObjectIdParam("companyId"),
    validateStringParam("changeId", { maxLength: 80, label: "changeId" })
  ]),
  approvePayrollStructure: composeValidators("payroll.approvePayrollStructure", [
    validateObjectIdParam("companyId"),
    validateAllowedFields(new Set(["approver_id"])),
    validateObjectIdBody("approver_id")
  ]),
  rejectPayrollStructure: composeValidators("payroll.rejectPayrollStructure", [
    validateObjectIdParam("companyId"),
    validateAllowedFields(new Set(["approver_id", "reason"])),
    validateObjectIdBody("approver_id"),
    validateOptionalStringField("reason", { maxLength: 500 })
  ]),
  resetPayrollStructure: composeValidators("payroll.resetPayrollStructure", [
    validateObjectIdParam("companyId"),
    validateAllowedFields(new Set([]))
  ]),
  getPayrollCalendar: composeValidators("payroll.getPayrollCalendar", [
    validateObjectIdParam("companyId")
  ]),
  updatePayrollCalendar: composeValidators("payroll.updatePayrollCalendar", [
    validateObjectIdParam("companyId"),
    validateAllowedFields(new Set(["salary_type", "payday_day", "payday_month"]), "At least one payroll calendar field must be provided."),
    validateEnumField("salary_type", DEPARTMENT_SALARY_TYPES),
    validateNumberField("payday_day", { min: 1, max: 31, integer: true }),
    validateMonthField("payday_month")
  ]),
  approvePayrollCalendar: composeValidators("payroll.approvePayrollCalendar", [
    validateObjectIdParam("companyId"),
    validateAllowedFields(new Set(["approver_id"])),
    validateObjectIdBody("approver_id")
  ]),
  rejectPayrollCalendar: composeValidators("payroll.rejectPayrollCalendar", [
    validateObjectIdParam("companyId"),
    validateAllowedFields(new Set(["approver_id", "reason"])),
    validateObjectIdBody("approver_id"),
    validateOptionalStringField("reason", { maxLength: 500 })
  ]),
  resetPayrollCalendar: composeValidators("payroll.resetPayrollCalendar", [
    validateObjectIdParam("companyId"),
    validateAllowedFields(new Set([]))
  ]),
  listPayrollRuns: composeValidators("payroll.listPayrollRuns", [
    validateObjectIdParam("companyId")
  ]),
  createPayrollRun: composeValidators("payroll.createPayrollRun", [
    validateObjectIdParam("companyId"),
    validateAllowedFields(new Set(["period", "salary_type", "department_scope_id", "currency_code"])),
    validateEnumField("salary_type", DEPARTMENT_SALARY_TYPES, { required: true }),
    validatePayrollPeriodField("period", "salary_type"),
    validateObjectIdBody("department_scope_id"),
    validateCurrencyCodeField("currency_code")
  ]),
  getPayrollRun: composeValidators("payroll.getPayrollRun", [
    validateObjectIdParam("companyId"),
    validateObjectIdParam("runId")
  ]),
  generatePayrollRun: composeValidators("payroll.generatePayrollRun", [
    validateObjectIdParam("companyId"),
    validateObjectIdParam("runId"),
    validateAllowedFields(new Set([]))
  ]),
  approvePayrollRun: composeValidators("payroll.approvePayrollRun", [
    validateObjectIdParam("companyId"),
    validateObjectIdParam("runId"),
    validateAllowedFields(new Set([]))
  ]),
  rejectPayrollRun: composeValidators("payroll.rejectPayrollRun", [
    validateObjectIdParam("companyId"),
    validateObjectIdParam("runId"),
    validateAllowedFields(new Set(["reason"])),
    validateOptionalStringField("reason", { maxLength: 500 })
  ]),
  listPayrollItems: composeValidators("payroll.listPayrollItems", [
    validateObjectIdParam("companyId"),
    validateObjectIdParam("runId")
  ]),
  updatePayrollItem: composeValidators("payroll.updatePayrollItem", [
    validateObjectIdParam("companyId"),
    validateObjectIdParam("runId"),
    validateObjectIdParam("itemId"),
    validateAllowedFields(new Set([
      "allowances_total",
      "deductions_total",
      "approval_status",
      "signed",
      "paid"
    ]), "At least one payroll item field must be provided."),
    validateNumberField("allowances_total", { min: 0, max: MAX_MONEY_VALUE }),
    validateNumberField("deductions_total", { min: 0, max: MAX_MONEY_VALUE }),
    validateEnumField("approval_status", RECORD_STATUSES.payrollItemApproval),
    validateBooleanField("signed"),
    validateBooleanField("paid")
  ])
}
