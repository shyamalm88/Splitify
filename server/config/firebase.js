const admin = require("firebase-admin");

// Initialize Firebase Admin SDK
// You need to provide your service account credentials
const initializeFirebaseAdmin = () => {
  try {
    if (admin.apps.length === 0) {
      // If using environment variables
      if (process.env.FIREBASE_SERVICE_ACCOUNT) {
        const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
        });
      }
      // If using a JSON file (for development)
      else if (process.env.NODE_ENV !== "production") {
        try {
          const serviceAccount = require("../firebase-service-account.json");
          admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
          });
        } catch (error) {
          console.warn(
            "Firebase service account file not found. Firebase services will not work."
          );
          console.warn(
            "Create a firebase-service-account.json file in the server directory."
          );
        }
      } else {
        console.warn(
          "Firebase service account not configured. Firebase services will not work."
        );
      }
    }
  } catch (error) {
    console.error("Firebase initialization error:", error);
  }
};

initializeFirebaseAdmin();

// Development mode OTP codes - only used in dev mode
const DEV_MODE_OTP_MAP = {
  "+11234567890": "123456", // Test US number
  "+12025550134": "123456", // Another test US number
  "+919876543210": "123456", // Test India number
};

// Check if we're in development mode
const isDevelopmentMode = () => {
  return process.env.NODE_ENV === "development";
};

module.exports = {
  admin,

  // Verify a Firebase phone auth token
  verifyIdToken: async (idToken) => {
    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      return {
        success: true,
        uid: decodedToken.uid,
        phone: decodedToken.phone_number,
      };
    } catch (error) {
      console.error("Error verifying Firebase ID token:", error);
      return { success: false, error: error.message };
    }
  },

  // Send OTP verification code
  sendOTP: async (phoneNumber) => {
    try {
      if (!phoneNumber) {
        throw new Error("Phone number is required");
      }

      // Format phone number if needed
      const formattedPhone = phoneNumber.startsWith("+")
        ? phoneNumber
        : `+${phoneNumber}`;

      // In development mode, we just simulate sending an OTP
      if (isDevelopmentMode()) {
        console.log(`[DEV MODE] Simulating OTP send to ${formattedPhone}`);

        // Generate a session ID for this verification attempt
        const sessionId = `dev-session-${Date.now()}-${Math.random()
          .toString(36)
          .substring(2, 15)}`;

        return {
          success: true,
          sessionInfo: sessionId,
          inDevMode: true,
        };
      }

      // In production, use Firebase Authentication to send the OTP
      // Note: This requires setting up Firebase Auth with a phone provider
      const sessionInfo = await admin.auth().createSessionCookie(
        formattedPhone,
        { expiresIn: 60 * 5 * 1000 } // 5 minutes
      );

      return {
        success: true,
        sessionInfo,
      };
    } catch (error) {
      console.error("Error sending OTP:", error);
      return { success: false, error: error.message };
    }
  },

  // Verify OTP code
  verifyOTP: async (phoneNumber, code, sessionInfo) => {
    try {
      if (!phoneNumber || !code || !sessionInfo) {
        throw new Error("Phone number, code and session info are required");
      }

      // Format phone number if needed
      const formattedPhone = phoneNumber.startsWith("+")
        ? phoneNumber
        : `+${phoneNumber}`;

      // In development mode, check against our predefined OTPs
      if (isDevelopmentMode()) {
        console.log(`[DEV MODE] Verifying OTP for ${formattedPhone}: ${code}`);

        // Check if session is valid (simple check in dev mode)
        if (!sessionInfo.startsWith("dev-session-")) {
          throw new Error("Invalid session");
        }

        // Check if the OTP matches our dev mode map
        const expectedOtp = DEV_MODE_OTP_MAP[formattedPhone];
        if (!expectedOtp) {
          throw new Error("Phone number not found in development OTP map");
        }

        if (code !== expectedOtp) {
          throw new Error("Invalid OTP code");
        }

        // Find or create a user with this phone number
        let userRecord;
        try {
          userRecord = await admin.auth().getUserByPhoneNumber(formattedPhone);
        } catch (error) {
          // User doesn't exist, create a new one
          if (error.code === "auth/user-not-found") {
            userRecord = await admin.auth().createUser({
              phoneNumber: formattedPhone,
            });
          } else {
            throw error;
          }
        }

        // Create a custom token for the user
        const customToken = await admin
          .auth()
          .createCustomToken(userRecord.uid);

        return {
          success: true,
          uid: userRecord.uid,
          phoneNumber: formattedPhone,
          token: customToken,
          inDevMode: true,
        };
      }

      // In production, verify the OTP through Firebase Auth
      // This would typically be handled client-side with Firebase SDK
      // Here we would just verify the token they send us after verification

      // For now, just return a placeholder error
      throw new Error(
        "Production OTP verification should be handled by Firebase client SDK"
      );
    } catch (error) {
      console.error("Error verifying OTP:", error);
      return { success: false, error: error.message };
    }
  },

  // Create a custom token for a user
  createCustomToken: async (uid) => {
    try {
      const customToken = await admin.auth().createCustomToken(uid);
      return { success: true, token: customToken };
    } catch (error) {
      console.error("Error creating custom token:", error);
      return { success: false, error: error.message };
    }
  },

  // Get user by phone number
  getUserByPhoneNumber: async (phoneNumber) => {
    try {
      const userRecord = await admin.auth().getUserByPhoneNumber(phoneNumber);
      return { success: true, user: userRecord };
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        return { success: false, error: "User not found", notFound: true };
      }
      console.error("Error getting user by phone number:", error);
      return { success: false, error: error.message };
    }
  },

  // Send push notification to a specific device
  sendPushNotification: async (token, title, body, data = {}) => {
    try {
      if (!token) {
        throw new Error("No device token provided");
      }

      const message = {
        notification: {
          title,
          body,
        },
        data: {
          ...data,
          click_action: "FLUTTER_NOTIFICATION_CLICK", // For Flutter apps
        },
        token,
      };

      const response = await admin.messaging().send(message);
      return { success: true, response };
    } catch (error) {
      console.error("Error sending push notification:", error);
      return { success: false, error: error.message };
    }
  },

  // Send notification to multiple devices
  sendMulticastPushNotification: async (tokens, title, body, data = {}) => {
    try {
      if (!tokens || !tokens.length) {
        throw new Error("No device tokens provided");
      }

      const message = {
        notification: {
          title,
          body,
        },
        data: {
          ...data,
          click_action: "FLUTTER_NOTIFICATION_CLICK", // For Flutter apps
        },
        tokens,
      };

      const response = await admin.messaging().sendMulticast(message);
      return {
        success: true,
        successCount: response.successCount,
        failureCount: response.failureCount,
        response,
      };
    } catch (error) {
      console.error("Error sending multicast push notification:", error);
      return { success: false, error: error.message };
    }
  },

  // Send notification to a topic
  sendTopicPushNotification: async (topic, title, body, data = {}) => {
    try {
      const message = {
        notification: {
          title,
          body,
        },
        data: {
          ...data,
          click_action: "FLUTTER_NOTIFICATION_CLICK", // For Flutter apps
        },
        topic,
      };

      const response = await admin.messaging().send(message);
      return { success: true, response };
    } catch (error) {
      console.error("Error sending topic push notification:", error);
      return { success: false, error: error.message };
    }
  },
};
