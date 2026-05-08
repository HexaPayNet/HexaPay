const express = require("express")

const holidayController = require("../controllers/holiday.controller")
const { COMPANY_ROLE_SETS, requireAuth, requireCompanyMembership, requireCompanyRoles } = require("../middleware/auth.middleware")
const { validateRequest } = require("../middleware/validation.middleware")
const holidayValidators = require("../validators/holiday.validators")

const router = express.Router()

router.get("/:companyId/holidays", requireAuth, requireCompanyMembership, requireCompanyRoles(COMPANY_ROLE_SETS.ALL), validateRequest(holidayValidators.listHolidays), holidayController.listHolidays)
router.post("/:companyId/holidays", requireAuth, requireCompanyMembership, requireCompanyRoles(COMPANY_ROLE_SETS.OPERATIONAL), validateRequest(holidayValidators.createHoliday), holidayController.createHoliday)
router.get("/:companyId/holidays/:holidayId", requireAuth, requireCompanyMembership, requireCompanyRoles(COMPANY_ROLE_SETS.ALL), validateRequest(holidayValidators.getHoliday), holidayController.getHoliday)
router.patch("/:companyId/holidays/:holidayId", requireAuth, requireCompanyMembership, requireCompanyRoles(COMPANY_ROLE_SETS.OPERATIONAL), validateRequest(holidayValidators.updateHoliday), holidayController.updateHoliday)
router.delete("/:companyId/holidays/:holidayId", requireAuth, requireCompanyMembership, requireCompanyRoles(COMPANY_ROLE_SETS.ADMIN_ONLY), validateRequest(holidayValidators.deleteHoliday), holidayController.deleteHoliday)

module.exports = router
