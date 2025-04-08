import React from "react";
import { StyleSheet } from "react-native";
import { Button as PaperButton } from "react-native-paper";
import { colors } from "../theme/theme";

/**
 * Custom button component that extends react-native-paper Button
 */
const Button = ({
  mode = "contained",
  children,
  style,
  labelStyle,
  onPress,
  ...props
}) => {
  return (
    <PaperButton
      mode={mode}
      onPress={onPress}
      style={[styles.button, style]}
      labelStyle={[styles.label, labelStyle]}
      color={colors.primary}
      {...props}
    >
      {children}
    </PaperButton>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    paddingVertical: 6,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.white,
  },
});

export default Button;
