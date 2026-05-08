const express = require("express")

const departmentController = require("../controllers/department.controller")
const { COMPANY_ROLE_SETS, requireAuth, requireCompanyMembership, requireCompanyRoles } = require("../middleware/auth.middleware")
const { validateRequest } = require("../middleware/validation.middleware")
const departmentValidators = require("../validators/department.validators")

const router = express.Router()

router.get("/:companyId/departments", requireAuth, requireCompanyMembership, requireCompanyRoles(COMPANY_ROLE_SETS.ALL), validateRequest(departmentValidators.listDepartments), departmentController.listDepartments)
router.post("/:companyId/departments", requireAuth, requireCompanyMembership, requireCompanyRoles(COMPANY_ROLE_SETS.OPERATIONAL), validateRequest(departmentValidators.createDepartment), departmentController.createDepartment)
router.get("/:companyId/departments/:departmentId", requireAuth, requireCompanyMembership, requireCompanyRoles(COMPANY_ROLE_SETS.ALL), validateRequest(departmentValidators.getDepartment), departmentController.getDepartment)
router.patch("/:companyId/departments/:departmentId", requireAuth, requireCompanyMembership, requireCompanyRoles(COMPANY_ROLE_SETS.OPERATIONAL), validateRequest(departmentValidators.updateDepartment), departmentController.updateDepartment)
router.delete("/:companyId/departments/:departmentId", requireAuth, requireCompanyMembership, requireCompanyRoles(COMPANY_ROLE_SETS.ADMIN_ONLY), validateRequest(departmentValidators.deleteDepartment), departmentController.deleteDepartment)

module.exports = router
