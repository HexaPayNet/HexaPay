const { RECORD_STATUSES } = require("../models/constants")
const {
  composeValidators,
  createError,
  getFieldValue,
  isPlainObject,
  parseIsoDate,
  parseIsoMonth,
  validateAllowedFields,
  validateObjectIdBody,
  validateObjectIdParam
} = require("./_shared")

function validateFiltersShape(req){
  const value = req.body?.filters
  if(value === undefined){
    return []
  }

  return isPlainObject(value)
    ? []
    : [createError("body.filters", "filters must be an object.")]
}

function validateEmployeeExportFilters(req){
  const value = req.body?.filters
  if(value === undefined || !isPlainObject(value)){
    return []
  }

  const allowedFields = new Set(["department_id", "status"])
  const errors = Object.keys(value)
    .filter((field) => !allowedFields.has(field))
    .map((field) => createError(`body.filters.${field}`, `${field} is not allowed in filters.`))

  if(value.department_id !== undefined){
    errors.push(...validateObjectIdBody("department_id")({ body: value }).map((error) => ({
      ...error,
      field: error.field.replace(/^body\./, "body.filters.")
    })))
  }

  if(value.status !== undefined && !RECORD_STATUSES.employee.includes(String(value.status))){
    errors.push(createError(
      "body.filters.status",
      `status must be one of: ${RECORD_STATUSES.employee.join(", ")}.`
    ))
  }

  return errors
}

function validateAttendanceExportFilters(req){
  const value = req.body?.filters
  if(value === undefined || !isPlainObject(value)){
    return []
  }

  const allowedFields = new Set(["department_id", "specific_date", "from_date", "to_date", "month", "approval_status"])
  const errors = Object.keys(value)
    .filter((field) => !allowedFields.has(field))
    .map((field) => createError(`body.filters.${field}`, `${field} is not allowed in filters.`))

  if(value.department_id !== undefined && value.department_id !== ""){
    errors.push(...validateObjectIdBody("department_id")({ body: value }).map((error) => ({
      ...error,
      field: error.field.replace(/^body\./, "body.filters.")
    })))
  }

  ;["specific_date", "from_date", "to_date"].forEach((field) => {
    if(value[field] !== undefined && value[field] !== null && value[field] !== "" && !parseIsoDate(value[field])){
      errors.push(createError(`body.filters.${field}`, `${field} must be a valid date in YYYY-MM-DD format.`))
    }
  })

  if(value.month !== undefined && value.month !== null && value.month !== "" && !parseIsoMonth(value.month)){
    errors.push(createError("body.filters.month", "month must be in YYYY-MM format."))
  }

  if(value.approval_status !== undefined){
    const allowedStatuses = ["pending", "approved", "rejected", "pending_approval"]
    if(!allowedStatuses.includes(String(value.approval_status))){
      errors.push(createError(
        "body.filters.approval_status",
        `approval_status must be one of: ${allowedStatuses.join(", ")}.`
      ))
    }
  }

  if(value.specific_date !== undefined && (value.from_date !== undefined || value.to_date !== undefined || value.month !== undefined)){
    errors.push(createError(
      "body.filters.specific_date",
      "specific_date cannot be combined with from_date, to_date, or month."
    ))
  }

  if(value.month !== undefined && (value.from_date !== undefined || value.to_date !== undefined)){
    errors.push(createError(
      "body.filters.month",
      "month cannot be combined with from_date or to_date."
    ))
  }

  const fromDate = parseIsoDate(value.from_date)
  const toDate = parseIsoDate(value.to_date)
  if(fromDate && toDate && toDate.getTime() < fromDate.getTime()){
    errors.push(createError("body.filters.to_date", "to_date must be on or after from_date."))
  }

  return errors
}

function validateRestoreBackupBody(req){
  const value = req.body || {}
  const errors = []
  const hasBackupJobId = value.backup_job_id !== undefined
  const hasBackupJson = value.backup_json !== undefined

  if(!hasBackupJobId && !hasBackupJson){
    errors.push(createError(
      "body.backup_job_id",
      "Provide backup_job_id or backup_json."
    ))
    return errors
  }

  if(hasBackupJobId && hasBackupJson){
    errors.push(createError(
      "body.backup_job_id",
      "backup_job_id cannot be combined with backup_json."
    ))
    errors.push(createError(
      "body.backup_json",
      "backup_json cannot be combined with backup_job_id."
    ))
    return errors
  }

  if(hasBackupJobId){
    errors.push(...validateObjectIdBody("backup_job_id", { required: true })(req))
  }

  if(hasBackupJson && !isPlainObject(value.backup_json)){
    errors.push(createError(
      "body.backup_json",
      "backup_json must be a JSON object."
    ))
  }

  return errors
}

module.exports = {
  exportEmployees: composeValidators("exports.exportEmployees", [
    validateObjectIdParam("companyId"),
    validateAllowedFields(new Set(["filters"])),
    validateFiltersShape,
    validateEmployeeExportFilters
  ]),
  exportDepartment: composeValidators("exports.exportDepartment", [
    validateObjectIdParam("companyId"),
    validateAllowedFields(new Set(["department_id"])),
    (req) => validateObjectIdBody("department_id", { required: true })(req)
  ]),
  exportAttendance: composeValidators("exports.exportAttendance", [
    validateObjectIdParam("companyId"),
    validateAllowedFields(new Set(["filters"])),
    validateFiltersShape,
    validateAttendanceExportFilters
  ]),
  exportContracts: composeValidators("exports.exportContracts", [
    validateObjectIdParam("companyId"),
    validateAllowedFields(new Set([]))
  ]),
  exportPayroll: composeValidators("exports.exportPayroll", [
    validateObjectIdParam("companyId"),
    validateAllowedFields(new Set(["payroll_run_id"])),
    (req) => validateObjectIdBody("payroll_run_id", { required: true })(req)
  ]),
  createBackup: composeValidators("exports.createBackup", [
    validateObjectIdParam("companyId"),
    validateAllowedFields(new Set([]))
  ]),
  restoreBackup: composeValidators("exports.restoreBackup", [
    validateObjectIdParam("companyId"),
    validateAllowedFields(new Set(["backup_job_id", "backup_json"])),
    validateRestoreBackupBody
  ]),
  downloadExport: composeValidators("exports.downloadExport", [
    validateObjectIdParam("companyId"),
    validateObjectIdParam("exportId")
  ]),
  getBackup: composeValidators("exports.getBackup", [
    validateObjectIdParam("companyId"),
    validateObjectIdParam("backupId")
  ])
}
