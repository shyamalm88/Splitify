import React, { useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  TouchableOpacity,
} from "react-native";
import { colors, typography, borderRadius, spacing } from "../../theme/theme";

/**
 * TextField component for user input with support for labels, error messages,
 * icons, and different states.
 */
const TextField = ({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = "default",
  error,
  helperText,
  leftIcon,
  rightIcon,
  onRightIconPress,
  disabled = false,
  multiline = false,
  numberOfLines = 1,
  style,
  inputStyle,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(!secureTextEntry);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text
          style={[
            styles.label,
            error && styles.errorLabel,
            disabled && styles.disabledLabel,
          ]}
        >
          {label}
        </Text>
      )}

      <View
        style={[
          styles.inputContainer,
          isFocused && styles.focusedInput,
          error && styles.errorInput,
          disabled && styles.disabledInput,
        ]}
      >
        {leftIcon && <View style={styles.leftIconContainer}>{leftIcon}</View>}

        <TextInput
          style={[
            styles.input,
            leftIcon && styles.inputWithLeftIcon,
            (rightIcon || secureTextEntry) && styles.inputWithRightIcon,
            multiline && styles.multilineInput,
            disabled && styles.disabledText,
            inputStyle,
          ]}
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          keyboardType={keyboardType}
          onFocus={handleFocus}
          onBlur={handleBlur}
          editable={!disabled}
          multiline={multiline}
          numberOfLines={multiline ? numberOfLines : 1}
          placeholderTextColor={colors.gray500}
          {...props}
        />

        {secureTextEntry && (
          <TouchableOpacity
            style={styles.rightIconContainer}
            onPress={togglePasswordVisibility}
            disabled={disabled}
          >
            <Text style={styles.togglePasswordText}>
              {isPasswordVisible ? "Hide" : "Show"}
            </Text>
          </TouchableOpacity>
        )}

        {rightIcon && !secureTextEntry && (
          <TouchableOpacity
            style={styles.rightIconContainer}
            onPress={onRightIconPress}
            disabled={disabled || !onRightIconPress}
          >
            {rightIcon}
          </TouchableOpacity>
        )}
      </View>

      {(error || helperText) && (
        <Text style={[styles.helperText, error && styles.errorText]}>
          {error || helperText}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
    width: "100%",
  },
  label: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
    color: colors.gray800,
    marginBottom: spacing.xs,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.gray400,
    borderRadius: borderRadius.md,
    backgroundColor: colors.white,
  },
  input: {
    flex: 1,
    height: 48,
    paddingHorizontal: spacing.md,
    fontSize: typography.fontSize.md,
    color: colors.gray900,
  },
  multilineInput: {
    minHeight: 100,
    textAlignVertical: "top",
    paddingTop: spacing.md,
  },
  inputWithLeftIcon: {
    paddingLeft: spacing.xs,
  },
  inputWithRightIcon: {
    paddingRight: spacing.xs,
  },
  leftIconContainer: {
    paddingLeft: spacing.md,
  },
  rightIconContainer: {
    paddingRight: spacing.md,
  },
  togglePasswordText: {
    color: colors.primary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
  },
  focusedInput: {
    borderColor: colors.primary,
  },
  errorInput: {
    borderColor: colors.error,
  },
  errorLabel: {
    color: colors.error,
  },
  errorText: {
    color: colors.error,
  },
  helperText: {
    fontSize: typography.fontSize.sm,
    color: colors.gray600,
    marginTop: spacing.xs,
  },
  disabledInput: {
    backgroundColor: colors.gray200,
    borderColor: colors.gray300,
  },
  disabledLabel: {
    color: colors.gray500,
  },
  disabledText: {
    color: colors.gray500,
  },
});

export default TextField;
