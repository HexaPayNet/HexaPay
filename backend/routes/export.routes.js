const express = require("express")

const exportController = require("../controllers/export.controller")
const { COMPANY_ROLE_SETS, requireAuth, requireCompanyMembership, requireCompanyRoles } = require("../middleware/auth.middleware")
const { validateRequest } = require("../middleware/validation.middleware")
const exportValidators = require("../validators/export.validators")

const router = express.Router()

router.post("/:companyId/exports/employees", requireAuth, requireCompanyMembership, requireCompanyRoles(COMPANY_ROLE_SETS.OPERATIONAL), validateRequest(exportValidators.exportEmployees), exportController.exportEmployees)
router.post("/:companyId/exports/departments", requireAuth, requireCompanyMembership, requireCompanyRoles(COMPANY_ROLE_SETS.OPERATIONAL), validateRequest(exportValidators.exportDepartment), exportController.exportDepartment)
router.post("/:companyId/exports/attendance", requireAuth, requireCompanyMembership, requireCompanyRoles(COMPANY_ROLE_SETS.OPERATIONAL), validateRequest(exportValidators.exportAttendance), exportController.exportAttendance)
router.post("/:companyId/exports/contracts", requireAuth, requireCompanyMembership, requireCompanyRoles(COMPANY_ROLE_SETS.OPERATIONAL), validateRequest(exportValidators.exportContracts), exportController.exportContracts)
router.post("/:companyId/exports/payroll", requireAuth, requireCompanyMembership, requireCompanyRoles(COMPANY_ROLE_SETS.OPERATIONAL), validateRequest(exportValidators.exportPayroll), exportController.exportPayroll)
router.get("/:companyId/exports/:exportId/download", requireAuth, requireCompanyMembership, requireCompanyRoles(COMPANY_ROLE_SETS.OPERATIONAL), validateRequest(exportValidators.downloadExport), exportController.downloadExport)
router.post("/:companyId/backups", requireAuth, requireCompanyMembership, requireCompanyRoles(COMPANY_ROLE_SETS.ADMIN_ONLY), validateRequest(exportValidators.createBackup), exportController.createBackup)
router.post("/:companyId/backups/restore", requireAuth, requireCompanyMembership, requireCompanyRoles(COMPANY_ROLE_SETS.ADMIN_ONLY), validateRequest(exportValidators.restoreBackup), exportController.restoreBackup)
router.get("/:companyId/backups/:backupId", requireAuth, requireCompanyMembership, requireCompanyRoles(COMPANY_ROLE_SETS.ADMIN_ONLY), validateRequest(exportValidators.getBackup), exportController.getBackup)

module.exports = router
