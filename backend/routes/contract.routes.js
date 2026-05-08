const express = require("express")

const contractController = require("../controllers/contract.controller")
const { COMPANY_ROLE_SETS, requireAuth, requireCompanyMembership, requireCompanyRoles } = require("../middleware/auth.middleware")
const { validateRequest } = require("../middleware/validation.middleware")
const contractValidators = require("../validators/contract.validators")

const router = express.Router()

router.get("/:companyId/contracts", requireAuth, requireCompanyMembership, requireCompanyRoles(COMPANY_ROLE_SETS.ALL), validateRequest(contractValidators.listContracts), contractController.listContracts)
router.post("/:companyId/contracts", requireAuth, requireCompanyMembership, requireCompanyRoles(COMPANY_ROLE_SETS.OPERATIONAL), validateRequest(contractValidators.createContract), contractController.createContract)
router.get("/:companyId/contracts/:contractId", requireAuth, requireCompanyMembership, requireCompanyRoles(COMPANY_ROLE_SETS.ALL), validateRequest(contractValidators.getContract), contractController.getContract)
router.patch("/:companyId/contracts/:contractId", requireAuth, requireCompanyMembership, requireCompanyRoles(COMPANY_ROLE_SETS.OPERATIONAL), validateRequest(contractValidators.updateContract), contractController.updateContract)
router.delete("/:companyId/contracts/:contractId", requireAuth, requireCompanyMembership, requireCompanyRoles(COMPANY_ROLE_SETS.OPERATIONAL), validateRequest(contractValidators.deleteContract), contractController.deleteContract)

module.exports = router
