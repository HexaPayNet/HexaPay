const express = require("express")

const attendanceController = require("../controllers/attendance.controller")
const { COMPANY_ROLE_SETS, requireAuth, requireCompanyMembership, requireCompanyRoles } = require("../middleware/auth.middleware")
const { validateRequest } = require("../middleware/validation.middleware")
const attendanceValidators = require("../validators/attendance.validators")

const router = express.Router()

router.get("/:companyId/attendance-logs", requireAuth, requireCompanyMembership, requireCompanyRoles(COMPANY_ROLE_SETS.ALL), validateRequest(attendanceValidators.listAttendanceLogs), attendanceController.listAttendanceLogs)
router.post("/:companyId/attendance-logs", requireAuth, requireCompanyMembership, requireCompanyRoles(COMPANY_ROLE_SETS.OPERATIONAL), validateRequest(attendanceValidators.createAttendanceLog), attendanceController.createAttendanceLog)
router.get("/:companyId/attendance-logs/:logId", requireAuth, requireCompanyMembership, requireCompanyRoles(COMPANY_ROLE_SETS.ALL), validateRequest(attendanceValidators.getAttendanceLog), attendanceController.getAttendanceLog)
router.post("/:companyId/attendance-logs/:logId/approve", requireAuth, requireCompanyMembership, requireCompanyRoles(COMPANY_ROLE_SETS.OPERATIONAL), validateRequest(attendanceValidators.approveAttendanceLog), attendanceController.approveAttendanceLog)
router.post("/:companyId/attendance-logs/:logId/reject", requireAuth, requireCompanyMembership, requireCompanyRoles(COMPANY_ROLE_SETS.OPERATIONAL), validateRequest(attendanceValidators.rejectAttendanceLog), attendanceController.rejectAttendanceLog)

module.exports = router
