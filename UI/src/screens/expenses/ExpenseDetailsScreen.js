import React from "react";
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Header, Button, Avatar, Card } from "../../components";
import {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
} from "../../theme/theme";

const ExpenseDetailsScreen = ({ route, navigation }) => {
  // In a real app, you would fetch the expense details using the expenseId
  const { expenseId } = route.params || {};

  // Mock expense data
  const expense = {
    id: expenseId || "1",
    title: "Dinner at Italian Restaurant",
    amount: 120.5,
    date: new Date("2023-10-15"),
    category: { name: "Food & Drink", icon: "🍔" },
    paidBy: "John Doe",
    note: "Team dinner after project completion",
    participants: [
      { id: "1", name: "John Doe", amount: 45.5, isPaid: true },
      { id: "2", name: "Jane Smith", amount: 25.0, isPaid: false },
      { id: "3", name: "Mike Johnson", amount: 25.0, isPaid: false },
      { id: "4", name: "Sarah Williams", amount: 25.0, isPaid: true },
    ],
  };

  const formattedDate = expense.date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const formattedTime = expense.date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const handleEdit = () => {
    navigation.navigate("EditExpense", { expenseId: expense.id });
  };

  const handleDelete = () => {
    // Delete expense logic
    navigation.goBack();
  };

  const handleRemind = (participantId) => {
    // Send reminder logic
    console.log(`Reminder sent to participant ${participantId}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Expense Details"
        leftIcon={<Text style={styles.backButton}>←</Text>}
        onLeftPress={() => navigation.goBack()}
        rightIcon={<Text style={styles.moreButton}>•••</Text>}
        onRightPress={() => {
          /* Show options menu */
        }}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{expense.title}</Text>
            <View style={styles.categoryContainer}>
              <Text style={styles.categoryIcon}>{expense.category.icon}</Text>
              <Text style={styles.categoryName}>{expense.category.name}</Text>
            </View>
          </View>

          <View style={styles.amountContainer}>
            <Text style={styles.amountLabel}>Total</Text>
            <Text style={styles.amount}>${expense.amount.toFixed(2)}</Text>
          </View>
        </View>

        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Date</Text>
            <Text style={styles.detailValue}>{formattedDate}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Time</Text>
            <Text style={styles.detailValue}>{formattedTime}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Paid by</Text>
            <View style={styles.paidByContainer}>
              <Avatar name={expense.paidBy} size="small" />
              <Text style={styles.detailValue}>{expense.paidBy}</Text>
            </View>
          </View>

          {expense.note && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Note</Text>
              <Text style={styles.detailValue}>{expense.note}</Text>
            </View>
          )}
        </View>

        <View style={styles.participantsContainer}>
          <Text style={styles.sectionTitle}>Participants</Text>

          {expense.participants.map((participant) => (
            <Card
              key={participant.id}
              variant="outlined"
              style={styles.participantCard}
              contentStyle={styles.participantCardContent}
            >
              <View style={styles.participantInfo}>
                <Avatar name={participant.name} size="small" />
                <View style={styles.participantDetails}>
                  <Text style={styles.participantName}>{participant.name}</Text>
                  <Text
                    style={[
                      styles.participantStatus,
                      {
                        color: participant.isPaid
                          ? colors.success
                          : colors.error,
                      },
                    ]}
                  >
                    {participant.isPaid ? "Paid" : "Unpaid"}
                  </Text>
                </View>
              </View>

              <View style={styles.participantAmount}>
                <Text style={styles.participantAmountValue}>
                  ${participant.amount.toFixed(2)}
                </Text>

                {!participant.isPaid && (
                  <TouchableOpacity
                    style={styles.remindButton}
                    onPress={() => handleRemind(participant.id)}
                  >
                    <Text style={styles.remindButtonText}>Remind</Text>
                  </TouchableOpacity>
                )}
              </View>
            </Card>
          ))}
        </View>

        <View style={styles.actionsContainer}>
          <Button
            title="Edit Expense"
            onPress={handleEdit}
            size="large"
            fullWidth
            style={styles.editButton}
          />

          <Button
            title="Delete Expense"
            onPress={handleDelete}
            variant="outlined"
            size="large"
            fullWidth
            style={styles.deleteButton}
            textStyle={{ color: colors.error }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  backButton: {
    fontSize: 24,
    color: colors.gray800,
  },
  moreButton: {
    fontSize: 18,
    color: colors.gray800,
    transform: [{ rotate: "90deg" }],
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xl * 2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: spacing.xl,
  },
  titleContainer: {
    flex: 1,
    marginRight: spacing.md,
  },
  title: {
    fontSize: typography.fontSize["2xl"],
    fontWeight: typography.fontWeight.bold,
    color: colors.gray900,
    marginBottom: spacing.xs,
  },
  categoryContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  categoryIcon: {
    fontSize: typography.fontSize.lg,
    marginRight: spacing.xs,
  },
  categoryName: {
    fontSize: typography.fontSize.md,
    color: colors.gray700,
  },
  amountContainer: {
    alignItems: "flex-end",
  },
  amountLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.gray600,
    marginBottom: spacing.xs / 2,
  },
  amount: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
  },
  detailsContainer: {
    backgroundColor: colors.gray100,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.xl,
  },
  detailRow: {
    marginBottom: spacing.md,
  },
  detailLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.gray600,
    marginBottom: spacing.xs / 2,
  },
  detailValue: {
    fontSize: typography.fontSize.md,
    color: colors.gray800,
  },
  paidByContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  participantsContainer: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.gray900,
    marginBottom: spacing.md,
  },
  participantCard: {
    marginBottom: spacing.md,
  },
  participantCardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: spacing.md,
  },
  participantInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  participantDetails: {
    marginLeft: spacing.md,
  },
  participantName: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
    color: colors.gray800,
    marginBottom: spacing.xs / 2,
  },
  participantStatus: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
  },
  participantAmount: {
    alignItems: "flex-end",
  },
  participantAmountValue: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.gray900,
    marginBottom: spacing.xs,
  },
  remindButton: {
    backgroundColor: colors.transparentPrimary,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs / 2,
  },
  remindButtonText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
    color: colors.primary,
  },
  actionsContainer: {
    marginBottom: spacing.xl,
  },
  editButton: {
    marginBottom: spacing.md,
  },
  deleteButton: {
    borderColor: colors.error,
  },
});

export default ExpenseDetailsScreen;
