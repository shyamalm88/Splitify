const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationController");
const auth = require("../middleware/auth");

// @route   POST /api/notifications/register-token
// @desc    Register device token for push notifications
// @access  Private
router.post(
  "/register-token",
  auth.authenticateJWT,
  notificationController.registerDeviceToken
);

// @route   DELETE /api/notifications/remove-token
// @desc    Remove device token
// @access  Private
router.delete(
  "/remove-token",
  auth.authenticateJWT,
  notificationController.removeDeviceToken
);

// @route   POST /api/notifications/send
// @desc    Send push notification to a user
// @access  Private/Admin
router.post(
  "/send",
  auth.authenticateJWT,
  notificationController.sendNotification
);

// @route   POST /api/notifications/broadcast
// @desc    Send push notification to all users
// @access  Private/Admin
router.post(
  "/broadcast",
  auth.authenticateJWT,
  notificationController.broadcastNotification
);

module.exports = router;
