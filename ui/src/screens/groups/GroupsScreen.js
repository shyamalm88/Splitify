import React, { useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { colors, typography, spacing, borderRadius } from "../../theme/theme";
import { useAuth } from "../../context/AuthContext";
import { useGroups } from "../../services/groupService";
import { useFocusEffect } from "@react-navigation/native";

const GroupsScreen = ({ navigation, route }) => {
  const { token, user } = useAuth();

  // Use the TanStack Query hook for groups
  const { data: groups, isLoading, isError, error, refetch } = useGroups(token);

  // Refetch when screen gets focus
  useFocusEffect(
    React.useCallback(() => {
      refetch();
    }, [refetch])
  );

  // Handle responses from other screens (like group creation)
  useEffect(() => {
    if (route.params?.newGroupAdded) {
      // We don't need to manually fetch since the cache was already invalidated
      // Just clear the params to avoid repeated refreshes
      navigation.setParams({ newGroupAdded: undefined, newGroup: undefined });
    }
  }, [route.params, navigation]);

  const handleCreateGroup = () => {
    navigation.navigate("NewGroup");
  };

  const handleGroupPress = (groupId) => {
    navigation.navigate("GroupDetails", { groupId });
  };

  const renderGroupItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.groupItem}
        onPress={() => handleGroupPress(item._id)}
      >
        {/* Group Image Thumbnail */}
        <Text>{JSON.stringify(item)}</Text>
        {item.imageUrl ? (
          <Image source={{ uri: item.imageUrl }} style={styles.groupImage} />
        ) : (
          <View style={styles.groupInitialContainer}>
            <Text style={styles.groupInitial}>{item.name.charAt(0)}</Text>
          </View>
        )}

        {/* Group Details */}
        <View style={styles.groupDetails}>
          <Text style={styles.groupName}>{item.name}</Text>
          <Text style={styles.groupMembers}>
            {item.participants.length}{" "}
            {item.participants.length === 1 ? "member" : "members"}
          </Text>
        </View>

        {/* Chevron Icon */}
        <MaterialIcons name="chevron-right" size={24} color={colors.gray400} />
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading groups...</Text>
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <MaterialIcons name="error-outline" size={48} color={colors.error} />
        <Text style={styles.errorText}>
          Error loading groups: {error?.message || "Unknown error"}
        </Text>
        <TouchableOpacity style={styles.retryButton} onPress={refetch}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["right", "left", "top"]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Groups</Text>
      </View>

      {/* Groups List */}
      {groups && groups.length > 0 ? (
        <FlatList
          data={groups}
          renderItem={renderGroupItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.groupsList}
          refreshing={isLoading}
          onRefresh={refetch}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="group" size={64} color={colors.gray300} />
          <Text style={styles.emptyText}>No groups yet</Text>
          <Text style={styles.emptySubtext}>
            Create a group to start tracking expenses with friends
          </Text>
          <TouchableOpacity
            style={styles.createFirstButton}
            onPress={handleCreateGroup}
          >
            <Text style={styles.createFirstButtonText}>Create First Group</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Floating Action Button (FAB) */}
      {groups && groups.length > 0 && (
        <TouchableOpacity style={styles.fab} onPress={handleCreateGroup}>
          <MaterialIcons name="add" size={24} color={colors.white} />
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
  groupImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: spacing.md,
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.white,
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: typography.fontSize.md,
    color: colors.gray600,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.lg,
  },
  errorText: {
    color: colors.error,
    marginBottom: spacing.md,
  },
  retryButton: {
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: borderRadius.full,
  },
  retryButtonText: {
    color: colors.black,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
  },
  groupsList: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  groupInitialContainer: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: colors.gray200,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },
  groupInitial: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.gray800,
  },
  groupDetails: {
    flex: 1,
    justifyContent: "center",
  },
  createButton: {
    padding: spacing.md,
  },
  createFirstButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.full,
  },
  createFirstButtonText: {
    color: colors.black,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
  },
  emptyText: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.gray900,
    marginBottom: spacing.sm,
  },
  emptySubtext: {
    fontSize: typography.fontSize.md,
    color: colors.gray600,
    textAlign: "center",
    marginBottom: spacing.xl,
  },
  fab: {
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
