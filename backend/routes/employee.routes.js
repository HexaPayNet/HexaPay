const express = require("express")

const employeeController = require("../controllers/employee.controller")
const { COMPANY_ROLE_SETS, requireAuth, requireCompanyMembership, requireCompanyRoles } = require("../middleware/auth.middleware")
const { validateRequest } = require("../middleware/validation.middleware")
const employeeValidators = require("../validators/employee.validators")

const router = express.Router()

router.get("/:companyId/employees", requireAuth, requireCompanyMembership, requireCompanyRoles(COMPANY_ROLE_SETS.ALL), validateRequest(employeeValidators.listEmployees), employeeController.listEmployees)
router.post("/:companyId/employees", requireAuth, requireCompanyMembership, requireCompanyRoles(COMPANY_ROLE_SETS.OPERATIONAL), validateRequest(employeeValidators.createEmployee), employeeController.createEmployee)
router.get("/:companyId/employees/:employeeId", requireAuth, requireCompanyMembership, requireCompanyRoles(COMPANY_ROLE_SETS.ALL), validateRequest(employeeValidators.getEmployee), employeeController.getEmployee)
router.patch("/:companyId/employees/:employeeId", requireAuth, requireCompanyMembership, requireCompanyRoles(COMPANY_ROLE_SETS.OPERATIONAL), validateRequest(employeeValidators.updateEmployee), employeeController.updateEmployee)
router.delete("/:companyId/employees/:employeeId", requireAuth, requireCompanyMembership, requireCompanyRoles(COMPANY_ROLE_SETS.ADMIN_ONLY), validateRequest(employeeValidators.deleteEmployee), employeeController.deleteEmployee)

module.exports = router
