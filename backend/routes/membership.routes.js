const express = require("express")

const membershipController = require("../controllers/membership.controller")
const { COMPANY_ROLE_SETS, requireAuth, requireCompanyMembership, requireCompanyRoles } = require("../middleware/auth.middleware")
const { validateRequest } = require("../middleware/validation.middleware")
const membershipValidators = require("../validators/membership.validators")

const router = express.Router()

router.get("/:companyId/memberships", requireAuth, requireCompanyMembership, requireCompanyRoles(COMPANY_ROLE_SETS.ADMIN_ONLY), validateRequest(membershipValidators.listMemberships), membershipController.listMemberships)
router.post("/:companyId/memberships", requireAuth, requireCompanyMembership, requireCompanyRoles(COMPANY_ROLE_SETS.ADMIN_ONLY), validateRequest(membershipValidators.createMembership), membershipController.createMembership)
router.patch("/:companyId/memberships/:membershipId", requireAuth, requireCompanyMembership, requireCompanyRoles(COMPANY_ROLE_SETS.ADMIN_ONLY), validateRequest(membershipValidators.updateMembership), membershipController.updateMembership)
router.delete("/:companyId/memberships/:membershipId", requireAuth, requireCompanyMembership, requireCompanyRoles(COMPANY_ROLE_SETS.ADMIN_ONLY), validateRequest(membershipValidators.deleteMembership), membershipController.deleteMembership)

module.exports = router
