import React from "react";
import { StyleSheet, View, Image, Text } from "react-native";
import { colors, typography, borderRadius } from "../../theme/theme";

/**
 * Avatar component for displaying user profile pictures or initials
 */
const Avatar = ({
  source,
  name = "",
  size = "medium",
  variant = "circle",
  style,
  ...props
}) => {
  // Get initials from name
  const getInitials = () => {
    if (!name) return "";

    const nameParts = name.split(" ").filter((part) => part.length > 0);
    if (nameParts.length === 0) return "";

    if (nameParts.length === 1) {
      return nameParts[0].charAt(0).toUpperCase();
    }

    return (
      nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)
    ).toUpperCase();
  };

  // Get size dimensions based on size prop
  const getDimensions = () => {
    switch (size) {
      case "small":
        return { width: 32, height: 32, fontSize: typography.fontSize.sm };
      case "medium":
        return { width: 48, height: 48, fontSize: typography.fontSize.lg };
      case "large":
        return { width: 64, height: 64, fontSize: typography.fontSize.xl };
      case "xlarge":
        return { width: 96, height: 96, fontSize: typography.fontSize["3xl"] };
      default:
        return { width: 48, height: 48, fontSize: typography.fontSize.lg };
    }
  };

  // Get border radius based on variant
  const getBorderRadius = () => {
    const { width } = getDimensions();

    switch (variant) {
      case "circle":
        return width / 2;
      case "rounded":
        return borderRadius.md;
      case "square":
        return 0;
      default:
        return width / 2;
    }
  };

  const dimensions = getDimensions();
  const borderRadiusValue = getBorderRadius();
  const initials = getInitials();

  return (
    <View
      style={[
        styles.container,
        {
          width: dimensions.width,
          height: dimensions.height,
          borderRadius: borderRadiusValue,
        },
        style,
      ]}
      {...props}
    >
      {source ? (
        <Image
          source={source}
          style={[
            styles.image,
            {
              width: dimensions.width,
              height: dimensions.height,
              borderRadius: borderRadiusValue,
            },
          ]}
          resizeMode="cover"
        />
      ) : (
        <Text style={[styles.initialsText, { fontSize: dimensions.fontSize }]}>
          {initials}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  initialsText: {
    color: colors.white,
    fontWeight: typography.fontWeight.semibold,
  },
});

export default Avatar;
