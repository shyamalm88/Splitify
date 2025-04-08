const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationController");
const auth = require("../middleware/auth");

// Public routes (if any)

// Private routes - user
router.post(
  "/register-device",
  auth.authenticateJWT,
  notificationController.registerDeviceToken
);

router.post(
  "/subscribe-topic",
  auth.authenticateJWT,
  notificationController.subscribeToTopic
);

router.post(
  "/unsubscribe-topic",
  auth.authenticateJWT,
  notificationController.unsubscribeFromTopic
);

router.post(
  "/send-test",
  auth.authenticateJWT,
  notificationController.sendTestNotification
);

// Admin only routes
router.post(
  "/send-multicast",
  auth.authenticateJWT,
  auth.isAdmin,
  notificationController.sendMulticastNotification
);

// Register a device token
router.post(
  "/register-token",
  auth.authenticateJWT,
  notificationController.registerDeviceToken
);

// Remove a device token
router.delete(
  "/remove-token",
  auth.authenticateJWT,
  notificationController.removeDeviceToken
);

// Send a notification to a specific user
router.post(
  "/send",
  auth.authenticateJWT,
  notificationController.sendNotification
);

// Send a broadcast notification to all users
router.post(
  "/broadcast",
  auth.authenticateJWT,
  notificationController.broadcastNotification
);

// Subscribe to a topic
router.post(
  "/subscribe",
  auth.authenticateJWT,
  notificationController.subscribeToTopic
);

// Unsubscribe from a topic
router.post(
  "/unsubscribe",
  auth.authenticateJWT,
  notificationController.unsubscribeFromTopic
);

// Test notification route
router.post(
  "/test",
  auth.authenticateJWT,
  notificationController.sendTestNotification
);

module.exports = router;
