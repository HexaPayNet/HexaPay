const express = require("express")

const settingsController = require("../controllers/settings.controller")
const { COMPANY_ROLE_SETS, requireAuth, requireCompanyMembership, requireCompanyRoles } = require("../middleware/auth.middleware")
const { validateRequest } = require("../middleware/validation.middleware")
const settingsValidators = require("../validators/settings.validators")

const router = express.Router()

router.get("/:companyId/settings", requireAuth, requireCompanyMembership, requireCompanyRoles(COMPANY_ROLE_SETS.ALL), validateRequest(settingsValidators.getSettings), settingsController.getSettings)
router.patch("/:companyId/settings", requireAuth, requireCompanyMembership, requireCompanyRoles(COMPANY_ROLE_SETS.ADMIN_ONLY), validateRequest(settingsValidators.updateSettings), settingsController.updateSettings)
router.get("/:companyId/settings/appearance", requireAuth, requireCompanyMembership, requireCompanyRoles(COMPANY_ROLE_SETS.ALL), validateRequest(settingsValidators.getAppearanceSettings), settingsController.getAppearanceSettings)
router.patch("/:companyId/settings/appearance", requireAuth, requireCompanyMembership, requireCompanyRoles(COMPANY_ROLE_SETS.ADMIN_ONLY), validateRequest(settingsValidators.updateAppearanceSettings), settingsController.updateAppearanceSettings)
router.get("/:companyId/settings/currency", requireAuth, requireCompanyMembership, requireCompanyRoles(COMPANY_ROLE_SETS.ALL), validateRequest(settingsValidators.getCurrencySettings), settingsController.getCurrencySettings)
router.patch("/:companyId/settings/currency", requireAuth, requireCompanyMembership, requireCompanyRoles(COMPANY_ROLE_SETS.ADMIN_ONLY), validateRequest(settingsValidators.updateCurrencySettings), settingsController.updateCurrencySettings)
router.get("/:companyId/settings/tax", requireAuth, requireCompanyMembership, requireCompanyRoles(COMPANY_ROLE_SETS.ALL), validateRequest(settingsValidators.getTaxSettings), settingsController.getTaxSettings)
router.get("/:companyId/settings/financial-rules", requireAuth, requireCompanyMembership, requireCompanyRoles(COMPANY_ROLE_SETS.ALL), validateRequest(settingsValidators.listFinancialRules), settingsController.listFinancialRules)
router.post("/:companyId/settings/financial-rules", requireAuth, requireCompanyMembership, requireCompanyRoles(COMPANY_ROLE_SETS.ADMIN_ONLY), validateRequest(settingsValidators.createFinancialRule), settingsController.createFinancialRule)
router.patch("/:companyId/settings/financial-rules/:ruleId", requireAuth, requireCompanyMembership, requireCompanyRoles(COMPANY_ROLE_SETS.ADMIN_ONLY), validateRequest(settingsValidators.updateFinancialRule), settingsController.updateFinancialRule)
router.delete("/:companyId/settings/financial-rules/:ruleId", requireAuth, requireCompanyMembership, requireCompanyRoles(COMPANY_ROLE_SETS.ADMIN_ONLY), validateRequest(settingsValidators.deleteFinancialRule), settingsController.deleteFinancialRule)

module.exports = router
