const jwt = require("jsonwebtoken");
const { verifyIdToken, getUserByPhoneNumber } = require("../config/firebase");
const User = require("../models/User");

// @desc    Login or register using phone number with Firebase auth
// @route   POST /api/auth/phone-login
// @access  Public
exports.phoneLogin = async (req, res) => {
  try {
    const { idToken, deviceToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ message: "Firebase ID token is required" });
    }

    // Verify the Firebase ID token
    const verifyResult = await verifyIdToken(idToken);

    if (!verifyResult.success) {
      return res
        .status(401)
        .json({ message: "Invalid Firebase token", error: verifyResult.error });
    }

    const { uid, phone } = verifyResult;

    if (!phone) {
      return res
        .status(400)
        .json({ message: "Phone number not found in the token" });
    }

    // Check if user exists with this phone number
    let user = await User.findOne({ phoneNumber: phone });

    if (!user) {
      // Create new user with phone number
      const username = `user_${Math.floor(100000 + Math.random() * 900000)}`; // Generate random username
      const email = `${username}@example.com`; // Generate temporary email
      const password = Math.random().toString(36).slice(-10); // Generate random password

      user = new User({
        username,
        email,
        phoneNumber: phone,
        firebaseUid: uid,
        password, // This is a placeholder, user should update profile later
        deviceTokens: deviceToken ? [deviceToken] : [],
      });

      await user.save();
    } else {
      // Update Firebase UID if needed
      if (user.firebaseUid !== uid) {
        user.firebaseUid = uid;
      }

      // Add device token if provided and not already stored
      if (deviceToken && !user.deviceTokens.includes(deviceToken)) {
        user.deviceTokens.push(deviceToken);
      }

      await user.save();
    }

    // Generate JWT
    const payload = {
      id: user.id,
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "7d" }, // Longer expiry for mobile
      (err, token) => {
        if (err) throw err;

        // Return user info without sensitive data
        const userResponse = {
          id: user._id,
          username: user.username,
          phoneNumber: user.phoneNumber,
          email: user.email,
          isNewUser: user.username.startsWith("user_"), // Flag to indicate if this is a new user
        };

        res.json({
          token,
          user: userResponse,
        });
      }
    );
  } catch (error) {
    console.error("Phone authentication error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Link phone number to existing account
// @route   POST /api/auth/link-phone
// @access  Private
exports.linkPhone = async (req, res) => {
  try {
    const { idToken } = req.body;
    const userId = req.user.id; // From auth middleware

    if (!idToken) {
      return res.status(400).json({ message: "Firebase ID token is required" });
    }

    // Verify the Firebase ID token
    const verifyResult = await verifyIdToken(idToken);

    if (!verifyResult.success) {
      return res
        .status(401)
        .json({ message: "Invalid Firebase token", error: verifyResult.error });
    }

    const { uid, phone } = verifyResult;

    if (!phone) {
      return res
        .status(400)
        .json({ message: "Phone number not found in the token" });
    }

    // Check if another user already has this phone number
    const existingUser = await User.findOne({ phoneNumber: phone });

    if (existingUser && existingUser._id.toString() !== userId) {
      return res
        .status(409)
        .json({
          message: "This phone number is already linked to another account",
        });
    }

    // Update user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.phoneNumber = phone;
    user.firebaseUid = uid;

    await user.save();

    res.json({
      message: "Phone number linked successfully",
      user: {
        id: user._id,
        username: user.username,
        phoneNumber: user.phoneNumber,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Link phone error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
