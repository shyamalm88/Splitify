import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import expoAuth from "../config/expo-firebase";

// Create auth context
export const AuthContext = createContext();

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state from storage
  useEffect(() => {
    const loadStoredAuthState = async () => {
      try {
        // Check if user is logged in using our auth helper
        const isLoggedIn = await expoAuth.isUserLoggedIn();

        if (isLoggedIn) {
          // Get user data
          const userData = await expoAuth.getCurrentUser();
          // Retrieve token from storage
          const authToken = await AsyncStorage.getItem("auth_token");

          if (userData && authToken) {
            setToken(authToken);
            setUser(userData);

            // Set default Authorization header for all axios requests
            axios.defaults.headers.common["Authorization"] =
              `Bearer ${authToken}`;
          }
        }
      } catch (error) {
        console.error("Error loading auth state:", error);
        // Clean up any corrupted state
        await AsyncStorage.multiRemove(["auth_token", "user_data"]);
      } finally {
        setLoading(false);
      }
    };

    loadStoredAuthState();
  }, []);

  // Login function
  const login = async (userData, userToken) => {
    try {
      // Update state
      setUser(userData);
      setToken(userToken);

      // Set default Authorization header
      axios.defaults.headers.common["Authorization"] = `Bearer ${userToken}`;

      // Store the data in AsyncStorage to persist it
      if (userData && userToken) {
        await AsyncStorage.setItem("auth_token", userToken);
        await AsyncStorage.setItem("user_data", JSON.stringify(userData));
      }

      return { success: true };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      // First, clear the auth state to trigger UI update
      setUser(null);
      setToken(null);

      // Remove authorization header
      delete axios.defaults.headers.common["Authorization"];

      // Then perform the actual logout
      await expoAuth.signOut();

      // Clear storage after state is updated
      await AsyncStorage.multiRemove([
        "auth_token",
        "user_data",
        "phone_auth_number",
        "phone_auth_session",
      ]);

      return { success: true };
    } catch (error) {
      console.error("Logout error:", error);
      return { success: false, error };
    }
  };

  // Update user data
  const updateUserData = async (newUserData) => {
    try {
      const updatedUser = { ...user, ...newUserData };
      await AsyncStorage.setItem("user_data", JSON.stringify(updatedUser));
      setUser(updatedUser);
      return { success: true };
    } catch (error) {
      console.error("Update user data error:", error);
      return { success: false, error };
    }
  };

  // Check if user is authenticated - use useCallback to prevent unnecessary re-renders
  const isAuthenticated = useCallback(() => {
    return !!token && !!user;
  }, [token, user]);

  // Context values
  const value = {
    user,
    token,
    loading,
    login,
    logout,
    updateUserData,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
