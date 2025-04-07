import React from "react";
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  View,
} from "react-native";
import { colors, typography, borderRadius, spacing } from "../../theme/theme";

/**
 * Button component with variants: primary, secondary, outlined, text
 */
const Button = ({
  title,
  onPress,
  variant = "primary",
  size = "medium",
  fullWidth = false,
  disabled = false,
  loading = false,
  leftIcon,
  rightIcon,
  style,
  textStyle,
  ...props
}) => {
  // For debugging
  console.log(
    `Rendering button with title: "${title}" and variant: ${variant}`
  );

  // Determine basic text styles based on variant
  let textColor;
  switch (variant) {
    case "primary":
      textColor = colors.white;
      break;
    case "secondary":
      textColor = colors.gray900;
      break;
    case "outlined":
    case "text":
      textColor = colors.primary;
      break;
    default:
      textColor = colors.white;
  }

  // Determine text size based on button size
  let fontSize;
  switch (size) {
    case "small":
      fontSize = typography.fontSize.sm;
      break;
    case "medium":
      fontSize = typography.fontSize.md;
      break;
    case "large":
      fontSize = typography.fontSize.lg;
      break;
    default:
      fontSize = typography.fontSize.md;
  }

  // Apply button styling
  const buttonStyle = [
    styles.button,
    variant === "primary" && styles.primaryButton,
    variant === "secondary" && styles.secondaryButton,
    variant === "outlined" && styles.outlinedButton,
    variant === "text" && styles.textButton,
    size === "small" && styles.smallButton,
    size === "medium" && styles.mediumButton,
    size === "large" && styles.largeButton,
    fullWidth && styles.fullWidth,
    disabled && styles.disabledButton,
    style,
  ];

  // Combine text styles directly to avoid issues with array styling
  const finalTextStyle = {
    textAlign: "center",
    fontWeight: typography.fontWeight.semibold,
    color: disabled ? colors.gray600 : textColor,
    fontSize: fontSize,
    ...textStyle,
  };

  console.log("Button text styles:", JSON.stringify(finalTextStyle.color));

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={buttonStyle}
      activeOpacity={0.8}
      {...props}
    >
      <View style={styles.contentContainer}>
        {leftIcon && !loading && (
          <View style={styles.leftIcon}>{leftIcon}</View>
        )}

        {loading ? (
          <ActivityIndicator
            size="small"
            color={variant === "primary" ? colors.white : colors.primary}
          />
        ) : (
          <Text style={finalTextStyle}>{title || "Button"}</Text>
        )}

        {rightIcon && !loading && (
          <View style={styles.rightIcon}>{rightIcon}</View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: borderRadius.md,
    justifyContent: "center",
    alignItems: "center",
  },
  contentContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  // Variant Styles
  primaryButton: {
    backgroundColor: colors.primary,
  },

  secondaryButton: {
    backgroundColor: colors.secondary,
  },

  outlinedButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: colors.primary,
  },

  textButton: {
    backgroundColor: "transparent",
    paddingHorizontal: 0,
  },

  // Size Styles
  smallButton: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
  },

  mediumButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
  },

  largeButton: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
  },

  // Other Styles
  fullWidth: {
    width: "100%",
  },

  disabledButton: {
    backgroundColor: colors.gray300,
    borderColor: colors.gray300,
  },

  leftIcon: {
    marginRight: spacing.xs,
  },

  rightIcon: {
    marginLeft: spacing.xs,
  },
});

export default Button;
