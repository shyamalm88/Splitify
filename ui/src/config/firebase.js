import firebase from "firebase/compat/app";
import "firebase/compat/auth";

// Initialize Firebase if it hasn't been initialized already
const initializeFirebase = () => {
  if (!firebase.apps.length) {
    // Your Firebase configuration
    // Get this from the Firebase console: Project settings > General > Your apps > SDK setup and configuration
    const firebaseConfig = {
      // Replace with your actual Firebase config
      apiKey: "YOUR_API_KEY",
      authDomain: "YOUR_AUTH_DOMAIN",
      projectId: "YOUR_PROJECT_ID",
      storageBucket: "YOUR_STORAGE_BUCKET",
      messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
      appId: "YOUR_APP_ID",
    };

    firebase.initializeApp(firebaseConfig);
  }
};

// Call initialize function
initializeFirebase();

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

export { firebase, phoneAuth, emailLinkAuth };
