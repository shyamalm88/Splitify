import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Image,
  StatusBar,
  ImageBackground,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as Location from "expo-location";
import expoAuth from "../../config/expo-firebase";
import CountryPicker from "../../components/CountryPicker/CountryPicker";
import { countries, getCountryByCode } from "../../config/countries";
import NavigationService from "../../components/NavigationService";
import {
  colors,
  typography,
  spacing,
  shadows,
  borderRadius,
} from "../../theme/theme";

const LoginScreen = () => {
  const navigation = useNavigation();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(
    getCountryByCode("IN")
  ); // Default to India
  const [locationLoading, setLocationLoading] = useState(true);

  // Function to get country from coordinates
  const getCountryFromCoordinates = async (latitude, longitude) => {
    try {
      console.log(`Getting country for coordinates: ${latitude}, ${longitude}`);
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
      );
      const data = await response.json();
      console.log("Geocoding response:", data);

      if (data && data.address && data.address.country_code) {
        const countryCode = data.address.country_code.toUpperCase();
        console.log(`Detected country code: ${countryCode}`);
        return countryCode;
      } else {
        console.log("No country code found in response");
        return null;
      }
    } catch (error) {
      console.error("Error getting country from coordinates:", error);
      return null;
    }
  };

  // Function to set country based on location
  const setCountryFromLocation = async () => {
    try {
      // Request location permissions
      const { status } = await Location.requestForegroundPermissionsAsync();
      console.log(`Location permission status: ${status}`);

      if (status !== "granted") {
        console.log("Location permission denied, defaulting to India");
        setLocationLoading(false);
        return; // Already defaulted to India in initial state
      }

      // Get current location
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      console.log("Location data:", location);
      const { latitude, longitude } = location.coords;

      // Get country code from coordinates
      const countryCode = await getCountryFromCoordinates(latitude, longitude);
      console.log(`Country code from coordinates: ${countryCode}`);

      if (countryCode) {
        // Find country in our list using the getCountryByCode function
        const country = getCountryByCode(countryCode);
        console.log(
          `Found country in list: ${country ? country.name : "No match"}`
        );

        if (country) {
          setSelectedCountry(country);
        }
      }
    } catch (error) {
      console.error("Error getting location:", error);
    } finally {
      setLocationLoading(false);
    }
  };

  // Set country based on location when component mounts
  useEffect(() => {
    setCountryFromLocation();
  }, []);

  const validatePhoneNumber = (phone) => {
    // Simple validation to check if input has at least 10 digits
    const digitsOnly = phone.replace(/\D/g, "");
    return digitsOnly.length >= 10;
  };

  const formatPhoneNumber = (phone) => {
    // Format phone number to E.164 format (for international numbers)
    const digitsOnly = phone.replace(/\D/g, "");
    return `${selectedCountry.phoneCode}${digitsOnly}`;
  };

  const handleLogin = async () => {
    if (!validatePhoneNumber(phoneNumber)) {
      setErrorMessage("Please enter a valid phone number");
      return;
    }

    const formattedPhoneNumber = formatPhoneNumber(phoneNumber);
    setLoading(true);
    setErrorMessage("");

    try {
      const result = await expoAuth.sendOTP(formattedPhoneNumber);

      if (result.success) {
        // Navigate to OTP verification screen using NavigationService
        NavigationService.navigate("OtpVerification", {
          phoneNumber: formattedPhoneNumber,
          sessionInfo: result.sessionInfo,
          inDevMode: result.inDevMode || false,
        });
      } else {
        setErrorMessage(result.error || "Failed to send verification code");
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage("Failed to send verification code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = useCallback(() => {
    // Use NavigationService instead of direct navigation
    NavigationService.navigate("SignUp");
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={colors.primary}
        translucent
      />
      <ImageBackground
        source={{ uri: "https://placehold.co/FEBA17/FFFFFF/png" }}
        style={styles.headerBackground}
        resizeMode="cover"
      >
        <View style={styles.headerContent}>
          <Text style={styles.title}>Splitify</Text>
        </View>
      </ImageBackground>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardContainer}
      >
        <View style={styles.content}>
          <Image
            source={require("../../../assets/icon.png")}
            style={styles.logo}
            resizeMode="contain"
          />

          <Text style={styles.heading}>Welcome Back</Text>
          <Text style={styles.subheading}>Log in with your phone number</Text>

          <View style={styles.formContainer}>
            <Text style={styles.inputLabel}>Phone Number</Text>
            <View style={styles.phoneInputContainer}>
              {locationLoading ? (
                <View style={[styles.selectedCountry, styles.loadingContainer]}>
                  <ActivityIndicator size="small" color={colors.primary} />
                </View>
              ) : (
                <CountryPicker
                  selectedCountry={selectedCountry}
                  onSelect={setSelectedCountry}
                />
              )}
              <TextInput
                style={styles.phoneInput}
                value={phoneNumber}
                onChangeText={(text) => {
                  setPhoneNumber(text);
                  setErrorMessage("");
                }}
                placeholder="(234) 567-8910"
                keyboardType="phone-pad"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            {errorMessage ? (
              <Text style={styles.errorText}>{errorMessage}</Text>
            ) : null}

            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <Text style={styles.buttonText}>Send Verification Code</Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={handleSignUp}>
              <Text style={styles.signupText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray100,
  },
  headerBackground: {
    width: "100%",
    height: 120,
    marginTop: -1, // Fix for Android to ensure no gap at the top
  },
  headerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 40,
  },
  title: {
    fontSize: typography.fontSize["3xl"],
    fontWeight: typography.fontWeight.bold,
    color: colors.white,
  },
  keyboardContainer: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    alignItems: "center",
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: spacing.md,
  },
  heading: {
    fontSize: typography.fontSize["2xl"],
    fontWeight: typography.fontWeight.bold,
    color: colors.gray900,
    marginBottom: spacing.xs,
    textAlign: "center",
  },
  subheading: {
    fontSize: typography.fontSize.md,
    color: colors.gray600,
    marginBottom: spacing.xl,
    textAlign: "center",
  },
  formContainer: {
    width: "100%",
  },
  inputLabel: {
    fontSize: typography.fontSize.md,
    color: colors.gray700,
    marginBottom: spacing.xs,
    fontWeight: typography.fontWeight.medium,
  },
  phoneInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  phoneInput: {
    flex: 1,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.gray300,
    borderRadius: borderRadius.md,
    fontSize: typography.fontSize.lg,
    padding: spacing.md,
  },
  loginButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
    marginTop: spacing.lg,
  },
  buttonText: {
    color: colors.white,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
  },
  errorText: {
    color: colors.error,
    fontSize: typography.fontSize.md,
    marginTop: spacing.sm,
  },
  footer: {
    flexDirection: "row",
    marginTop: spacing.xl,
    alignItems: "center",
  },
  footerText: {
    color: colors.gray600,
    fontSize: typography.fontSize.md,
  },
  signupText: {
    color: colors.primary,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default LoginScreen;
