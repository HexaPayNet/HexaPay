const express = require("express")

const payrollController = require("../controllers/payroll.controller")
const { COMPANY_ROLE_SETS, requireAuth, requireCompanyMembership, requireCompanyRoles } = require("../middleware/auth.middleware")
const { validateRequest } = require("../middleware/validation.middleware")
const payrollValidators = require("../validators/payroll.validators")

const router = express.Router()

router.get("/:companyId/payroll-structure", requireAuth, requireCompanyMembership, requireCompanyRoles(COMPANY_ROLE_SETS.ALL), validateRequest(payrollValidators.getPayrollStructure), payrollController.getPayrollStructure)
router.post("/:companyId/payroll-structure/changes", requireAuth, requireCompanyMembership, requireCompanyRoles(COMPANY_ROLE_SETS.OPERATIONAL), validateRequest(payrollValidators.createPayrollStructureChange), payrollController.createPayrollStructureChange)
router.delete("/:companyId/payroll-structure/changes/:changeId", requireAuth, requireCompanyMembership, requireCompanyRoles(COMPANY_ROLE_SETS.OPERATIONAL), validateRequest(payrollValidators.deletePayrollStructureChange), payrollController.deletePayrollStructureChange)
router.post("/:companyId/payroll-structure/approve", requireAuth, requireCompanyMembership, requireCompanyRoles(COMPANY_ROLE_SETS.OPERATIONAL), validateRequest(payrollValidators.approvePayrollStructure), payrollController.approvePayrollStructure)
router.post("/:companyId/payroll-structure/reject", requireAuth, requireCompanyMembership, requireCompanyRoles(COMPANY_ROLE_SETS.OPERATIONAL), validateRequest(payrollValidators.rejectPayrollStructure), payrollController.rejectPayrollStructure)
router.post("/:companyId/payroll-structure/reset", requireAuth, requireCompanyMembership, requireCompanyRoles(COMPANY_ROLE_SETS.ADMIN_ONLY), validateRequest(payrollValidators.resetPayrollStructure), payrollController.resetPayrollStructure)

router.get("/:companyId/payroll-calendar", requireAuth, requireCompanyMembership, requireCompanyRoles(COMPANY_ROLE_SETS.ALL), validateRequest(payrollValidators.getPayrollCalendar), payrollController.getPayrollCalendar)
router.patch("/:companyId/payroll-calendar", requireAuth, requireCompanyMembership, requireCompanyRoles(COMPANY_ROLE_SETS.OPERATIONAL), validateRequest(payrollValidators.updatePayrollCalendar), payrollController.updatePayrollCalendar)
router.post("/:companyId/payroll-calendar/approve", requireAuth, requireCompanyMembership, requireCompanyRoles(COMPANY_ROLE_SETS.OPERATIONAL), validateRequest(payrollValidators.approvePayrollCalendar), payrollController.approvePayrollCalendar)
router.post("/:companyId/payroll-calendar/reject", requireAuth, requireCompanyMembership, requireCompanyRoles(COMPANY_ROLE_SETS.OPERATIONAL), validateRequest(payrollValidators.rejectPayrollCalendar), payrollController.rejectPayrollCalendar)
router.post("/:companyId/payroll-calendar/reset", requireAuth, requireCompanyMembership, requireCompanyRoles(COMPANY_ROLE_SETS.ADMIN_ONLY), validateRequest(payrollValidators.resetPayrollCalendar), payrollController.resetPayrollCalendar)

router.get("/:companyId/payroll-runs", requireAuth, requireCompanyMembership, requireCompanyRoles(COMPANY_ROLE_SETS.ALL), validateRequest(payrollValidators.listPayrollRuns), payrollController.listPayrollRuns)
router.post("/:companyId/payroll-runs", requireAuth, requireCompanyMembership, requireCompanyRoles(COMPANY_ROLE_SETS.OPERATIONAL), validateRequest(payrollValidators.createPayrollRun), payrollController.createPayrollRun)
router.get("/:companyId/payroll-runs/:runId", requireAuth, requireCompanyMembership, requireCompanyRoles(COMPANY_ROLE_SETS.ALL), validateRequest(payrollValidators.getPayrollRun), payrollController.getPayrollRun)
router.post("/:companyId/payroll-runs/:runId/generate", requireAuth, requireCompanyMembership, requireCompanyRoles(COMPANY_ROLE_SETS.OPERATIONAL), validateRequest(payrollValidators.generatePayrollRun), payrollController.generatePayrollRun)
router.post("/:companyId/payroll-runs/:runId/approve", requireAuth, requireCompanyMembership, requireCompanyRoles(COMPANY_ROLE_SETS.OPERATIONAL), validateRequest(payrollValidators.approvePayrollRun), payrollController.approvePayrollRun)
router.post("/:companyId/payroll-runs/:runId/reject", requireAuth, requireCompanyMembership, requireCompanyRoles(COMPANY_ROLE_SETS.OPERATIONAL), validateRequest(payrollValidators.rejectPayrollRun), payrollController.rejectPayrollRun)
router.get("/:companyId/payroll-runs/:runId/items", requireAuth, requireCompanyMembership, requireCompanyRoles(COMPANY_ROLE_SETS.ALL), validateRequest(payrollValidators.listPayrollItems), payrollController.listPayrollItems)
router.patch("/:companyId/payroll-runs/:runId/items/:itemId", requireAuth, requireCompanyMembership, requireCompanyRoles(COMPANY_ROLE_SETS.OPERATIONAL), validateRequest(payrollValidators.updatePayrollItem), payrollController.updatePayrollItem)

module.exports = router
