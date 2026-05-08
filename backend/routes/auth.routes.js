const express = require("express")

const authController = require("../controllers/auth.controller")
const { requireAuth } = require("../middleware/auth.middleware")
const { validateRequest } = require("../middleware/validation.middleware")
const authValidators = require("../validators/auth.validators")

const router = express.Router()

router.post("/register", validateRequest(authValidators.register), authController.register)
router.post("/login", validateRequest(authValidators.login), authController.login)
router.post("/logout", requireAuth, validateRequest(authValidators.logout), authController.logout)
router.post("/refresh", validateRequest(authValidators.refresh), authController.refresh)
router.get("/me", requireAuth, validateRequest(authValidators.me), authController.getMe)
router.patch("/me", requireAuth, validateRequest(authValidators.updateMe), authController.updateMe)
router.post("/switch-company", requireAuth, validateRequest(authValidators.switchCompany), authController.switchCompany)

module.exports = router
