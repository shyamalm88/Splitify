const User = require("../models/User");
const {
  sendPushNotification,
  sendMulticastPushNotification,
  sendTopicPushNotification,
} = require("../config/firebase");

// @desc    Register device token for push notifications
// @route   POST /api/notifications/register-token
// @access  Private
exports.registerDeviceToken = async (req, res) => {
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

    // Check if token already exists
    if (!user.deviceTokens.includes(token)) {
      user.deviceTokens.push(token);
      await user.save();
    }

    res.status(200).json({ message: "Device token registered successfully" });
  } catch (error) {
    console.error("Error registering device token:", error);
    res.status(500).json({ message: "Server error" });
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
