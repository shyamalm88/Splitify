import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { colors, typography, spacing, borderRadius } from "../../theme/theme";

const GroupsScreen = ({ navigation, route }) => {
  // Check if new group was added (from route params)
  const [showNewGroupAdded, setShowNewGroupAdded] = useState(
    route.params?.newGroupAdded || false
  );

  // Sample groups data
  const [groups, setGroups] = useState([
    {
      id: "1",
      name: "Trip to Japan 🇯🇵",
      members: ["Alexis", "Thomas", "Charlotte", "Augustine", "Allison"],
      image: null, // In a real app, this would be an image URI
      totalExpenses: "$352.58",
      color: "#FFD6A5", // Peach
    },
    {
      id: "2",
      name: "Dinner Delights",
      members: ["Florence", "Danny", "Geoffrey"],
      image: null,
      totalExpenses: "$125.30",
      color: "#CAFFBF", // Light green
    },
    {
      id: "3",
      name: "Expense Explorers",
      members: ["Alexis", "Charlotte", "Geoffrey", "Danny", "Augustine"],
      image: null,
      totalExpenses: "$478.55",
      color: "#A0C4FF", // Light blue
    },
    {
      id: "4",
      name: "Road Trip Reckoners",
      members: ["Thomas", "Alexis", "Charlotte"],
      image: null,
      totalExpenses: "$289.75",
      color: "#FFC6FF", // Light pink
    },
    {
      id: "5",
      name: "Gadget Group 📱",
      members: ["Geoffrey", "Augustine", "Danny"],
      image: null,
      totalExpenses: "$156.80",
      color: "#BDB2FF", // Light purple
    },
    {
      id: "6",
      name: "Family Vacation 🏖️",
      members: ["Thomas", "Charlotte", "Alexis"],
      image: null,
      totalExpenses: "$935.42",
      color: "#FFFFFC", // Light yellow
    },
    {
      id: "7",
      name: "Shopping Buddies",
      members: ["Florence", "Charlotte", "Allison"],
      image: null,
      totalExpenses: "$325.25",
      color: "#9BF6FF", // Light cyan
    },
  ]);

  // Hide the "New Group Added" message after 3 seconds
  React.useEffect(() => {
    if (showNewGroupAdded) {
      const timer = setTimeout(() => {
        setShowNewGroupAdded(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showNewGroupAdded]);

  const renderGroupItem = ({ item }) => {
    // Function to get icon based on group name
    const getGroupIcon = (groupName) => {
      const name = groupName.toLowerCase();
      if (name.includes("trip") || name.includes("vacation")) {
        return "flight";
      } else if (name.includes("dinner") || name.includes("food")) {
        return "restaurant";
      } else if (name.includes("gadget")) {
        return "devices";
      } else if (name.includes("shopping")) {
        return "shopping-bag";
      } else if (name.includes("road")) {
        return "directions-car";
      } else {
        return "group";
      }
    };

    return (
      <TouchableOpacity
        style={styles.groupItem}
        onPress={() => navigation.navigate("GroupDetail", { groupId: item.id })}
      >
        <View style={styles.groupImageContainer}>
          {item.image ? (
            <Image
              source={{ uri: item.image }}
              style={styles.groupImage}
              onError={() => {
                console.log(`Failed to load image for group: ${item.id}`);
                // Don't update state here - it causes infinite loops
              }}
            />
          ) : (
            <View
              style={[styles.placeholderImage, { backgroundColor: item.color }]}
            >
              <MaterialIcons
                name={getGroupIcon(item.name)}
                size={24}
                color={colors.gray800}
              />
            </View>
          )}
        </View>
        <View style={styles.groupInfo}>
          <Text style={styles.groupName}>{item.name}</Text>
          <Text style={styles.groupMembers}>
            {item.members.slice(0, 3).join(", ")}
            {item.members.length > 3 ? ` +${item.members.length - 3} more` : ""}
          </Text>
        </View>
        <MaterialIcons name="chevron-right" size={24} color={colors.gray400} />
      </TouchableOpacity>
    );
  };

  // Empty state component
  const EmptyGroupsState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyImagePlaceholder}>
        <MaterialIcons name="group-add" size={64} color={colors.gray400} />
      </View>
      <Text style={styles.emptyTitle}>Empty</Text>
      <Text style={styles.emptySubtitle}>You haven't created a group yet</Text>
      <TouchableOpacity
        style={styles.createButtonLarge}
        onPress={() => navigation.navigate("NewGroup")}
      >
        <Text style={styles.createButtonText}>Create a New Group</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={["right", "left", "top"]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Groups</Text>
        <TouchableOpacity onPress={() => {}}>
          <MaterialIcons name="more-vert" size={24} color={colors.black} />
        </TouchableOpacity>
      </View>

      {/* New Group Added Toast */}
      {showNewGroupAdded && (
        <View style={styles.toastContainer}>
          <Text style={styles.toastText}>New Group Added!</Text>
        </View>
      )}

      {/* Group List or Empty State */}
      {groups.length > 0 ? (
        <FlatList
          data={groups}
          renderItem={renderGroupItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.groupList}
        />
      ) : (
        <EmptyGroupsState />
      )}

      {/* Create Group FAB (only shown when groups exist) */}
      {groups.length > 0 && (
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate("NewGroup")}
        >
          <MaterialIcons name="add" size={24} color={colors.black} />
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  title: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.black,
  },
  toastContainer: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    marginHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    alignItems: "center",
    marginBottom: spacing.md,
  },
  toastText: {
    color: colors.black,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
  },
  groupList: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  groupItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  groupImageContainer: {
    width: 50,
    height: 50,
    borderRadius: 8,
    overflow: "hidden",
    marginRight: spacing.md,
  },
  groupImage: {
    width: "100%",
    height: "100%",
  },
  placeholderImage: {
    width: "100%",
    height: "100%",
    backgroundColor: colors.gray200,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.gray800,
  },
  groupInfo: {
    flex: 1,
  },
  groupName: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
    color: colors.gray900,
    marginBottom: 4,
  },
  groupMembers: {
    fontSize: typography.fontSize.sm,
    color: colors.gray600,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.xl,
  },
  emptyImagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.gray200,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.gray900,
    marginBottom: spacing.sm,
  },
  emptySubtitle: {
    fontSize: typography.fontSize.md,
    color: colors.gray600,
    textAlign: "center",
    marginBottom: spacing.xl,
  },
  createButtonLarge: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.full,
  },
  createButtonText: {
    color: colors.black,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
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
});

export default GroupsScreen;
