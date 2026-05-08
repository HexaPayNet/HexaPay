const { ATTENDANCE_MODES } = require("../models/constants")
const {
  composeValidators,
  validateAllowedFields,
  validateEnumField,
  validateObjectIdBody,
  validateObjectIdParam,
  validateOptionalStringField,
  validateStrictDateField,
  validateTimeField,
  validateTimeOrder
} = require("./_shared")

module.exports = {
  listAttendanceLogs: composeValidators("attendance.listAttendanceLogs", [
    validateObjectIdParam("companyId")
  ]),
  createAttendanceLog: composeValidators("attendance.createAttendanceLog", [
    validateObjectIdParam("companyId"),
    validateAllowedFields(new Set(["employee_id", "date", "check_in", "check_out", "mode"])),
    validateObjectIdBody("employee_id", { required: true }),
    validateStrictDateField("date", { required: true }),
    validateTimeField("check_in", { required: true }),
    validateTimeField("check_out"),
    validateTimeOrder("check_in", "check_out"),
    validateEnumField("mode", ATTENDANCE_MODES)
  ]),
  getAttendanceLog: composeValidators("attendance.getAttendanceLog", [
    validateObjectIdParam("companyId"),
    validateObjectIdParam("logId")
  ]),
  approveAttendanceLog: composeValidators("attendance.approveAttendanceLog", [
    validateObjectIdParam("companyId"),
    validateObjectIdParam("logId")
  ]),
  rejectAttendanceLog: composeValidators("attendance.rejectAttendanceLog", [
    validateObjectIdParam("companyId"),
    validateObjectIdParam("logId"),
    validateAllowedFields(new Set(["reason"])),
    validateOptionalStringField("reason", { maxLength: 500 })
  ])
}
