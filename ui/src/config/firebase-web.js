import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
  sendEmailVerification,
  signInWithPhoneNumber,
  RecaptchaVerifier,
} from "firebase/auth";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC1xLhbGBeg7pCJNM-ON5aMCT_1RY5560I",
  authDomain: "splitify-app-abc123.firebaseapp.com",
  projectId: "splitify-app-abc123",
  storageBucket: "splitify-app-abc123.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abc123def456",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);

// Email link authentication helpers
export const emailLinkAuth = {
  // Send a sign-in link to user's email
  sendSignInLink: async (email, actionCodeSettings) => {
    try {
      // Default action code settings if not provided
      const settings = actionCodeSettings || {
        url: "https://splitify-app-abc123.firebaseapp.com/login",
        handleCodeInApp: true,
        iOS: {
          bundleId: "com.shyamalm88.UI-expo",
        },
        android: {
          packageName: "com.shyamalm88.UI_expo",
          installApp: true,
        },
      };

      await sendSignInLinkToEmail(auth, email, settings);
      return { success: true };
    } catch (error) {
      console.error("Error sending sign-in link:", error);
      return { success: false, error: error.message };
    }
  },

  // Confirm sign-in with the link from email
  confirmSignIn: async (email, link) => {
    try {
      if (!isSignInWithEmailLink(auth, link)) {
        throw new Error("Invalid sign-in link");
      }

      const result = await signInWithEmailLink(auth, email, link);
      const idToken = await result.user.getIdToken();

      return {
        success: true,
        user: result.user,
        idToken,
      };
    } catch (error) {
      console.error("Error confirming sign-in:", error);
      return { success: false, error: error.message };
    }
  },
};

// Phone authentication using Web SDK with RecaptchaVerifier
export const phoneAuth = {
  initRecaptcha: (containerOrId) => {
    try {
      const recaptchaVerifier = new RecaptchaVerifier(auth, containerOrId, {
        size: "invisible",
      });
      return { success: true, recaptchaVerifier };
    } catch (error) {
      console.error("Error initializing recaptcha:", error);
      return { success: false, error: error.message };
    }
  },

  // Send verification code
  sendVerificationCode: async (phoneNumber, recaptchaVerifier) => {
    try {
      const confirmationResult = await signInWithPhoneNumber(
        auth,
        phoneNumber,
        recaptchaVerifier
      );
      return { success: true, confirmationResult };
    } catch (error) {
      console.error("Error sending code:", error);
      return { success: false, error: error.message };
    }
  },

  // Confirm verification code
  confirmCode: async (confirmationResult, code) => {
    try {
      const result = await confirmationResult.confirm(code);
      const idToken = await result.user.getIdToken();

      return {
        success: true,
        user: result.user,
        idToken,
      };
    } catch (error) {
      console.error("Error confirming code:", error);
      return { success: false, error: error.message };
    }
  },

  // Sign out
  signOut: async () => {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      console.error("Error signing out:", error);
      return { success: false, error: error.message };
    }
  },

  // Get current user
  getCurrentUser: () => {
    return auth.currentUser;
  },

  // Check if user is logged in
  isUserLoggedIn: () => {
    return !!auth.currentUser;
  },

  // Listen for auth state changes
  onAuthStateChanged: (callback) => {
    return onAuthStateChanged(auth, callback);
  },
};

export { firebaseApp, auth };
