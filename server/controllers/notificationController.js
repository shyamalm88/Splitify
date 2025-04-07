const User = require("../models/User");
const {
  sendPushNotification,
  sendMulticastPushNotification,
  sendTopicPushNotification,
  sendWebPushNotification,
  subscribeToTopic,
  unsubscribeFromTopic,
} = require("../config/firebase");
const admin = require("firebase-admin");

// In-memory store for development tokens (this would reset when server restarts)
const devUserTokens = {};

// @desc    Register a device token
// @route   POST /api/users/register-device
// @access  Private
exports.registerDeviceToken = async (req, res) => {
  try {
    const { token, platform } = req.body;
    const userId = req.user.id;

    console.log(
      "[REGISTER TOKEN] Request to register token:",
      token,
      "for user:",
      userId
    );

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Device token is required",
      });
    }

    // Check if it's a development token
    if (userId.startsWith("user")) {
      console.log("[REGISTER TOKEN] Development user detected");
      // For development tokens, store the token in memory
      if (!devUserTokens[userId]) {
        devUserTokens[userId] = [];
      }
      if (!devUserTokens[userId].includes(token)) {
        devUserTokens[userId].push(token);
      }
      console.log("[REGISTER TOKEN] Updated dev tokens:", devUserTokens);
      return res.json({
        success: true,
        message: "Device registered successfully",
      });
    }

    // Get user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if token already exists
    if (!user.deviceTokens.includes(token)) {
      user.deviceTokens.push(token);
      await user.save();
    }

    return res.json({
      success: true,
      message: "Device registered successfully",
    });
  } catch (error) {
    console.error("Error registering device token:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while registering device",
    });
  }
};

// @desc    Remove device token
// @route   DELETE /api/notifications/remove-token
// @access  Private
exports.removeDeviceToken = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: "Device token is required" });
    }

    // Get user from authenticated request
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Remove token if exists
    if (user.deviceTokens.includes(token)) {
      user.deviceTokens = user.deviceTokens.filter((t) => t !== token);
      await user.save();
    }

    res.status(200).json({ message: "Device token removed successfully" });
  } catch (error) {
    console.error("Error removing device token:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Send push notification to a user
// @route   POST /api/notifications/send
// @access  Private/Admin
exports.sendNotification = async (req, res) => {
  try {
    const { userId, title, body, data } = req.body;

    if (!userId || !title || !body) {
      return res
        .status(400)
        .json({ message: "User ID, title, and body are required" });
    }

    // Get user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if user has registered device tokens
    if (!user.deviceTokens || user.deviceTokens.length === 0) {
      return res
        .status(400)
        .json({ message: "User has no registered device tokens" });
    }

    // Send notifications to all user devices
    const result = await sendMulticastPushNotification(
      user.deviceTokens,
      title,
      body,
      data || {}
    );

    res.status(200).json(result);
  } catch (error) {
    console.error("Error sending notification:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Send push notification to all users
// @route   POST /api/notifications/broadcast
// @access  Private/Admin
exports.broadcastNotification = async (req, res) => {
  try {
    const { title, body, data, topic } = req.body;

    if (!title || !body) {
      return res.status(400).json({ message: "Title and body are required" });
    }

    let result;

    // If topic is provided, send to topic
    if (topic) {
      result = await sendTopicPushNotification(topic, title, body, data || {});
    } else {
      // Otherwise collect all tokens and send
      const users = await User.find({
        deviceTokens: { $exists: true, $ne: [] },
      });

      // Collect all unique device tokens
      const allTokens = [];
      users.forEach((user) => {
        user.deviceTokens.forEach((token) => {
          if (!allTokens.includes(token)) {
            allTokens.push(token);
          }
        });
      });

      if (allTokens.length === 0) {
        return res
          .status(400)
          .json({ message: "No registered device tokens found" });
      }

      result = await sendMulticastPushNotification(
        allTokens,
        title,
        body,
        data || {}
      );
    }

    res.status(200).json(result);
  } catch (error) {
    console.error("Error broadcasting notification:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Subscribe to a topic
// @route   POST /api/users/subscribe-topic
// @access  Private
exports.subscribeToTopic = async (req, res) => {
  try {
    const { token, topic } = req.body;

    if (!token || !topic) {
      return res.status(400).json({
        success: false,
        message: "Token and topic are required",
      });
    }

    const result = await subscribeToTopic([token], topic);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.error || "Failed to subscribe to topic",
      });
    }

    return res.json({
      success: true,
      message: "Subscribed to topic successfully",
      successCount: result.successCount,
      failureCount: result.failureCount,
    });
  } catch (error) {
    console.error("Error subscribing to topic:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while subscribing to topic",
    });
  }
};

// @desc    Unsubscribe from a topic
// @route   POST /api/users/unsubscribe-topic
// @access  Private
exports.unsubscribeFromTopic = async (req, res) => {
  try {
    const { token, topic } = req.body;

    if (!token || !topic) {
      return res.status(400).json({
        success: false,
        message: "Token and topic are required",
      });
    }

    const result = await unsubscribeFromTopic([token], topic);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.error || "Failed to unsubscribe from topic",
      });
    }

    return res.json({
      success: true,
      message: "Unsubscribed from topic successfully",
      successCount: result.successCount,
      failureCount: result.failureCount,
    });
  } catch (error) {
    console.error("Error unsubscribing from topic:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while unsubscribing from topic",
    });
  }
};

