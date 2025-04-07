import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  TextInput,
  ScrollView,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import {
  colors,
  typography,
  spacing,
  shadows,
  borderRadius,
} from "../../theme/theme";

// Mock data for activity - using the same data as HomeScreen
const activityData = [
  {
    id: "1",
    description: "You owe John Doe",
    relationship: "debt",
    group: "Lunch Group",
    amount: 54.25,
    type: "pay",
    date: "Today",
    time: "10:35 AM",
  },
  {
    id: "2",
    description: "Sarah Wilson owes you",
    relationship: "credit",
    group: "Apartment 4B",
    amount: 128.75,
    type: "request",
    date: "Today",
    time: "08:15 AM",
  },
  {
    id: "5",
    description: "Lisa Baker - All settled up",
    relationship: "settled",
    group: "Weekend Getaway",
    amount: 0,
    type: "none",
    date: "Today",
    time: "11:52 AM",
  },
  {
    id: "3",
    description: "Michael Brown owes Alex Smith",
    relationship: "thirdParty",
    group: "Road Trip",
    amount: 87.5,
    type: "request",
    date: "Yesterday",
    time: "03:45 PM",
  },
  {
    id: "4",
    description: "You owe Emily Johnson",
    relationship: "debt",
    group: "Movie Night",
    amount: 32.4,
    type: "pay",
    date: "Yesterday",
    time: "11:20 AM",
  },
  {
    id: "6",
    description: "James Wilson owes you",
    relationship: "credit",
    group: "Birthday Party",
    amount: 95.2,
    type: "request",
    date: "March 15, 2023",
    time: "02:30 PM",
  },
  {
    id: "7",
    description: "You owe Robert Taylor",
    relationship: "debt",
    group: "Dinner",
    amount: 42.75,
    type: "pay",
    date: "March 10, 2023",
    time: "07:45 PM",
  },
  {
    id: "8",
    description: "Andrew Ainsley",
    relationship: "debt",
    group: "Dinner",
    amount: 365.5,
    type: "pay",
    date: "Today",
    time: "12:30 PM",
  },
  {
    id: "9",
    description: "Allison Schuster",
    relationship: "debt",
    group: "Trip",
    amount: 42.5,
    type: "request",
    date: "Today",
    time: "02:15 PM",
  },
  {
    id: "10",
    description: "Raymond Winkler",
    relationship: "debt",
    group: "Groceries",
    amount: 208.4,
    type: "request",
    date: "Yesterday",
    time: "09:20 AM",
  },
  {
    id: "11",
    description: "Damon Kulowski",
    relationship: "debt",
    group: "Movie Night",
    amount: 534.75,
    type: "pay",
    date: "Yesterday",
    time: "08:45 PM",
  },
  {
    id: "12",
    description: "Geoffrey Mart",
    relationship: "credit",
    group: "Dinner",
    amount: 167.5,
    type: "paid",
    date: "Yesterday",
    time: "07:30 PM",
  },
  {
    id: "13",
    description: "Ronald Richards",
    relationship: "debt",
    group: "Groceries",
    amount: 479.25,
    type: "paid",
    date: "Dec 18, 2023",
    time: "10:15 AM",
  },
];

const ActivityScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [showSearch, setShowSearch] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [dateFilter, setDateFilter] = useState("all"); // 'all', 'today', 'yesterday', 'thisWeek', 'thisMonth'

  // Filter the activity data based on search and filters
  const filteredActivityData = activityData.filter((item) => {
    // Apply search filter
    const matchesSearch =
      searchQuery === "" ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.group &&
        item.group.toLowerCase().includes(searchQuery.toLowerCase()));

    // Apply relationship filter
    const matchesRelationship =
      activeFilter === "all" ||
      (activeFilter === "debt" && item.relationship === "debt") ||
      (activeFilter === "credit" && item.relationship === "credit") ||
      (activeFilter === "settled" && item.relationship === "settled");

    // Apply date filter
    let matchesDate = true;
    if (dateFilter === "today") {
      matchesDate = item.date === "Today";
    } else if (dateFilter === "yesterday") {
      matchesDate = item.date === "Yesterday";
    } else if (dateFilter === "thisWeek") {
      matchesDate =
        ["Today", "Yesterday"].includes(item.date) ||
        new Date() - new Date(item.date) < 7 * 24 * 60 * 60 * 1000;
    } else if (dateFilter === "thisMonth") {
      matchesDate =
        ["Today", "Yesterday"].includes(item.date) ||
        new Date(item.date).getMonth() === new Date().getMonth();
    }

    return matchesSearch && matchesRelationship && matchesDate;
  });

  // Toggle search bar visibility
  const toggleSearchBar = () => {
    setShowSearch(!showSearch);
    // Clear search when hiding search bar
    if (showSearch) {
      setSearchQuery("");
    }
  };

  // Toggle filter modal
  const toggleFilterModal = () => {
    setShowFilterModal(!showFilterModal);
  };

  // Handle date filter change
  const handleDateFilterChange = (newDateFilter) => {
    setDateFilter(newDateFilter);
    setShowFilterModal(false);
  };

  // Handle item press
  const handleItemPress = (item) => {
    console.log("Item pressed:", item.id);
    // Add navigation or other actions here
  };

  return (
    <SafeAreaView
      style={styles.container}
      edges={["right", "left", "top", "bottom"]}
    >
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={24} color={colors.black} />
        </TouchableOpacity>
        <Text style={styles.title}>Activity</Text>
        <TouchableOpacity style={styles.searchButton} onPress={toggleSearchBar}>
          <MaterialIcons
            name={showSearch ? "close" : "search"}
            size={24}
            color={colors.black}
          />
        </TouchableOpacity>
      </View>

      {/* Search Bar - conditionally rendered */}
      {showSearch && (
        <View style={styles.searchBarContainer}>
          <View style={styles.searchContainer}>
            <MaterialIcons name="search" size={20} color={colors.gray600} />
            <TextInput
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search transactions"
              placeholderTextColor={colors.gray500}
              autoFocus={true}
            />
            {searchQuery !== "" && (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                <MaterialIcons name="clear" size={20} color={colors.gray600} />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.filterButton}
              onPress={toggleFilterModal}
            >
              <MaterialIcons
                name="filter-list"
                size={24}
                color={colors.primary}
              />
            </TouchableOpacity>
          </View>

          {/* Date Filter Chip */}
          {dateFilter !== "all" && (
            <View style={styles.filterChipsContainer}>
              <View style={styles.filterChip}>
                <Text style={styles.filterChipText}>
                  {dateFilter === "today"
                    ? "Today"
                    : dateFilter === "yesterday"
                      ? "Yesterday"
                      : dateFilter === "thisWeek"
                        ? "This Week"
                        : "This Month"}
                </Text>
                <TouchableOpacity onPress={() => setDateFilter("all")}>
                  <MaterialIcons
                    name="close"
                    size={16}
                    color={colors.gray700}
                  />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      )}

      {/* Filter Tabs */}
      <View
        style={[
          styles.filterTabsContainer,
          showSearch && styles.filterTabsWithSearch,
        ]}
      >
        <TouchableOpacity
          style={[
            styles.filterTab,
            activeFilter === "all" && styles.activeFilterTab,
          ]}
          onPress={() => setActiveFilter("all")}
        >
          <Text
            style={[
              styles.filterTabText,
              activeFilter === "all" && styles.activeFilterTabText,
            ]}
          >
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterTab,
            activeFilter === "debt" && styles.activeFilterTab,
          ]}
          onPress={() => setActiveFilter("debt")}
        >
          <Text
            style={[
              styles.filterTabText,
              activeFilter === "debt" && styles.activeFilterTabText,
            ]}
          >
            You Owe
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterTab,
            activeFilter === "credit" && styles.activeFilterTab,
          ]}
          onPress={() => setActiveFilter("credit")}
        >
          <Text
            style={[
              styles.filterTabText,
              activeFilter === "credit" && styles.activeFilterTabText,
            ]}
          >
            Owe to you
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterTab,
            activeFilter === "settled" && styles.activeFilterTab,
          ]}
          onPress={() => setActiveFilter("settled")}
        >
          <Text
            style={[
              styles.filterTabText,
              activeFilter === "settled" && styles.activeFilterTabText,
            ]}
          >
            Settled
          </Text>
        </TouchableOpacity>
      </View>

      {/* Activity List */}
      <ScrollView style={styles.activityListContainer}>
        {/* Check if there's any filtered data */}
        {filteredActivityData.length === 0 ? (
          <View style={styles.noResultsContainer}>
            <MaterialIcons name="search-off" size={48} color={colors.gray400} />
            <Text style={styles.noResultsText}>No activities found</Text>
            <Text style={styles.noResultsSubtext}>
              Try adjusting your search or filters
            </Text>
          </View>
        ) : (
          // Group activities by date
          (() => {
            // Get unique dates from filtered activity data
            const uniqueDates = [
              ...new Set(filteredActivityData.map((item) => item.date)),
            ];

            return uniqueDates.map((date) => (
              <View key={date} style={styles.dateSection}>
                {/* Date Header */}
                <View style={styles.dateHeaderContainer}>
                  <Text style={styles.dateHeader}>{date}</Text>
                </View>

                {/* Activity Items for this date */}
                <View style={styles.activitiesContainer}>
                  {filteredActivityData
                    .filter((item) => item.date === date)
                    .map((item) => (
                      <TouchableOpacity
                        key={item.id}
                        style={styles.activityItem}
                        onPress={() => handleItemPress(item)}
                      >
                        <View style={styles.activityItemLeft}>
                          <View
                            style={[
                              styles.activityIcon,
                              item.relationship === "debt"
                                ? styles.activityIconDebt
                                : item.relationship === "credit"
                                  ? styles.activityIconCredit
                                  : styles.activityIconSettled,
                            ]}
                          >
                            <MaterialIcons
                              name={
                                item.relationship === "debt"
                                  ? "arrow-downward"
                                  : item.relationship === "credit"
                                    ? "arrow-upward"
                                    : "check"
                              }
                              size={16}
                              color={colors.white}
                            />
                          </View>
                          <View style={styles.activityItemContent}>
                            <Text style={styles.activityItemTitle}>
                              {item.description}
                            </Text>
                            <View style={styles.activityItemMeta}>
                              <Text style={styles.activityItemGroup}>
                                {item.group}
                              </Text>
                              <Text style={styles.activityItemTime}>
                                {item.time}
                              </Text>
                            </View>
                          </View>
                        </View>
                        <View style={styles.activityItemRight}>
                          <Text
                            style={[
                              styles.activityItemAmount,
                              item.relationship === "debt"
                                ? styles.amountDebt
                                : item.relationship === "credit"
                                  ? styles.amountCredit
                                  : styles.amountSettled,
                            ]}
                          >
                            {item.relationship === "settled"
                              ? "Settled"
                              : `$${item.amount.toFixed(2)}`}
                          </Text>
                          {item.type !== "none" && (
                            <TouchableOpacity
                              style={[
                                styles.activityActionButton,
                                {
                                  backgroundColor:
                                    item.type === "pay"
                                      ? colors.primary
                                      : colors.success,
                                },
                              ]}
                              onPress={() => {
                                if (item.type === "pay") {
                                  navigation.navigate("Pay");
                                } else if (item.type === "request") {
                                  navigation.navigate("Request");
                                }
                              }}
                            >
                              <Text style={styles.activityActionButtonText}>
                                {item.type === "pay" ? "Pay" : "Request"}
                              </Text>
                            </TouchableOpacity>
                          )}
                        </View>
                      </TouchableOpacity>
                    ))}
                </View>
              </View>
            ));
          })()
        )}
      </ScrollView>

      {/* Filter Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showFilterModal}
        onRequestClose={toggleFilterModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filter Transactions</Text>
              <TouchableOpacity onPress={toggleFilterModal}>
                <MaterialIcons name="close" size={24} color={colors.gray800} />
              </TouchableOpacity>
            </View>

            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Date</Text>
              <TouchableOpacity
                style={[
                  styles.filterOption,
                  dateFilter === "all" && styles.filterOptionActive,
                ]}
                onPress={() => handleDateFilterChange("all")}
              >
                <Text style={styles.filterOptionText}>All Time</Text>
                {dateFilter === "all" && (
                  <MaterialIcons
                    name="check"
                    size={18}
                    color={colors.primary}
                  />
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.filterOption,
                  dateFilter === "today" && styles.filterOptionActive,
                ]}
                onPress={() => handleDateFilterChange("today")}
              >
                <Text style={styles.filterOptionText}>Today</Text>
                {dateFilter === "today" && (
                  <MaterialIcons
                    name="check"
                    size={18}
                    color={colors.primary}
                  />
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.filterOption,
                  dateFilter === "yesterday" && styles.filterOptionActive,
                ]}
                onPress={() => handleDateFilterChange("yesterday")}
              >
                <Text style={styles.filterOptionText}>Yesterday</Text>
                {dateFilter === "yesterday" && (
                  <MaterialIcons
                    name="check"
                    size={18}
                    color={colors.primary}
                  />
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.filterOption,
                  dateFilter === "thisWeek" && styles.filterOptionActive,
                ]}
                onPress={() => handleDateFilterChange("thisWeek")}
              >
                <Text style={styles.filterOptionText}>This Week</Text>
                {dateFilter === "thisWeek" && (
                  <MaterialIcons
                    name="check"
                    size={18}
                    color={colors.primary}
                  />
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.filterOption,
                  dateFilter === "thisMonth" && styles.filterOptionActive,
                ]}
                onPress={() => handleDateFilterChange("thisMonth")}
              >
                <Text style={styles.filterOptionText}>This Month</Text>
                {dateFilter === "thisMonth" && (
                  <MaterialIcons
                    name="check"
                    size={18}
                    color={colors.primary}
                  />
                )}
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.applyButton}
              onPress={toggleFilterModal}
            >
              <Text style={styles.applyButtonText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray100,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  headerTitle: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    padding: spacing.xs,
  },
  title: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.black,
    marginLeft: spacing.sm,
  },
  searchButton: {
    padding: spacing.xs,
  },
  searchBarContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.gray100,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: typography.fontSize.md,
    color: colors.gray900,
    marginLeft: spacing.sm,
  },
  filterButton: {
    marginLeft: spacing.sm,
    padding: spacing.xs,
  },
  filterTabsContainer: {
    flexDirection: "row",
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
    paddingTop: spacing.sm,
    backgroundColor: colors.white,
  },
  filterTabsWithSearch: {
    paddingTop: 0,
  },
  filterTab: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    marginRight: spacing.xs / 2,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.gray100,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  activeFilterTab: {
    backgroundColor: colors.primary,
  },
  filterTabText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
    color: colors.gray700,
  },
  activeFilterTabText: {
    color: colors.white,
  },
  filterChipsContainer: {
    flexDirection: "row",
    marginTop: spacing.sm,
  },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.gray100,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.full,
    marginRight: spacing.xs,
  },
  filterChipText: {
    fontSize: typography.fontSize.sm,
    color: colors.gray700,
    marginRight: spacing.xs,
  },
  activityListContainer: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  dateSection: {
    marginBottom: spacing.lg,
  },
  dateHeaderContainer: {
    backgroundColor: colors.gray100,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.xs,
  },
  dateHeader: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.gray700,
  },
  activitiesContainer: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    overflow: "hidden",
    ...shadows.sm,
  },
  activityItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  activityItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.sm,
  },
  activityIconDebt: {
    backgroundColor: colors.error,
  },
  activityIconCredit: {
    backgroundColor: colors.success,
  },
  activityIconSettled: {
    backgroundColor: colors.info,
  },
  activityItemContent: {
    flex: 1,
  },
  activityItemTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
    color: colors.gray900,
    marginBottom: 2,
  },
  activityItemMeta: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  activityItemGroup: {
    fontSize: typography.fontSize.xs,
    color: colors.gray600,
    marginRight: spacing.xs,
  },
  activityItemTime: {
    fontSize: typography.fontSize.xs,
    color: colors.gray500,
  },
  activityItemRight: {
    alignItems: "flex-end",
  },
  activityItemAmount: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    marginBottom: spacing.xs,
  },
  amountDebt: {
    color: colors.error,
  },
  amountCredit: {
    color: colors.success,
  },
  amountSettled: {
    color: colors.info,
  },
  activityActionButton: {
    width: 80,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs / 2,
    borderRadius: borderRadius.full,
    alignItems: "center",
  },
  activityActionButtonText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
    color: colors.white,
  },
  noResultsContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.xl * 3,
  },
  noResultsText: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.medium,
    color: colors.gray800,
    marginTop: spacing.md,
  },
  noResultsSubtext: {
    fontSize: typography.fontSize.md,
    color: colors.gray600,
    marginTop: spacing.xs,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: colors.white,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    width: "80%",
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  modalTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.black,
  },
  filterSection: {
    marginBottom: spacing.md,
  },
  filterSectionTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
    color: colors.gray700,
    marginBottom: spacing.sm,
  },
  filterOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: colors.gray200,
    borderRadius: borderRadius.md,
    marginBottom: spacing.xs,
  },
  filterOptionActive: {
    borderColor: colors.primary,
  },
  filterOptionText: {
    fontSize: typography.fontSize.md,
    color: colors.gray700,
  },
  applyButton: {
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: "center",
  },
  applyButtonText: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.white,
  },
});

export default ActivityScreen;
