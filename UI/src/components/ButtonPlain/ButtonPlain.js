import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { colors } from "../../theme/theme";

/**
 * A simplified button component for debugging text visibility issues
 */
const ButtonPlain = ({
  title,
  onPress,
  style,
  textStyle,
  fullWidth,
  ...props
}) => {
  return (
    <TouchableOpacity
      style={[styles.button, fullWidth && styles.fullWidth, style]}
      onPress={onPress}
      {...props}
    >
      <Text style={[styles.text, textStyle]}>
        {title ? title.toString() : "ButtonPlain"}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary, // Using theme color
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 8,
  },
  fullWidth: {
    width: "100%",
  },
  text: {
    color: colors.white, // Using theme color
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ButtonPlain;
