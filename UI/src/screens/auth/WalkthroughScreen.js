import React, { useState, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  FlatList,
  SafeAreaView,
} from "react-native";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { colors, typography, spacing, borderRadius } from "../../theme/theme";

const { width, height } = Dimensions.get("window");

// Walkthrough data for the slides
const walkthroughData = [
  {
    id: "1",
    title: "Seamless Payments,\nEffortless Splits",
    description:
      "With Splitify, managing your expenses is as easy as a tap. Your wallet is your gateway to hassle-free payments and smooth bill splits.",
    image: "https://placehold.co/600x600/FEBA17/FFFFFF/png",
  },
  {
    id: "2",
    title: "Share Bills, Share\nMoments",
    description:
      "Create a bill-sharing group with your friends, and Splitify will handle the rest. Stay organized and enjoy every moment together!",
    image: "https://placehold.co/600x600/FEBA17/FFFFFF/png",
  },
  {
    id: "3",
    title: "Stay Connected, Split\nConfidently",
    description:
      "Easily manage your Splitify friends. Add, remove, and stay in the loop with who you're splitting with.",
    image: "https://placehold.co/600x600/FEBA17/FFFFFF/png",
  },
  {
    id: "4",
    title: "Let's Get Started!",
    description:
      "With Splitify, expenses split bills is easier than ever before.",
    image: "https://placehold.co/600x600/FFFFFF/FEBA17/png",
    isLogin: true,
  },
];

const WalkthroughScreen = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);

  // Handle slide change
  const handleSlideChange = (index) => {
    setCurrentIndex(index);
  };

  // Go to next slide
  const goToNextSlide = () => {
    if (currentIndex < walkthroughData.length - 1) {
      flatListRef.current.scrollToIndex({ index: currentIndex + 1 });
      setCurrentIndex(currentIndex + 1);
    }
  };

  // Skip to login
  const skipToLogin = () => {
    navigation.replace("Login");
  };

  // Continue with social login
  const handleSocialLogin = (provider) => {
    console.log(`Login with ${provider}`);
    // In a real app, implement the social login logic here
    navigation.replace("Login");
  };

  // Render individual slide
  const renderSlide = ({ item, index }) => {
    if (item.isLogin) {
      // Login slide with social buttons
      return (
        <View style={styles.slideContainer}>
          <View style={styles.logoContainer}>
            <View style={styles.logo}>
              <Text style={styles.logoText}>S</Text>
            </View>
          </View>

          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>

          <View style={styles.socialButtonsContainer}>
            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => handleSocialLogin("Google")}
            >
              <Ionicons name="logo-google" size={24} color={colors.gray800} />
              <Text style={styles.socialButtonText}>Continue with Google</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => handleSocialLogin("Facebook")}
            >
              <Ionicons name="logo-facebook" size={24} color={colors.gray800} />
              <Text style={styles.socialButtonText}>
                Continue with Facebook
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.signUpButton}
            onPress={() => navigation.replace("SignUp")}
          >
            <Text style={styles.signUpButtonText}>Sign up</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => navigation.replace("Login")}
          >
            <Text style={styles.loginButtonText}>Log in</Text>
          </TouchableOpacity>

          <View style={styles.termsContainer}>
            <Text style={styles.termsText}>Privacy Policy</Text>
            <View style={styles.separator} />
            <Text style={styles.termsText}>Terms of Service</Text>
          </View>
        </View>
      );
    }

    // Regular walkthrough slide
    return (
      <View style={styles.slideContainer}>
        <Image
          source={{ uri: item.image }}
          style={styles.slideImage}
          resizeMode="cover"
        />
        <View style={styles.textContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={walkthroughData}
        renderItem={renderSlide}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / width);
          handleSlideChange(index);
        }}
      />

      {/* Bottom controls */}
      <View style={styles.bottomContainer}>
        {currentIndex < walkthroughData.length - 1 ? (
          <>
            {/* Pagination dots */}
            <View style={styles.pagination}>
              {walkthroughData.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.paginationDot,
                    index === currentIndex && styles.paginationDotActive,
                  ]}
                />
              ))}
            </View>

            {/* Control buttons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.skipButton} onPress={skipToLogin}>
                <Text style={styles.skipButtonText}>Skip</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.continueButton}
                onPress={goToNextSlide}
              >
                <Text style={styles.continueButtonText}>Continue</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : null}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  slideContainer: {
    width,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  slideImage: {
    width,
    height: height * 0.6,
    marginBottom: spacing.xl,
  },
  textContainer: {
    paddingHorizontal: spacing.xl,
    alignItems: "center",
  },
  title: {
    fontSize: typography.fontSize["2xl"],
    fontWeight: typography.fontWeight.bold,
    color: colors.gray900,
    textAlign: "center",
    marginBottom: spacing.md,
  },
  description: {
    fontSize: typography.fontSize.md,
    color: colors.gray600,
    textAlign: "center",
    marginHorizontal: spacing.xl,
  },
  bottomContainer: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: spacing.xl,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.gray300,
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: colors.primary,
    width: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  skipButton: {
    paddingVertical: spacing.md,
  },
  skipButtonText: {
    fontSize: typography.fontSize.md,
    color: colors.gray600,
    fontWeight: typography.fontWeight.medium,
  },
  continueButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.full,
  },
  continueButtonText: {
    fontSize: typography.fontSize.md,
    color: colors.white,
    fontWeight: typography.fontWeight.medium,
  },
  logoContainer: {
    marginBottom: spacing.xl * 2,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  logoText: {
    fontSize: typography.fontSize["2xl"],
    fontWeight: typography.fontWeight.bold,
    color: colors.white,
  },
  socialButtonsContainer: {
    width: "100%",
    paddingHorizontal: spacing.xl,
    marginTop: spacing.xl,
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.gray300,
  },
  socialButtonText: {
    fontSize: typography.fontSize.md,
    color: colors.gray800,
    marginLeft: spacing.md,
    fontWeight: typography.fontWeight.medium,
  },
  signUpButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.full,
    width: "80%",
    alignItems: "center",
    marginTop: spacing.xl,
  },
  signUpButtonText: {
    fontSize: typography.fontSize.md,
    color: colors.white,
    fontWeight: typography.fontWeight.medium,
  },
  loginButton: {
    borderWidth: 1,
    borderColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.full,
    width: "80%",
    alignItems: "center",
    marginTop: spacing.md,
  },
  loginButtonText: {
    fontSize: typography.fontSize.md,
    color: colors.primary,
    fontWeight: typography.fontWeight.medium,
  },
  termsContainer: {
    flexDirection: "row",
    marginTop: spacing.xl,
    alignItems: "center",
  },
  termsText: {
    fontSize: typography.fontSize.sm,
    color: colors.gray600,
  },
  separator: {
    width: 1,
    height: 16,
    backgroundColor: colors.gray400,
    marginHorizontal: spacing.sm,
  },
});

export default WalkthroughScreen;
