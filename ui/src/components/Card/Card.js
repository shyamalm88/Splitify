import React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { colors, borderRadius, shadows, spacing } from "../../theme/theme";

/**
 * Card component for wrapping content in a card-like container
 */
const Card = ({
  children,
  variant = "elevated",
  onPress,
  style,
  contentStyle,
  ...props
}) => {
  const getCardStyle = () => {
    switch (variant) {
      case "elevated":
        return [styles.card, styles.elevatedCard];
      case "outlined":
        return [styles.card, styles.outlinedCard];
      case "flat":
        return [styles.card, styles.flatCard];
      default:
        return [styles.card, styles.elevatedCard];
    }
  };

  const Wrapper = onPress ? TouchableOpacity : View;

  return (
    <Wrapper
      style={[getCardStyle(), style]}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      {...props}
    >
      <View style={[styles.contentContainer, contentStyle]}>{children}</View>
    </Wrapper>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.lg,
    overflow: "hidden",
    backgroundColor: colors.white,
  },
  elevatedCard: {
    ...shadows.md,
  },
  outlinedCard: {
    borderWidth: 1,
    borderColor: colors.gray300,
  },
  flatCard: {
    backgroundColor: colors.gray100,
  },
  contentContainer: {
    padding: spacing.md,
  },
});

export default Card;
