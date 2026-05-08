const { LEAVE_TYPES } = require("../models/constants")
const {
  composeValidators,
  validateAllowedFields,
  validateDateRange,
  validateEnumField,
  validateObjectIdBody,
  validateObjectIdParam,
  validateOptionalStringField,
  validateStrictDateField
} = require("./_shared")

module.exports = {
  listLeaveRequests: composeValidators("leave.listLeaveRequests", [
    validateObjectIdParam("companyId")
  ]),
  createLeaveRequest: composeValidators("leave.createLeaveRequest", [
    validateObjectIdParam("companyId"),
    validateAllowedFields(new Set(["employee_id", "leave_type", "from_date", "to_date", "reason"])),
    validateObjectIdBody("employee_id", { required: true }),
    validateEnumField("leave_type", LEAVE_TYPES, { required: true }),
    validateStrictDateField("from_date", { required: true }),
    validateStrictDateField("to_date", { required: true }),
    validateDateRange("from_date", "to_date"),
    validateOptionalStringField("reason", { maxLength: 500 })
  ]),
  getLeaveRequest: composeValidators("leave.getLeaveRequest", [
    validateObjectIdParam("companyId"),
    validateObjectIdParam("requestId")
  ]),
  approveLeaveRequest: composeValidators("leave.approveLeaveRequest", [
    validateObjectIdParam("companyId"),
    validateObjectIdParam("requestId")
  ]),
  rejectLeaveRequest: composeValidators("leave.rejectLeaveRequest", [
    validateObjectIdParam("companyId"),
    validateObjectIdParam("requestId"),
    validateAllowedFields(new Set(["reason"])),
    validateOptionalStringField("reason", { maxLength: 500 })
  ]),
  completeLeaveRequest: composeValidators("leave.completeLeaveRequest", [
    validateObjectIdParam("companyId"),
    validateObjectIdParam("requestId")
  ])
}
