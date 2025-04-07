const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");
require("dotenv").config(); // Ensure .env is loaded

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
          messaging: {
            vapidKey:
              "BAy7oap_tw_ewQqkQJISkP6rPav_XhxFTuEu2lBsmyhfdbMJfzqm5n6eJwXYri3YY3xBYaGib8V9yz_ATw02uPM", // Web Push certification key
          },
        });
        console.log("Firebase initialized from environment variable");
      }
      // If using a JSON file (for development)
      else if (process.env.NODE_ENV !== "production") {
        try {
          // Explicit path resolution to find the file
          const serviceAccountPath = path.resolve(
            __dirname,
            "../firebase-service-account.json"
          );

          // Check if file exists
          if (!fs.existsSync(serviceAccountPath)) {
            throw new Error(
              `Service account file not found at: ${serviceAccountPath}`
            );
          }

          const serviceAccount = require(serviceAccountPath);
          admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            messaging: {
              vapidKey:
                "BAy7oap_tw_ewQqkQJISkP6rPav_XhxFTuEu2lBsmyhfdbMJfzqm5n6eJwXYri3YY3xBYaGib8V9yz_ATw02uPM", // Web Push certification key
            },
          });
          console.log("Firebase initialized from local service account file");
        } catch (error) {
          console.warn(
            "Firebase service account file not found. Firebase services will not work."
          );
          console.warn(
            "Create a firebase-service-account.json file in the server directory."
          );
          console.warn("Error details:", error.message);

          // For development, let's initialize a mock Firebase app so the server can still run
          if (process.env.NODE_ENV === "development") {
            console.log("Initializing mock Firebase setup for development");

            // Create a mock app for development purposes
            const mockApp = {
              name: "[DEFAULT]",
              options: {
                credential: { projectId: "mock-firebase-project" },
              },
            };

            // Create mock admin methods
            admin.auth = () => ({
              verifyIdToken: async () => ({
                uid: "mock-uid",
                phone_number: "+1234567890",
              }),
              getUserByPhoneNumber: async () => ({ uid: "mock-uid" }),
              createUser: async () => ({ uid: "mock-uid" }),
              createCustomToken: async () => "mock-token",
            });

            // Make the apps array include our mock
            Object.defineProperty(admin, "apps", {
              get: () => [mockApp],
              configurable: true,
            });

            console.log("Mock Firebase setup completed");
          }
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
  const isDev = process.env.NODE_ENV === "development" || !process.env.NODE_ENV;
  console.log("[FIREBASE] Development mode:", isDev);
  return isDev;
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

      console.log(`[FIREBASE] Attempting to send OTP to: ${formattedPhone}`);

      // In development mode, we just simulate sending an OTP
      if (isDevelopmentMode()) {
        console.log(
          `[FIREBASE] DEV MODE: Simulating OTP send to ${formattedPhone}`
        );

        // Generate a session ID for this verification attempt
        const sessionId = `dev-session-${Date.now()}-${Math.random()
          .toString(36)
          .substring(2, 15)}`;

        // Store the OTP code for this session
        DEV_MODE_OTP_MAP[formattedPhone] = "123456";

        console.log(`[FIREBASE] DEV MODE: Generated session ID: ${sessionId}`);
        console.log(`[FIREBASE] DEV MODE: Use OTP code 123456 for testing`);

        return {
          success: true,
          sessionInfo: sessionId,
          inDevMode: true,
        };
      }

      // In production, we need to use the Firebase Client SDK for phone auth
      // The Admin SDK cannot send OTP codes directly
      console.log(
        `[FIREBASE] PRODUCTION MODE: Phone auth should be handled by client SDK`
      );

      // Generate a session ID for tracking
      const sessionId = `prod-session-${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 15)}`;

      return {
        success: true,
        sessionInfo: sessionId,
        message: "Please use Firebase Client SDK for phone authentication",
      };
    } catch (error) {
      console.error("[FIREBASE] Error sending OTP:", error);
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

      console.log(`[FIREBASE] Attempting to verify OTP for: ${formattedPhone}`);
      console.log(`[FIREBASE] Code: ${code}, Session: ${sessionInfo}`);

      // In development mode, check against our predefined OTPs
      if (isDevelopmentMode()) {
        console.log(
          `[FIREBASE] DEV MODE: Verifying OTP for ${formattedPhone}: ${code}`
        );

        // Check if session is valid (accept both dev and prod session formats in dev mode)
        if (
          !sessionInfo.startsWith("dev-session-") &&
          !sessionInfo.startsWith("prod-session-")
        ) {
          console.log(
            `[FIREBASE] DEV MODE: Invalid session format: ${sessionInfo}`
          );
          throw new Error("Invalid session");
        }

        // Check if the OTP matches our dev mode map
        const expectedOtp = DEV_MODE_OTP_MAP[formattedPhone];
        if (!expectedOtp) {
          console.log(
            `[FIREBASE] DEV MODE: No predefined OTP for ${formattedPhone}, using default 123456`
          );
        }

        // In dev mode, accept any 6-digit code or the predefined one
        const isValidOtp =
          code === "123456" || (expectedOtp && code === expectedOtp);

        if (isValidOtp) {
          console.log(`[FIREBASE] DEV MODE: OTP verification successful`);

          // Generate a mock Firebase UID if not exists
          const uid = `dev-uid-${formattedPhone.replace(/\+/g, "")}`;

          // Generate a mock Firebase token
          const token = `dev-token-${Date.now()}`;

          return {
            success: true,
            uid,
            phoneNumber: formattedPhone,
            token,
            inDevMode: true,
          };
        } else {
          console.log(
            `[FIREBASE] DEV MODE: OTP verification failed - invalid code`
          );
          throw new Error("Invalid verification code");
        }
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

  // Send web push notification (specifically for browsers)
  sendWebPushNotification: async (
    token,
    title,
    body,
    data = {},
    options = {}
  ) => {
    try {
      if (!token) {
        throw new Error("No FCM token provided");
      }

      const message = {
        notification: {
          title,
          body,
          icon: options.icon || "/favicon.ico",
          click_action: options.click_action || "/",
        },
        data: data,
        token: token,
        webpush: {
          notification: {
            icon: options.icon || "/favicon.ico",
            badge: options.badge || "/badge.png",
            vibrate: options.vibrate || [100, 50, 100],
            actions: options.actions || [],
            fcm_options: {
              link: options.link || "/",
            },
          },
          fcm_options: {
            link: options.link || "/",
          },
        },
      };

      const response = await admin.messaging().send(message);
      return { success: true, response };
    } catch (error) {
      console.error("Error sending web push notification:", error);
      return { success: false, error: error.message };
    }
  },

  // Subscribe to a topic for web push notifications
  subscribeToTopic: async (tokens, topic) => {
    try {
      if (!tokens || !tokens.length) {
        throw new Error("No tokens provided");
      }

      if (!topic) {
        throw new Error("No topic provided");
      }

      // Subscribing devices to a topic
      const response = await admin.messaging().subscribeToTopic(tokens, topic);

      return {
        success: true,
        successCount: response.successCount,
        failureCount: response.failureCount,
      };
    } catch (error) {
      console.error("Error subscribing to topic:", error);
      return { success: false, error: error.message };
    }
  },

  // Unsubscribe from a topic
  unsubscribeFromTopic: async (tokens, topic) => {
    try {
      if (!tokens || !tokens.length) {
        throw new Error("No tokens provided");
      }

      if (!topic) {
        throw new Error("No topic provided");
      }

      // Unsubscribing devices from a topic
      const response = await admin
        .messaging()
        .unsubscribeFromTopic(tokens, topic);

      return {
        success: true,
        successCount: response.successCount,
        failureCount: response.failureCount,
      };
    } catch (error) {
      console.error("Error unsubscribing from topic:", error);
      return { success: false, error: error.message };
    }
  },
};
