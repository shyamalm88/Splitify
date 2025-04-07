import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

// Initialize WebBrowser for auth redirect
WebBrowser.maybeCompleteAuthSession();

// Your Firebase API endpoint
const API_URL = "https://your-backend-api.com"; // Replace with your backend URL

// Auth helper for Expo apps
const expoAuth = {
  // Send OTP code to phone number
  sendOTP: async (phoneNumber) => {
    try {
      // Format phone number
      const formattedPhone = phoneNumber.startsWith("+")
        ? phoneNumber
        : `+${phoneNumber}`;

      // Call your backend API to send OTP
      const response = await axios.post(`${API_URL}/auth/send-otp`, {
        phoneNumber: formattedPhone,
      });

      if (response.data.success) {
        // Store phone number for verification
        await AsyncStorage.setItem("verifyPhone", formattedPhone);

        return {
          success: true,
          sessionInfo: response.data.sessionInfo,
        };
      } else {
        throw new Error(response.data.message || "Failed to send OTP");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      return {
        success: false,
        error:
          error.response?.data?.message ||
          error.message ||
          "Failed to send OTP",
      };
    }
  },

  // Verify OTP code
  verifyOTP: async (code, sessionInfo) => {
    try {
      // Get phone number from storage
      const phoneNumber = await AsyncStorage.getItem("verifyPhone");

      if (!phoneNumber) {
        throw new Error("Phone number not found");
      }

      // Call your backend API to verify OTP
      const response = await axios.post(`${API_URL}/auth/verify-otp`, {
        phoneNumber,
        code,
        sessionInfo,
      });

      if (response.data.success) {
        // Store auth token
        await AsyncStorage.setItem("authToken", response.data.token);

        return {
          success: true,
          user: response.data.user,
          token: response.data.token,
        };
      } else {
        throw new Error(response.data.message || "Invalid OTP");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      return {
        success: false,
        error:
          error.response?.data?.message ||
          error.message ||
          "Failed to verify OTP",
      };
    }
  },

  // Check if user is logged in
  isUserLoggedIn: async () => {
    const token = await AsyncStorage.getItem("authToken");
    return !!token;
  },

  // Get current user data
  getCurrentUser: async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");

      if (!token) {
        return null;
      }

      const response = await axios.get(`${API_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data.user;
    } catch (error) {
      console.error("Error getting user data:", error);
      return null;
    }
  },

  // Sign out
  signOut: async () => {
    try {
      await AsyncStorage.removeItem("authToken");
      await AsyncStorage.removeItem("verifyPhone");

      return { success: true };
    } catch (error) {
      console.error("Error signing out:", error);
      return {
        success: false,
        error: error.message || "Failed to sign out",
      };
    }
  },
};

export { expoAuth };
