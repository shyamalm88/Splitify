const jwt = require("jsonwebtoken");
const {
  verifyIdToken,
  getUserByPhoneNumber,
  sendOTP,
  verifyOTP,
} = require("../config/firebase");
const User = require("../models/User");

// @desc    Send OTP to phone number
// @route   POST /api/auth/send-otp
// @access  Public
exports.sendOtpCode = async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    console.log(`[OTP SERVER] Received request to send OTP to: ${phoneNumber}`);

    if (!phoneNumber) {
      console.log(`[OTP SERVER] Error: Phone number is missing`);
      return res.status(400).json({
        success: false,
        message: "Phone number is required",
      });
    }

    // Validate phone number format
    const { validatePhoneNumber } = require("../utils/validation");
    if (!validatePhoneNumber(phoneNumber)) {
      console.log(`[OTP SERVER] Error: Invalid phone number format`);
      return res.status(400).json({
        success: false,
        message: "Invalid phone number format",
      });
    }

    // Send OTP through Firebase
    console.log(`[OTP SERVER] Calling Firebase to send OTP to: ${phoneNumber}`);
    const result = await sendOTP(phoneNumber);
    console.log(`[OTP SERVER] Firebase response:`, JSON.stringify(result));

    if (!result.success) {
      console.log(
        `[OTP SERVER] Error sending OTP: ${result.error || "Unknown error"}`
      );
      return res.status(500).json({
        success: false,
        message: result.error || "Failed to send OTP",
      });
    }

    // Return the session info needed for verification
    console.log(
      `[OTP SERVER] OTP sent successfully. Session info: ${result.sessionInfo}`
    );
    return res.json({
      success: true,
      sessionInfo: result.sessionInfo,
      inDevMode: result.inDevMode || false,
      message: "OTP code sent successfully",
    });
  } catch (error) {
    console.error("[OTP SERVER] Error in sendOtpCode:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while sending OTP",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// @desc    Verify OTP code
// @route   POST /api/auth/verify-otp
// @access  Public
exports.verifyOtpCode = async (req, res) => {
  try {
    const { phoneNumber, code, sessionInfo } = req.body;
    console.log("[OTP SERVER] Received verification request with data:", {
      phoneNumber,
      code,
      sessionInfo,
    });

    if (!phoneNumber || !code || !sessionInfo) {
      console.log("[OTP SERVER] Missing required fields:", {
        hasPhoneNumber: !!phoneNumber,
        hasCode: !!code,
        hasSessionInfo: !!sessionInfo,
      });
      return res.status(400).json({
        success: false,
        message:
          "Phone number, verification code, and session info are required",
      });
    }

    // Verify the OTP
    console.log(`[OTP SERVER] Calling Firebase to verify OTP`);
    const result = await verifyOTP(phoneNumber, code, sessionInfo);
    console.log(
      `[OTP SERVER] Firebase verification response:`,
      JSON.stringify(result)
    );

    if (!result.success) {
      console.log(
        `[OTP SERVER] Error verifying OTP: ${result.error || "Invalid code"}`
      );
      return res.status(400).json({
        success: false,
        message: result.error || "Invalid verification code",
      });
    }

    // Find or create user in our database
    console.log(
      `[OTP SERVER] Looking up user with phone: ${result.phoneNumber}`
    );
    let user = await User.findOne({ phoneNumber: result.phoneNumber });

    if (!user) {
      // If no user exists with this phone, create one
      console.log(`[OTP SERVER] User not found, creating new user`);
      const username = `user_${Math.floor(100000 + Math.random() * 900000)}`; // Generate random username
      const email = `${username}@example.com`; // Generate temporary email
      const password = Math.random().toString(36).slice(-10); // Generate random password

      user = new User({
        username,
        email,
        phoneNumber: result.phoneNumber,
        firebaseUid: result.uid,
        password, // This is a placeholder, user should update profile later
      });

      await user.save();
      console.log(`[OTP SERVER] New user created with ID: ${user._id}`);
    } else {
      // Update Firebase UID if needed
      console.log(`[OTP SERVER] Existing user found with ID: ${user._id}`);
      if (user.firebaseUid !== result.uid) {
        console.log(
          `[OTP SERVER] Updating Firebase UID from ${user.firebaseUid} to ${result.uid}`
        );
        user.firebaseUid = result.uid;
        await user.save();
      }
    }

    // Generate JWT token for our API
    console.log(`[OTP SERVER] Generating JWT token for user: ${user._id}`);
    const token = jwt.sign(
      { id: user._id, firebaseUid: user.firebaseUid },
      process.env.JWT_SECRET || "your-jwt-secret-key",
      { expiresIn: "30d" }
    );

    console.log(
      `[OTP SERVER] OTP verification successful, returning token and user data`
    );
    return res.json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        phoneNumber: user.phoneNumber,
        email: user.email,
      },
      firebaseToken: result.token, // Firebase custom token for client-side auth
      inDevMode: result.inDevMode || false,
    });
  } catch (error) {
    console.error("[OTP SERVER] Error in verifyOtpCode:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while verifying OTP",
    });
  }
};

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

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, firebaseUid: user.firebaseUid },
      process.env.JWT_SECRET || "your-jwt-secret-key",
      { expiresIn: "30d" }
    );

    return res.json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        phoneNumber: user.phoneNumber,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Error in phoneLogin:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during phone login",
    });
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
      return res.status(409).json({
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
