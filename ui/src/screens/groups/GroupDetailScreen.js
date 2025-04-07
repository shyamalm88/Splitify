import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { colors, typography, spacing, borderRadius } from "../../theme/theme";

const GroupDetailScreen = ({ navigation, route }) => {
  const { groupId } = route.params;
  const [activeTab, setActiveTab] = useState("expenses");
  const [group, setGroup] = useState(null);

  // Mock data for the group based on the groupId
  useEffect(() => {
    // In a real app, this would be a fetch from an API or Redux store
    const mockGroup = {
      id: "1",
      name: "Trip to Japan 🇯🇵",
      description: "Vacationing with college friends in Japan",
      currency: "USD",
      totalExpenses: "$2,348.60",
      balanceTotal: "$5,739.23",
      totalGroupSpending: "$3,648.50",
      totalPaid: "$1,759.25",
      yourTotalShare: "$608.08",
      image: null,
      members: [
        {
          id: "1",
          name: "Andrew Ainsley (You)",
          email: "andrew@example.com",
          balance: "+$442.50",
          avatarColor: "#FFD6A5", // Peach
          icon: "person",
          owes: [
            { id: "3", name: "Darren Kulikowski", amount: "$728.50" },
            { id: "4", name: "Charlotte Hanlin", amount: "$586.50" },
          ],
        },
        {
          id: "2",
          name: "Charlotte Hanlin",
          email: "charlotte.hanlin@gmail.com",
          balance: "-$728.50",
          avatarColor: "#FFC6FF", // Light pink
          icon: "face",
        },
        {
          id: "3",
          name: "Darren Kulikowski",
          email: "darren.kulikowski@gmail.com",
          balance: "-$586.50",
          avatarColor: "#A0C4FF", // Light blue
          icon: "person",
        },
        {
          id: "4",
          name: "Kristin Watson",
          email: "kristin.watson@gmail.com",
          balance: "+$586.50",
          avatarColor: "#CAFFBF", // Light green
          icon: "face",
        },
        {
          id: "5",
          name: "Joseph Thomas",
          email: "joseph.thomas@gmail.com",
          balance: "+$728.50",
          avatarColor: "#BDB2FF", // Light purple
          icon: "person",
        },
        {
          id: "6",
          name: "Maryland Winkles",
          email: "maryland.winkles@gmail.com",
          balance: "-$442.50",
          avatarColor: "#9BF6FF", // Light cyan
          icon: "face",
          owes: [{ id: "1", name: "Andrew Ainsley (You)", amount: "$642.50" }],
        },
      ],
      expenses: [
        {
          id: "1",
          title: "Transportation Costs",
          amount: "$354.20",
          date: "May 15, 2023",
          paidBy: "Andrew Ainsley (You)",
          category: "Transportation",
        },
        {
          id: "2",
          title: "Sushi Eating Expenditures",
          amount: "$85.35",
          date: "May 16, 2023",
          paidBy: "Charlotte Hanlin",
          category: "Food",
        },
        {
          id: "3",
          title: "Tour to Tokyo Tower",
          amount: "$128.50",
          date: "May 17, 2023",
          paidBy: "Kevin Wilson",
          category: "Activity",
        },
        {
          id: "4",
          title: "Shopping for Fashion Items",
          amount: "$245.75",
          date: "May 18, 2023",
          paidBy: "Darren Kahminski",
          category: "Shopping",
        },
        {
          id: "5",
          title: "Buying Japanese Groceries",
          amount: "$52.40",
          date: "May 19, 2023",
          paidBy: "Joseph Thames",
          category: "Groceries",
        },
        {
          id: "6",
          title: "Cost of Staying at Hotel",
          amount: "$953.25",
          date: "May 20, 2023",
          paidBy: "Andrew Ainsley (You)",
          category: "Accommodation",
        },
        {
          id: "7",
          title: "Supermarket Shopping",
          amount: "$76.50",
          date: "May 21, 2023",
          paidBy: "Charlotte Hanlin",
          category: "Groceries",
        },
        {
          id: "8",
          title: "Airline Ticket Cost",
          amount: "$452.65",
          date: "May 22, 2023",
          paidBy: "Kevin Wilson",
          category: "Transportation",
        },
      ],
    };

    setGroup(mockGroup);
  }, [groupId]);

  if (!group) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const renderExpenseItem = ({ item }) => (
    <TouchableOpacity
      style={styles.expenseItem}
      onPress={() =>
        navigation.navigate("ExpenseDetails", { expenseId: item.id, groupId })
      }
    >
      <View style={styles.expenseLeft}>
        <View style={styles.categoryIcon}>
          {getCategoryIcon(item.category)}
        </View>
        <View style={styles.expenseInfo}>
          <Text style={styles.expenseTitle}>{item.title}</Text>
          <Text style={styles.expensePaidBy}>Paid by {item.paidBy}</Text>
        </View>
      </View>
      <View style={styles.expenseRight}>
        <Text style={styles.expenseAmount}>{item.amount}</Text>
        <Text style={styles.expenseDate}>{item.date}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderMemberItem = ({ item }) => (
    <View style={styles.memberItem}>
      <View style={styles.memberLeft}>
        <View
          style={[
            styles.memberAvatar,
            { backgroundColor: item.avatarColor || colors.gray200 },
          ]}
        >
          <MaterialIcons
            name={item.icon || "person"}
            size={20}
            color={colors.gray800}
          />
        </View>
        <Text style={styles.memberName}>{item.name}</Text>
      </View>
      <View style={styles.memberRight}>
        <Text
          style={[
            styles.memberBalance,
            item.balance.includes("+")
              ? styles.positiveBalance
              : item.balance === "$0.00"
                ? styles.neutralBalance
                : styles.negativeBalance,
          ]}
        >
          {item.balance}
        </Text>
      </View>
    </View>
  );

  const renderBalanceItem = ({ item }) => (
    <TouchableOpacity
      style={styles.balanceItem}
      onPress={() => {
        if (item.balance.includes("-")) {
          // Do nothing or show a message that you don't owe this person
        } else if (item.name.includes("(You)")) {
          // Show a modal or navigate to collect payments screen
        } else {
          // Navigate to request payment
          navigation.navigate("RequestPayment", {
            memberId: item.id,
            memberName: item.name,
            amount: item.balance.replace("+", ""),
          });
        }
      }}
    >
      <View style={styles.balanceItemMain}>
        <View style={styles.memberLeft}>
          <View
            style={[
              styles.memberAvatar,
              { backgroundColor: item.avatarColor || colors.gray200 },
            ]}
          >
            <MaterialIcons
              name={item.icon || "person"}
              size={20}
              color={colors.gray800}
            />
          </View>
          <Text style={styles.memberName}>{item.name}</Text>
        </View>
        <Text
          style={[
            styles.memberBalance,
            item.balance.includes("+")
              ? styles.positiveBalance
              : item.balance === "$0.00"
                ? styles.neutralBalance
                : styles.negativeBalance,
          ]}
        >
          {item.balance}
        </Text>
      </View>
      {item.balance.includes("+") && !item.name.includes("(You)") && (
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={styles.requestButton}
            onPress={() => {
              navigation.navigate("RequestPayment", {
                memberId: item.id,
                memberName: item.name,
                amount: item.balance.replace("+", ""),
              });
            }}
          >
            <View style={styles.requestIconContainer}>
              <MaterialIcons
                name="account-balance-wallet"
                size={16}
                color={colors.black}
              />
            </View>
            <Text style={styles.requestButtonText}>Request</Text>
          </TouchableOpacity>
        </View>
      )}
      {item.name.includes("(You)") && item.owes && (
        <View style={styles.detailsList}>
          {item.owes.map((owed) => (
            <View key={owed.id} style={styles.oweDetail}>
              <Text style={styles.oweDetailText}>
                {owed.name}: {owed.amount}
              </Text>
            </View>
          ))}
        </View>
      )}
    </TouchableOpacity>
  );

  const getCategoryIcon = (category) => {
    const iconMap = {
      Transportation: (
        <MaterialIcons name="directions-car" size={24} color={colors.black} />
      ),
      Food: <MaterialIcons name="restaurant" size={24} color={colors.black} />,
      Activity: (
        <MaterialIcons name="local-activity" size={24} color={colors.black} />
      ),
      Shopping: (
        <MaterialIcons name="shopping-bag" size={24} color={colors.black} />
      ),
      Groceries: (
        <MaterialIcons
          name="local-grocery-store"
          size={24}
          color={colors.black}
        />
      ),
      Accommodation: (
        <MaterialIcons name="hotel" size={24} color={colors.black} />
      ),
    };

    return (
      iconMap[category] || (
        <MaterialIcons name="attach-money" size={24} color={colors.black} />
      )
    );
  };

  const renderTotalsContent = () => (
    <View style={styles.totalsContainer}>
      <View style={styles.timeFilterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity style={styles.timeFilterButton}>
            <Text style={styles.timeFilterText}>1D</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.timeFilterButton}>
            <Text style={styles.timeFilterText}>1W</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.timeFilterButton}>
            <Text style={styles.timeFilterText}>4W</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.timeFilterButton}>
            <Text style={styles.timeFilterText}>3M</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.timeFilterButton}>
            <Text style={styles.timeFilterText}>1Y</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.timeFilterButton, styles.timeFilterButtonActive]}
          >
            <Text style={[styles.timeFilterText, styles.timeFilterTextActive]}>
              All
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <View style={styles.totalItemCard}>
        <Text style={styles.totalCardLabel}>Total Group Spending</Text>
        <Text style={styles.totalCardValue}>{group.totalGroupSpending}</Text>
      </View>

      <View style={styles.totalItemCard}>
        <Text style={styles.totalCardLabel}>Total You Paid For</Text>
        <Text style={styles.totalCardValue}>{group.totalPaid}</Text>
      </View>

      <View style={styles.totalItemCard}>
        <Text style={styles.totalCardLabel}>Your Total Share</Text>
        <Text style={styles.totalCardValue}>{group.yourTotalShare}</Text>
      </View>
    </View>
  );

  const renderGroupInfoContent = () => (
    <View style={styles.groupInfoContainer}>
      <View style={styles.groupInfoCard}>
        <Text style={styles.groupInfoCardLabel}>Group Title</Text>
        <Text style={styles.groupInfoCardValue}>{group.name}</Text>
      </View>

      <View style={styles.groupInfoCard}>
        <Text style={styles.groupInfoCardLabel}>Description</Text>
        <Text style={styles.groupInfoCardValue}>{group.description}</Text>
      </View>

      <View style={styles.groupInfoCard}>
        <Text style={styles.groupInfoCardLabel}>Currency</Text>
        <Text style={styles.groupInfoCardValue}>{group.currency}</Text>
      </View>

      <View style={styles.groupInfoCard}>
        <Text style={styles.groupInfoCardLabel}>Category</Text>
        <View style={styles.categoryChip}>
          <MaterialIcons name="flight" size={16} color={colors.gray800} />
          <Text style={styles.categoryChipText}>Trip</Text>
        </View>
      </View>

      <View style={styles.groupInfoCard}>
        <View style={styles.groupInfoCardHeader}>
          <Text style={styles.groupInfoCardLabel}>Group Members</Text>
          <TouchableOpacity
            style={styles.addMemberButton}
            onPress={() =>
              navigation.navigate("SelectParticipants", { groupId })
            }
          >
            <Text style={styles.addMemberButtonText}>Add</Text>
          </TouchableOpacity>
        </View>

        {group.members.map((member) => (
          <View key={member.id} style={styles.memberDetailRow}>
            <View style={styles.memberDetailLeft}>
              <View style={styles.memberAvatar}>
                <Text style={styles.memberInitial}>
                  {member.name.charAt(0)}
                </Text>
              </View>
              <View>
                <Text style={styles.memberDetailName}>{member.name}</Text>
                <Text style={styles.memberDetailEmail}>{member.email}</Text>
              </View>
            </View>
            <TouchableOpacity>
              <MaterialIcons
                name="more-vert"
                size={20}
                color={colors.gray600}
              />
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );

  const getAvatarColor = (name) => {
    const colors = [
      { name: "A", avatarColor: colors.primaryLight }, // Light yellow
      { name: "B", avatarColor: colors.info }, // Blue
      { name: "C", avatarColor: colors.success }, // Green
      { name: "D", avatarColor: colors.warning }, // Orange
      { name: "E", avatarColor: colors.error }, // Red
      { name: "F", avatarColor: colors.primary }, // Yellow
      { name: "G", avatarColor: colors.info }, // Blue
      { name: "H", avatarColor: colors.success }, // Green
      { name: "I", avatarColor: colors.warning }, // Orange
      { name: "J", avatarColor: colors.error }, // Red
    ];

    const color = colors.find((c) => c.name === name.charAt(0));
    return color ? color.avatarColor : colors.gray200;
  };

  return (
    <SafeAreaView style={styles.container} edges={["right", "left", "top"]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={24} color={colors.black} />
        </TouchableOpacity>
        <Text style={styles.title}>{group.name}</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("EditGroup", { groupId })}
        >
          <MaterialIcons name="more-vert" size={24} color={colors.black} />
        </TouchableOpacity>
      </View>

      {/* Group Image */}
      <View style={styles.groupImageContainer}>
        {group.image ? (
          <Image
            source={{ uri: group.image }}
            style={styles.groupImage}
            onError={() => {
              console.log(`Failed to load image for group: ${groupId}`);
            }}
          />
        ) : (
          <View style={styles.groupImagePlaceholder}>
            <Text style={styles.groupImageInitial}>{group.name.charAt(0)}</Text>
          </View>
        )}
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "expenses" && styles.activeTab]}
            onPress={() => setActiveTab("expenses")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "expenses" && styles.activeTabText,
              ]}
            >
              Expenses
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === "balances" && styles.activeTab]}
            onPress={() => setActiveTab("balances")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "balances" && styles.activeTabText,
              ]}
            >
              Balances
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === "totals" && styles.activeTab]}
            onPress={() => setActiveTab("totals")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "totals" && styles.activeTabText,
              ]}
            >
              Totals
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === "group" && styles.activeTab]}
            onPress={() => setActiveTab("group")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "group" && styles.activeTabText,
              ]}
            >
              Group
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Tab Content */}
      {activeTab === "expenses" && (
        <View style={styles.tabContent}>
          <FlatList
            data={group.expenses}
            renderItem={renderExpenseItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.expensesList}
          />
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate("AddExpense", { groupId })}
          >
            <MaterialIcons name="add" size={24} color={colors.black} />
          </TouchableOpacity>
        </View>
      )}

      {activeTab === "balances" && (
        <View style={styles.tabContent}>
          <FlatList
            data={group.members}
            renderItem={renderBalanceItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.membersList}
          />
        </View>
      )}

      {activeTab === "totals" && (
        <View style={styles.tabContent}>{renderTotalsContent()}</View>
      )}

      {activeTab === "group" && (
        <View style={styles.tabContent}>{renderGroupInfoContent()}</View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  backButton: {
    padding: spacing.xs,
  },
  title: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.black,
  },
  groupImageContainer: {
    height: 180,
    width: "100%",
    backgroundColor: colors.gray100,
  },
  groupImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  groupImagePlaceholder: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.gray200,
  },
  groupImageInitial: {
    fontSize: 64,
    fontWeight: typography.fontWeight.bold,
    color: colors.gray700,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  tab: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: typography.fontSize.md,
    color: colors.gray600,
  },
  activeTabText: {
    color: colors.black,
    fontWeight: typography.fontWeight.medium,
  },
  tabContent: {
    flex: 1,
  },
  expensesList: {
    padding: spacing.lg,
  },
  expenseItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  expenseLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },
  expenseInfo: {
    flex: 1,
  },
  expenseTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
    color: colors.gray900,
    marginBottom: 2,
  },
  expensePaidBy: {
    fontSize: typography.fontSize.sm,
    color: colors.gray500,
  },
  expenseRight: {
    alignItems: "flex-end",
  },
  expenseAmount: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    color: colors.gray900,
    marginBottom: 2,
  },
  expenseDate: {
    fontSize: typography.fontSize.sm,
    color: colors.gray500,
  },
  addButton: {
    position: "absolute",
    right: spacing.lg,
    bottom: spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  membersList: {
    padding: spacing.lg,
  },
  memberItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  memberLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  memberAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.gray200,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },
  memberInitial: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.gray800,
  },
  memberName: {
    fontSize: typography.fontSize.md,
    color: colors.gray900,
  },
  memberRight: {},
  memberBalance: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
  },
  positiveBalance: {
    color: colors.success,
  },
  neutralBalance: {
    color: colors.gray600,
  },
  negativeBalance: {
    color: colors.error,
  },
  totalsContainer: {
    padding: spacing.lg,
  },
  timeFilterContainer: {
    marginBottom: spacing.lg,
  },
  timeFilterButton: {
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.gray200,
    borderRadius: borderRadius.full,
  },
  timeFilterText: {
    fontSize: typography.fontSize.md,
    color: colors.gray900,
  },
  timeFilterButtonActive: {
    borderColor: colors.primary,
  },
  timeFilterTextActive: {
    color: colors.primary,
    fontWeight: typography.fontWeight.medium,
  },
  totalItemCard: {
    padding: spacing.lg,
    backgroundColor: colors.white,
    borderRadius: borderRadius.full,
    marginBottom: spacing.lg,
  },
  totalCardLabel: {
    fontSize: typography.fontSize.md,
    color: colors.gray900,
    marginBottom: spacing.sm,
  },
  totalCardValue: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    color: colors.gray900,
  },
  groupInfoContainer: {
    padding: spacing.lg,
  },
  groupInfoCard: {
    marginBottom: spacing.lg,
  },
  groupInfoCardLabel: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
    color: colors.gray900,
    marginBottom: spacing.sm,
  },
  groupInfoCardValue: {
    fontSize: typography.fontSize.md,
    color: colors.gray700,
  },
  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
    backgroundColor: colors.gray200,
    borderRadius: borderRadius.full,
  },
  categoryChipText: {
    fontSize: typography.fontSize.md,
    color: colors.gray800,
    marginLeft: spacing.sm,
  },
  groupInfoCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  addMemberButton: {
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: borderRadius.full,
  },
  addMemberButtonText: {
    fontSize: typography.fontSize.md,
    color: colors.primary,
    fontWeight: typography.fontWeight.medium,
  },
  memberDetailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  memberDetailLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  memberDetailName: {
    fontSize: typography.fontSize.md,
    color: colors.gray900,
    marginLeft: spacing.sm,
  },
  memberDetailEmail: {
    fontSize: typography.fontSize.sm,
    color: colors.gray500,
  },
  balanceItem: {
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.gray200,
    borderRadius: borderRadius.md,
    overflow: "hidden",
  },
  balanceItemMain: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: spacing.md,
    backgroundColor: colors.white,
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    borderTopWidth: 1,
    borderTopColor: colors.gray200,
    padding: spacing.xs,
  },
  requestButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
  },
  requestIconContainer: {
    marginRight: spacing.xs,
  },
  requestButtonText: {
    fontSize: typography.fontSize.sm,
    color: colors.black,
    fontWeight: typography.fontWeight.medium,
  },
  detailsList: {
    borderTopWidth: 1,
    borderTopColor: colors.gray200,
    padding: spacing.md,
    backgroundColor: colors.gray100,
  },
  oweDetail: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.xs,
  },
  oweDetailText: {
    fontSize: typography.fontSize.sm,
    color: colors.gray700,
  },
});

export default GroupDetailScreen;
