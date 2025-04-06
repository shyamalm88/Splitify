const express = require("express");
const router = express.Router();
const phoneAuthController = require("../controllers/phoneAuthController");
const auth = require("../middleware/auth");

// @route   POST /api/auth/phone-login
// @desc    Login or register with phone number via Firebase
// @access  Public
router.post("/phone-login", phoneAuthController.phoneLogin);

// @route   POST /api/auth/link-phone
// @desc    Link phone number to existing account
// @access  Private
router.post("/link-phone", auth.authenticateJWT, phoneAuthController.linkPhone);

module.exports = router;
