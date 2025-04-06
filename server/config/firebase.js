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
