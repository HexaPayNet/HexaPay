const express = require("express")

const companyController = require("../controllers/company.controller")
const { COMPANY_ROLE_SETS, requireAuth, requireCompanyMembership, requireCompanyRoles } = require("../middleware/auth.middleware")
const { validateRequest } = require("../middleware/validation.middleware")
const companyValidators = require("../validators/company.validators")

const router = express.Router()

router.get("/:companyId", requireAuth, requireCompanyMembership, requireCompanyRoles(COMPANY_ROLE_SETS.ALL), validateRequest(companyValidators.getCompany), companyController.getCompany)
router.patch("/:companyId", requireAuth, requireCompanyMembership, requireCompanyRoles(COMPANY_ROLE_SETS.ADMIN_ONLY), validateRequest(companyValidators.updateCompany), companyController.updateCompany)

module.exports = router
