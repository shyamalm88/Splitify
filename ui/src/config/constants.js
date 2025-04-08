// API URL configuration
// Set the base API URL based on the environment
const DEV_API_URL = "http://localhost:5001/api";
const PROD_API_URL = "https://splitify-api.example.com/api";

// Use environment variable to determine which URL to use
// For Expo, we can access the releaseChannel to determine environment
import { Platform } from "react-native";

// Use IP address that works for both emulators and physical devices
export const API_URL = __DEV__
  ? Platform.OS === "android"
    ? "http://10.0.2.2:5001/api" // Use special IP for Android emulator
    : Platform.OS === "ios"
      ? "http://localhost:5001/api" // Use localhost for iOS simulator
      : "http://localhost:5001/api" // Default for web
  : "https://splitify-api.yourdomain.com/api"; // Production API URL

// IF YOU'RE TESTING ON A PHYSICAL DEVICE, uncomment and use this instead:
// export const API_URL = __DEV__
//   ? Platform.OS === "android" || Platform.OS === "ios"
//     ? "http://192.168.1.2:5001/api" // Use your computer's actual IP address
//     : "http://localhost:5001/api"
//   : "https://splitify-api.yourdomain.com/api";

// Other app constants
export const APP_NAME = "Splitify";
export const SUPPORT_EMAIL = "support@splitify.example.com";

// Authentication constants
export const ACCESS_TOKEN_KEY = "accessToken";
export const REFRESH_TOKEN_KEY = "refreshToken";
export const USER_DATA_KEY = "userData";

// OTP configuration
export const OTP_RESEND_DELAY = 60; // seconds
export const OTP_LENGTH = 6;

// Regex patterns
export const PHONE_REGEX = /^\+[0-9]{10,15}$/; // E.164 format (+1234567890)
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
