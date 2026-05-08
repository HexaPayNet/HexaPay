const { DEPARTMENT_SALARY_TYPES, RECORD_STATUSES } = require("../models/constants")
const {
  composeValidators,
  validateAllowedFields,
  validateCurrencyCodeField,
  validateEnumField,
  validateNumberField,
  validateObjectIdBody,
  validateObjectIdParam,
  validateOptionalStringField,
  validateRequiredStringField
} = require("./_shared")

const MAX_MONEY_VALUE = 1000000000
const allowedDepartmentFields = new Set([
  "name",
  "salary_type",
  "default_salary_amount",
  "default_salary_currency",
  "hod_employee_id",
  "icon_key",
  "notes",
  "status"
])

module.exports = {
  listDepartments: composeValidators("departments.listDepartments", [
    validateObjectIdParam("companyId")
  ]),
  createDepartment: composeValidators("departments.createDepartment", [
    validateObjectIdParam("companyId"),
    validateAllowedFields(allowedDepartmentFields),
    validateRequiredStringField("name", { maxLength: 120 }),
    validateEnumField("salary_type", DEPARTMENT_SALARY_TYPES),
    validateNumberField("default_salary_amount", { min: 0, max: MAX_MONEY_VALUE }),
    validateCurrencyCodeField("default_salary_currency"),
    validateObjectIdBody("hod_employee_id"),
    validateEnumField("status", RECORD_STATUSES.department),
    validateOptionalStringField("icon_key", { maxLength: 80 }),
    validateOptionalStringField("notes", { maxLength: 2000 })
  ]),
  getDepartment: composeValidators("departments.getDepartment", [
    validateObjectIdParam("companyId"),
    validateObjectIdParam("departmentId")
  ]),
  updateDepartment: composeValidators("departments.updateDepartment", [
    validateObjectIdParam("companyId"),
    validateObjectIdParam("departmentId"),
    validateAllowedFields(allowedDepartmentFields, "At least one department field must be provided."),
    validateEnumField("salary_type", DEPARTMENT_SALARY_TYPES),
    validateNumberField("default_salary_amount", { min: 0, max: MAX_MONEY_VALUE }),
    validateCurrencyCodeField("default_salary_currency"),
    validateObjectIdBody("hod_employee_id"),
    validateEnumField("status", RECORD_STATUSES.department),
    validateOptionalStringField("name", { maxLength: 120 }),
    validateOptionalStringField("icon_key", { maxLength: 80 }),
    validateOptionalStringField("notes", { maxLength: 2000 })
  ]),
  deleteDepartment: composeValidators("departments.deleteDepartment", [
    validateObjectIdParam("companyId"),
    validateObjectIdParam("departmentId")
  ])
}
