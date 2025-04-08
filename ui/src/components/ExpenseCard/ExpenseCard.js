import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import Card from "../Card";
import Avatar from "../Avatar";
import { colors, typography, spacing } from "../../theme/theme";

/**
 * ExpenseCard component for displaying expense information
 */
const ExpenseCard = ({
  title,
  amount,
  date,
  category,
  participants = [],
  onPress,
  style,
  ...props
}) => {
  // Format the amount to display with currency symbol
  const formattedAmount =
    typeof amount === "number" ? `$${amount.toFixed(2)}` : amount;

  // Format date if it's a Date object
  const formattedDate =
    date instanceof Date
      ? date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
      : date;

  return (
    <Card
      variant="elevated"
      onPress={onPress}
      style={[styles.container, style]}
      {...props}
    >
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          <Text style={styles.date}>{formattedDate}</Text>
        </View>
        <Text style={styles.amount}>{formattedAmount}</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.footer}>
        <View style={styles.categoryContainer}>
          {category?.icon}
          <Text style={styles.category}>
            {category?.name || "Uncategorized"}
          </Text>
        </View>

        <View style={styles.participantsContainer}>
          {participants.slice(0, 3).map((participant, index) => (
            <View
              key={index}
              style={[styles.avatarContainer, { zIndex: 10 - index }]}
            >
              <Avatar
                source={participant.image}
                name={participant.name}
                size="small"
              />
            </View>
          ))}

          {participants.length > 3 && (
            <View style={styles.moreContainer}>
              <Text style={styles.moreText}>+{participants.length - 3}</Text>
            </View>
          )}
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  titleContainer: {
    flex: 1,
    marginRight: spacing.md,
  },
  title: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.gray900,
    marginBottom: spacing.xs / 2,
  },
  date: {
    fontSize: typography.fontSize.sm,
    color: colors.gray600,
  },
  amount: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.gray300,
    marginVertical: spacing.md,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  categoryContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  category: {
    fontSize: typography.fontSize.sm,
    color: colors.gray700,
    marginLeft: spacing.xs,
  },
  participantsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarContainer: {
    marginLeft: -spacing.xs,
  },
  moreContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.gray300,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: spacing.xs,
  },
  moreText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    color: colors.gray700,
  },
});

export default ExpenseCard;
