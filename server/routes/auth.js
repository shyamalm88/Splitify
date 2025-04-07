const express = require("express");
const router = express.Router();
const phoneAuthController = require("../controllers/phoneAuthController");
const auth = require("../middleware/auth");
const userController = require("../controllers/userController");
const {
  phoneLogin,
  sendOtpCode,
  verifyOtpCode,
} = require("../controllers/phoneAuthController");

// @route   POST /api/auth/phone-login
// @desc    Login or register with phone number via Firebase
// @access  Public
router.post("/phone-login", phoneAuthController.phoneLogin);

// @route   POST /api/auth/link-phone
// @desc    Link phone number to existing account
// @access  Private
router.post("/link-phone", auth.authenticateJWT, phoneAuthController.linkPhone);

// User registration and login routes
router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);

// OTP-based authentication routes
router.post("/send-otp", sendOtpCode);
router.post("/verify-otp", verifyOtpCode);

module.exports = router;