// @desc    Send a test notification
// @route   POST /api/notifications/send-test
// @access  Private
exports.sendTestNotification = async (req, res) => {
  try {
    console.log("[TEST NOTIF] Starting test notification process");
    console.log("[TEST NOTIF] User data:", req.user);

    const userId = req.user.id;
    const { title, body, data } = req.body;

    console.log(`[TEST NOTIF] User ID: ${userId}, Request body:`, req.body);

    // For development tokens (starting with "user")
    if (userId.startsWith("user")) {
      console.log("[TEST NOTIF] Development token detected");

      // Check if there are any device tokens for this dev user
      if (!devUserTokens[userId] || devUserTokens[userId].length === 0) {
        console.log("[TEST NOTIF] No device tokens found for dev user");
        return res.status(400).json({
          success: false,
          message:
            "No device tokens found for this user. Please register a device token first.",
        });
      }

      console.log(
        "[TEST NOTIF] Development device tokens:",
        devUserTokens[userId]
      );

      // For development, just return success without actually sending the notification
      return res.json({
        success: true,
        message: "Test notification sent (development mode)",
        results: {
          total: devUserTokens[userId].length,
          successful: devUserTokens[userId].length,
          failed: 0,
          details: devUserTokens[userId].map((token) => ({
            token,
            success: true,
          })),
        },
      });
    }

    // For production users
    console.log("[TEST NOTIF] Production user, fetching from database");
    // Get user's device tokens
    const user = await User.findById(userId);
    if (!user || !user.deviceTokens || user.deviceTokens.length === 0) {
      console.log(
        "[TEST NOTIF] No device tokens found in database for user:",
        userId
      );
      return res.status(400).json({
        success: false,
        message: "No device tokens found for this user",
      });
    }

    console.log("[TEST NOTIF] Found device tokens:", user.deviceTokens);

    // Create notification payload
    const notification = {
      title: title || "Test Notification",
      body: body || "This is a test notification from Splitify",
      data: data || {
        type: "test",
        timestamp: new Date().toISOString(),
      },
    };

    console.log("[TEST NOTIF] Notification payload:", notification);

    // Send notification to all user's devices
    const results = await Promise.all(
      user.deviceTokens.map(async (token) => {
        try {
          console.log("[TEST NOTIF] Sending to token:", token);
          await admin.messaging().send({
            token,
            notification,
            data: notification.data,
          });
          console.log("[TEST NOTIF] Successfully sent to token:", token);
          return { token, success: true };
        } catch (error) {
          console.error(
            "[TEST NOTIF] Error sending notification to token:",
            token,
            error
          );
          return { token, success: false, error: error.message };
        }
      })
    );

    // Count successful and failed notifications
    const successful = results.filter((r) => r.success).length;
    const failed = results.filter((r) => !r.success).length;

    console.log(
      "[TEST NOTIF] Results summary - Total:",
      user.deviceTokens.length,
      "Success:",
      successful,
      "Failed:",
      failed
    );

    res.json({
      success: true,
      message: "Test notification sent",
      results: {
        total: user.deviceTokens.length,
        successful,
        failed,
        details: results,
      },
    });
  } catch (error) {
    console.error("[TEST NOTIF] Error sending test notification:", error);
    res.status(500).json({
      success: false,
      message: "Error sending test notification",
      error: error.message,
    });
  }
};

// @desc    Send notification to multiple devices
// @route   POST /api/notifications/send-multicast
// @access  Private (Admin only)
exports.sendMulticastNotification = async (req, res) => {
  try {
    const { tokens, title, body, data, platform = "all" } = req.body;

    if (!tokens || !tokens.length || !title || !body) {
      return res.status(400).json({
        success: false,
        message: "Tokens, title, and body are required",
      });
    }

    // Split tokens by platform if specified
    const result = await sendMulticastPushNotification(
      tokens,
      title,
      body,
      data || {}
    );

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.error || "Failed to send notifications",
      });
    }

    return res.json({
      success: true,
      message: "Notifications sent successfully",
      successCount: result.successCount,
      failureCount: result.failureCount,
    });
  } catch (error) {
    console.error("Error sending multicast notification:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while sending notifications",
    });
  }
};

module.exports = {
  registerDeviceToken: exports.registerDeviceToken,
  removeDeviceToken: exports.removeDeviceToken,
  sendNotification: exports.sendNotification,
  broadcastNotification: exports.broadcastNotification,
  subscribeToTopic: exports.subscribeToTopic,
  unsubscribeFromTopic: exports.unsubscribeFromTopic,
  sendTestNotification: exports.sendTestNotification,
  sendMulticastNotification: exports.sendMulticastNotification,
};
