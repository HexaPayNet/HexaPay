const express = require("express")

const leaveController = require("../controllers/leave.controller")
const { COMPANY_ROLE_SETS, requireAuth, requireCompanyMembership, requireCompanyRoles } = require("../middleware/auth.middleware")
const { validateRequest } = require("../middleware/validation.middleware")
const leaveValidators = require("../validators/leave.validators")

const router = express.Router()

router.get("/:companyId/leave-requests", requireAuth, requireCompanyMembership, requireCompanyRoles(COMPANY_ROLE_SETS.ALL), validateRequest(leaveValidators.listLeaveRequests), leaveController.listLeaveRequests)
router.post("/:companyId/leave-requests", requireAuth, requireCompanyMembership, requireCompanyRoles(COMPANY_ROLE_SETS.OPERATIONAL), validateRequest(leaveValidators.createLeaveRequest), leaveController.createLeaveRequest)
router.get("/:companyId/leave-requests/:requestId", requireAuth, requireCompanyMembership, requireCompanyRoles(COMPANY_ROLE_SETS.ALL), validateRequest(leaveValidators.getLeaveRequest), leaveController.getLeaveRequest)
router.post("/:companyId/leave-requests/:requestId/approve", requireAuth, requireCompanyMembership, requireCompanyRoles(COMPANY_ROLE_SETS.OPERATIONAL), validateRequest(leaveValidators.approveLeaveRequest), leaveController.approveLeaveRequest)
router.post("/:companyId/leave-requests/:requestId/reject", requireAuth, requireCompanyMembership, requireCompanyRoles(COMPANY_ROLE_SETS.OPERATIONAL), validateRequest(leaveValidators.rejectLeaveRequest), leaveController.rejectLeaveRequest)
router.post("/:companyId/leave-requests/:requestId/complete", requireAuth, requireCompanyMembership, requireCompanyRoles(COMPANY_ROLE_SETS.OPERATIONAL), validateRequest(leaveValidators.completeLeaveRequest), leaveController.completeLeaveRequest)

module.exports = router
