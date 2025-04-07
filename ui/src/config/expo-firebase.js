import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

// Initialize WebBrowser for auth redirects
WebBrowser.maybeCompleteAuthSession();

// Your backend API URL - keeping this for future use
const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:5001/api"; // Use environment variable with fallback

// Development flag - set to true during development
const DEV_MODE = process.env.EXPO_PUBLIC_DEV_MODE === "true";

/**
 * Helper functions for phone authentication using Expo and backend API
 */
export const expoAuth = {
  /**
   * Send OTP to the provided phone number
   * @param {string} phoneNumber - The phone number to send OTP to (with country code)
   * @returns {Promise<Object>} - The result of the OTP sending operation
   */
  sendOTP: async (phoneNumber) => {
    try {
      // Format phone number if needed
      const formattedPhone = phoneNumber.startsWith("+")
        ? phoneNumber
        : `+${phoneNumber}`;

      // Store the phone number for verification
      await AsyncStorage.setItem("phone_auth_number", formattedPhone);

      if (DEV_MODE) {
        // Mock server response during development
        console.log("DEV MODE: Use OTP code 123456");
        const mockSessionInfo = `dev-session-${Date.now()}`;
        await AsyncStorage.setItem("phone_auth_session", mockSessionInfo);

        return {
          success: true,
          sessionInfo: mockSessionInfo,
          inDevMode: true,
        };
      } else {
        // Call backend API to send OTP through Firebase
        const response = await axios.post(`${API_URL}/auth/send-otp`, {
          phoneNumber: formattedPhone,
        });

        if (response.data && response.data.success) {
          // Store the session info for verification
          await AsyncStorage.setItem(
            "phone_auth_session",
            response.data.sessionInfo
          );

          return {
            success: true,
            sessionInfo: response.data.sessionInfo,
            inDevMode: response.data.inDevMode || false,
          };
        } else {
          throw new Error(response.data?.message || "Failed to send OTP");
        }
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      return {
        success: false,
        error: error.message || "Failed to send OTP",
      };
    }
  },

  /**
   * Verify the OTP code against the stored phone number
   * @param {string} otpCode - The OTP code entered by the user
   * @returns {Promise<Object>} - The result of the verification operation
   */
  verifyOTP: async (otpCode) => {
    try {
      // Get the stored phone number and session info
      const phoneNumber = await AsyncStorage.getItem("phone_auth_number");
      const sessionInfo = await AsyncStorage.getItem("phone_auth_session");

      console.log("[OTP DEBUG] Stored phone number:", phoneNumber);
      console.log("[OTP DEBUG] Stored session info:", sessionInfo);
      console.log("[OTP DEBUG] OTP code:", otpCode);

      if (!phoneNumber || !sessionInfo) {
        throw new Error("Phone number or session information missing");
      }

      if (DEV_MODE) {
        // In dev mode, accept "123456" as the valid code
        const isValidOtp = otpCode === "123456";

        if (isValidOtp) {
          // Generate a simple token for development
          const mockUser = {
            id: "user123",
            phoneNumber,
            name: "Test User",
            email: "test@example.com",
            createdAt: new Date().toISOString(),
          };

          // Create a simple token format: dev_userId_timestamp
          const timestamp = Date.now();
          const mockToken = `dev_${mockUser.id}_${timestamp}`;
          console.log("[DEV] Created development token:", mockToken);

          // Store auth data
          await AsyncStorage.setItem("auth_token", mockToken);
          await AsyncStorage.setItem("user_data", JSON.stringify(mockUser));

          console.log("[DEV] Saved auth data to AsyncStorage");

          return {
            success: true,
            user: mockUser,
            token: mockToken,
          };
        } else {
          return {
            success: false,
            error: "Invalid verification code",
          };
        }
      } else {
        // Call backend API to verify OTP
        console.log("[OTP DEBUG] Sending verification request with:", {
          phoneNumber,
          code: otpCode,
          sessionInfo,
        });

        const response = await axios.post(`${API_URL}/auth/verify-otp`, {
          phoneNumber,
          code: otpCode,
          sessionInfo,
        });

        if (response.data && response.data.success) {
          // Store the auth token
          await AsyncStorage.setItem("auth_token", response.data.token);

          // Store user information
          await AsyncStorage.setItem(
            "user_data",
            JSON.stringify(response.data.user)
          );

          return {
            success: true,
            user: response.data.user,
            token: response.data.token,
          };
        } else {
          throw new Error(response.data?.message || "Failed to verify OTP");
        }
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      return {
        success: false,
        error: error.message || "Failed to verify OTP",
      };
    }
  },

  /**
   * Check if a user is currently logged in
   * @returns {Promise<boolean>} - Whether the user is logged in
   */
  isUserLoggedIn: async () => {
    try {
      const token = await AsyncStorage.getItem("auth_token");
      return !!token;
    } catch (error) {
      console.error("Error checking login status:", error);
      return false;
    }
  },

  /**
   * Get the current user's data
   * @returns {Promise<Object|null>} - The current user's data or null if not logged in
   */
  getCurrentUser: async () => {
    try {
      const userData = await AsyncStorage.getItem("user_data");
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error("Error getting current user:", error);
      return null;
    }
  },

  /**
   * Sign out the current user
   * @returns {Promise<boolean>} - Whether the sign out was successful
   */
  signOut: async () => {
    try {
      // Remove all auth-related items from storage
      await AsyncStorage.multiRemove([
        "auth_token",
        "firebase_token",
        "user_data",
        "phone_auth_number",
        "phone_auth_session",
      ]);
      return true;
    } catch (error) {
      console.error("Error signing out:", error);
      return false;
    }
  },
};

export default expoAuth;
