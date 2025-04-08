export const colors = {
  // Primary Colors
  primary: "#FEBA17",
  primaryLight: "#FED05D",
  primaryDark: "#E5A80F",

  // Secondary Colors
  secondary: "#FEBA17",
  secondaryLight: "#FFE07D",
  secondaryDark: "#DFA600",

  // Accent Colors
  success: "#00BA88",
  warning: "#F4C83E",
  error: "#FF4538",
  info: "#2F80ED",

  // Neutral Colors
  white: "#FFFFFF",
  black: "#000000",
  gray100: "#F9FAFB",
  gray200: "#F4F6F8",
  gray300: "#E5E9ED",
  gray400: "#D4D9DD",
  gray500: "#9AA6B2",
  gray600: "#6D7A8C",
  gray700: "#4A5568",
  gray800: "#2D3748",
  gray900: "#1A202C",

  // Background Colors
  background: "#FFFFFF",
  backgroundAlt: "#F9FAFB",

  // Transparent Colors
  transparentPrimary: "rgba(249, 176, 52, 0.1)",
  transparentSuccess: "rgba(0, 186, 136, 0.1)",
  transparentWarning: "rgba(244, 200, 62, 0.1)",
  transparentError: "rgba(255, 69, 56, 0.1)",
};

export const typography = {
  // Font Families
  fontFamily: {
    regular: "System",
    medium: "System",
    bold: "System",
  },

  // Font Sizes
  fontSize: {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 18,
    "2xl": 20,
    "3xl": 24,
    "4xl": 30,
    "5xl": 36,
    "6xl": 48,
  },

  // Line Heights
  lineHeight: {
    xs: 14,
    sm: 16,
    md: 20,
    lg: 24,
    xl: 28,
    "2xl": 32,
    "3xl": 36,
    "4xl": 40,
    "5xl": 48,
    "6xl": 60,
  },

  // Font Weights
  fontWeight: {
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  "2xl": 40,
  "3xl": 48,
  "4xl": 56,
  "5xl": 64,
  "6xl": 80,
};

export const borderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const shadows = {
  sm: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
};

export const theme = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
};
