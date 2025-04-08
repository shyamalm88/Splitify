import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/messaging";
import { Platform } from "react-native";
import * as Notifications from "expo-notifications";

// Configure Expo notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Initialize Firebase if it hasn't been initialized already
const initializeFirebase = () => {
  if (!firebase.apps.length) {
    // Your Firebase configuration
    const firebaseConfig = {
      apiKey: "AIzaSyC1xLhbGBeg7pCJNM-ON5aMCT_1RY5560I",
      authDomain: "splitify-cd256.firebaseapp.com",
      projectId: "splitify-cd256",
      storageBucket: "splitify-cd256.firebasestorage.app",
      messagingSenderId: "1056124364476",
      appId: "1:1234567890:web:321abc456def7890",
    };

    firebase.initializeApp(firebaseConfig);

    // Initialize Firebase messaging only for web platform
    if (
      Platform.OS === "web" &&
      typeof window !== "undefined" &&
      firebase.messaging
    ) {
      try {
        firebase.messaging();
        console.log("Firebase messaging initialized successfully");
      } catch (error) {
        console.error("Error initializing Firebase messaging:", error);
      }
    }
  }
};

// Call initialize function
initializeFirebase();

// Function to request notification permission and get token
const requestNotificationPermission = async () => {
  try {
    // Handle React Native platform
    if (Platform.OS !== "web") {
      // Request permission for notifications
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        return {
          success: false,
          error: "Permission not granted",
        };
      }

      // Get the Expo push token
      const expoPushToken = await Notifications.getExpoPushTokenAsync({
        projectId: "1056124364476", // Your Firebase sender ID
      });

      console.log("Expo push token:", expoPushToken);

      return {
        success: true,
        token: expoPushToken.data,
      };
    }

    // Handle web platform
    if (!firebase.messaging || !firebase.messaging.isSupported()) {
      console.warn("Firebase messaging is not supported in this environment");
      return { success: false, error: "Messaging not supported" };
    }

    const messaging = firebase.messaging();

    // Request permission
    const permission = await Notification.requestPermission();

    if (permission !== "granted") {
      return {
        success: false,
        error: "Notification permission not granted",
      };
    }

    // Get token
    const token = await messaging.getToken({
      vapidKey:
        "BAy7oap_tw_ewQqkQJISkP6rPav_XhxFTuEu2lBsmyhfdbMJfzqm5n6eJwXYri3YY3xBYaGib8V9yz_ATw02uPM",
    });

    return { success: true, token };
  } catch (error) {
    console.error("Error requesting notification permission:", error);
    return {
      success: false,
      error: error.message || "Failed to request notification permission",
    };
  }
};

// Handle foreground messages
const setupMessageListener = () => {
  try {
    // Only proceed with web messaging if on web platform
    if (Platform.OS !== "web") {
      console.warn(
        "Firebase web messaging is not supported on mobile platforms"
      );
      return;
    }

    if (!firebase.messaging || !firebase.messaging.isSupported()) {
      return;
    }

    const messaging = firebase.messaging();

    // Handle foreground messages
    messaging.onMessage((payload) => {
      console.log("Message received in foreground:", payload);
      // You can show a notification here using the Notification API
      const { title, body } = payload.notification;

      new Notification(title, {
        body,
        icon: "/favicon.ico",
      });
    });
  } catch (error) {
    console.error("Error setting up message listener:", error);
  }
};

// Alternative authentication methods that work better with Expo
const emailLinkAuth = {
  // Send sign-in link to email
  sendSignInLink: async (email) => {
    try {
      const actionCodeSettings = {
        // URL you want to redirect back to
        url: "https://your-app-url.com/finishSignIn",
        // Pass the app package name for mobile
        handleCodeInApp: true,
        // iOS app bundle ID
        iOS: {
          bundleId: "com.shyamalm88.UI-expo",
        },
        // Android app package name
        android: {
          packageName: "com.shyamalm88.UI_expo",
          installApp: true,
        },
      };

      await firebase.auth().sendSignInLinkToEmail(email, actionCodeSettings);

      // Save the email to localStorage/AsyncStorage so you can check it on completion
      localStorage.setItem("emailForSignIn", email);

      return { success: true };
    } catch (error) {
      console.error("Error sending sign-in link:", error);
      return {
        success: false,
        error: error.message || "Failed to send sign-in link",
      };
    }
  },

  // Confirm sign-in with email link
  confirmSignIn: async (email, link) => {
    try {
      // Check if the link is a sign-in link
      if (firebase.auth().isSignInWithEmailLink(link)) {
        // Sign in
        const result = await firebase.auth().signInWithEmailLink(email, link);
        const user = result.user;

        // Get ID token
        const idToken = await user.getIdToken();

        return {
          success: true,
          user,
          idToken,
        };
      } else {
        throw new Error("Invalid sign-in link");
      }
    } catch (error) {
      console.error("Error confirming sign-in:", error);
      return {
        success: false,
        error: error.message || "Failed to complete sign-in",
      };
    }
  },
};

// Phone Authentication Helper Functions
const phoneAuth = {
  // Send verification code
  sendVerificationCode: async (phoneNumber) => {
    try {
      // Format the phone number (ensure it has country code)
      const formattedPhone = phoneNumber.startsWith("+")
        ? phoneNumber
        : `+${phoneNumber}`;

      // Set up recaptcha verifier - required for web
      window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
        "recaptcha-container",
        {
          size: "invisible",
          callback: (response) => {
            // reCAPTCHA solved, allow signInWithPhoneNumber.
          },
        }
      );

      // Request verification code
      const confirmation = await firebase
        .auth()
        .signInWithPhoneNumber(formattedPhone, window.recaptchaVerifier);
      return { success: true, confirmation };
    } catch (error) {
      console.error("Error sending verification code:", error);
      return {
        success: false,
        error: error.message || "Failed to send verification code",
      };
    }
  },

  // Verify code and sign in
  confirmCode: async (confirmation, code) => {
    try {
      if (!confirmation) {
        throw new Error("No confirmation object available");
      }

      // Confirm the verification code
      const result = await confirmation.confirm(code);
      const user = result.user;

      // Get the ID token
      const idToken = await user.getIdToken();

      return {
        success: true,
        user,
        idToken,
      };
    } catch (error) {
      console.error("Error confirming verification code:", error);
      return {
        success: false,
        error: error.message || "Failed to confirm verification code",
      };
    }
  },

  // Sign out
  signOut: async () => {
    try {
      await firebase.auth().signOut();
      return { success: true };
    } catch (error) {
      console.error("Error signing out:", error);
      return {
        success: false,
        error: error.message || "Failed to sign out",
      };
    }
  },

  // Get current user
  getCurrentUser: () => {
    return firebase.auth().currentUser;
  },

  // Check if user is logged in
  isUserLoggedIn: () => {
    return !!firebase.auth().currentUser;
  },
};

// Export the firebase instance and utility functions
export {
  firebase,
  phoneAuth,
  emailLinkAuth,
  requestNotificationPermission,
  setupMessageListener,
};
