import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { colors, typography, spacing, borderRadius } from "../theme/theme";
import { useNavigation } from "@react-navigation/native";

const ActivityListItem = ({ item, onPress }) => {
  const navigation = useNavigation();

  const handleActionPress = (type) => {
    if (type === "pay") {
      navigation.navigate("Pay");
    } else if (type === "request") {
      navigation.navigate("Request");
    }
  };

  return (
    <TouchableOpacity
      style={styles.activityItem}
      onPress={() => onPress && onPress(item)}
    >
      <View style={styles.activityInfo}>
        {item.relationship === "debt" ? (
          <>
            <Text style={styles.activityName}>YOU</Text>
            <View style={styles.relationshipContainer}>
              <MaterialIcons
                name="arrow-downward"
                size={14}
                color={colors.error}
              />
              <Text style={[styles.relationshipText, styles.debtRelationship]}>
                owe
              </Text>
            </View>
            <Text style={styles.activityName}>
              {item.description.replace("You owe ", "").replace("you owe ", "")}
            </Text>
          </>
        ) : item.relationship === "credit" ? (
          <>
            <Text style={styles.activityName}>
              {item.description.replace(" owes you", "").replace(" owes", "")}
            </Text>
            <View style={styles.relationshipContainer}>
              <MaterialIcons
                name="arrow-upward"
                size={14}
                color={colors.success}
              />
              <Text
                style={[styles.relationshipText, styles.creditRelationship]}
              >
                owes
              </Text>
              <Text style={styles.activityName}>YOU</Text>
            </View>
          </>
        ) : item.relationship === "settled" ? (
          <>
            <Text style={styles.activityName}>
              {item.description.split(" - ")[0]}
            </Text>
            <View style={styles.relationshipContainer}>
              <MaterialIcons
                name="check-circle"
                size={14}
                color={colors.info}
              />
              <Text
                style={[styles.relationshipText, styles.settledRelationship]}
              >
                All settled up
              </Text>
            </View>
          </>
        ) : item.relationship === "thirdParty" ? (
          <>
            <Text style={styles.activityName}>
              {item.description.split(" owes ")[0]}
            </Text>
            <View style={styles.relationshipContainer}>
              <MaterialIcons
                name="arrow-downward"
                size={14}
                color={colors.gray600}
              />
              <Text
                style={[styles.relationshipText, styles.thirdPartyRelationship]}
              >
                owes
              </Text>
            </View>
            <Text style={styles.activityName}>
              {item.description.split(" owes ")[1]}
            </Text>
          </>
        ) : (
          <Text style={styles.activityName}>{item.description}</Text>
        )}

        {item.group && <Text style={styles.activityGroup}>{item.group}</Text>}
      </View>
      <View style={styles.activityAmount}>
        <Text
          style={[
            styles.amountText,
            item.relationship === "credit"
              ? styles.creditAmount
              : item.relationship === "settled"
                ? styles.settledAmount
                : styles.debtAmount,
          ]}
        >
          {item.relationship === "settled"
            ? "$0.00"
            : `$${item.amount.toFixed(2)}`}
        </Text>
        {item.type !== "none" && (
          <TouchableOpacity
            style={[
              styles.actionBtn,
              {
                backgroundColor:
                  item.type === "pay"
                    ? colors.secondary
                    : item.type === "paid"
                      ? colors.info
                      : colors.secondaryLight,
              },
            ]}
            onPress={() => handleActionPress(item.type)}
          >
            <Text
              style={[
                styles.actionBtnText,
                item.type === "paid" && { color: colors.white },
              ]}
            >
              {item.type === "pay"
                ? "Pay"
                : item.type === "paid"
                  ? "Paid"
                  : "Request"}
            </Text>
          </TouchableOpacity>
        )}
        {item.time && <Text style={styles.activityTime}>{item.time}</Text>}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  activityItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  activityInfo: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
  },
  activityName: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
    color: colors.gray900,
  },
  activityGroup: {
    fontSize: typography.fontSize.sm,
    color: colors.gray600,
    marginTop: 2,
    width: "100%",
  },
  activityTime: {
    fontSize: typography.fontSize.xs,
    color: colors.gray500,
    marginTop: 4,
    textAlign: "right",
  },
  activityAmount: {
    alignItems: "flex-end",
  },
  amountText: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    marginBottom: spacing.xs,
  },
  creditAmount: {
    color: colors.success,
  },
  debtAmount: {
    color: colors.error,
  },
  actionBtn: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.full,
    backgroundColor: colors.secondaryLight,
  },
  actionBtnText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
    color: colors.black,
  },
  relationshipContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: spacing.xs / 2,
    marginHorizontal: spacing.xs,
  },
  relationshipText: {
    fontSize: typography.fontSize.sm,
    color: colors.gray600,
    marginHorizontal: spacing.xs / 2,
  },
  debtRelationship: {
    color: colors.error,
    fontWeight: typography.fontWeight.medium,
  },
  creditRelationship: {
    color: colors.success,
    fontWeight: typography.fontWeight.medium,
  },
  settledRelationship: {
    color: colors.info,
    fontWeight: typography.fontWeight.medium,
  },
  thirdPartyRelationship: {
    color: colors.gray600,
    fontWeight: typography.fontWeight.medium,
  },
  settledAmount: {
    color: colors.info,
  },
});

export default ActivityListItem;
