import React from "react";
import { StyleSheet, View, Text, ScrollView } from "react-native";
import { colors, typography, spacing, borderRadius } from "../theme/theme";
import ActivityListItem from "./ActivityListItem";

const ActivityList = ({
  data,
  onItemPress,
  maxItems = null,
  maxDates = null,
  containerStyle,
}) => {
  // Get unique dates from activity data
  const getUniqueDates = () => {
    const dates = data.map((item) => item.date);
    return [...new Set(dates)];
  };

  // Get all unique dates, potentially limited by maxDates
  const uniqueDates = maxDates
    ? getUniqueDates().slice(0, maxDates)
    : getUniqueDates();

  return (
    <ScrollView
      style={[styles.container, containerStyle]}
      showsVerticalScrollIndicator={false}
    >
      {/* Check if there's any data */}
      {data.length === 0 ? (
        <View style={styles.noResultsContainer}>
          <Text style={styles.noResultsText}>No transactions found</Text>
        </View>
      ) : (
        // Group activities by date
        uniqueDates.map((date) => (
          <View key={date}>
            {/* Date Header */}
            <View style={styles.dateHeaderContainer}>
              <Text style={styles.dateHeader}>{date}</Text>
            </View>

            {/* Activity Items for this date */}
            {(maxItems
              ? data.filter((item) => item.date === date).slice(0, maxItems)
              : data.filter((item) => item.date === date)
            ).map((item) => (
              <ActivityListItem
                key={item.id}
                item={item}
                onPress={onItemPress}
              />
            ))}
          </View>
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  dateHeaderContainer: {
    backgroundColor: colors.gray100,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.sm,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  dateHeader: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.gray700,
  },
  noResultsContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.xl * 2,
  },
  noResultsText: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.medium,
    color: colors.gray800,
  },
});

export default ActivityList;
