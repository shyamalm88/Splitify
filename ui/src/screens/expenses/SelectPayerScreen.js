import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { colors, typography, spacing, borderRadius } from "../../theme/theme";

const SelectPayerScreen = ({ navigation, route }) => {
  const { currentUserId, onSelectPayer } = route.params;
  const [payerOptions, setPayerOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Use the specific user emails provided with their corresponding ObjectIds
    // These are valid MongoDB ObjectIds that match the format expected by the server
    const options = [
      {
        id: "5f9f1b9b9c9d1b9b9c9d1b9b", // MongoDB ObjectId for user_921830@example.com
        name: "user_921830@example.com",
        isCurrentUser: false,
      },
      {
        id: "5f9f1b9b9c9d1b9b9c9d1b9c", // MongoDB ObjectId for user_883630@example.com
        name: "user_883630@example.com",
        isCurrentUser: false,
      },
    ];

    setPayerOptions(options);
    setIsLoading(false);
  }, []);

  const handleSelectPayer = (payer) => {
    if (onSelectPayer && payer && payer.id) {
      // Ensure we're passing a valid ObjectId
      onSelectPayer({
        id: payer.id,
        name: payer.name,
        isCurrentUser: payer.isCurrentUser || false,
      });
    }
    navigation.goBack();
  };

  const renderPayerItem = ({ item }) => (
    <TouchableOpacity
      style={styles.payerItem}
      onPress={() => handleSelectPayer(item)}
    >
      <View style={styles.payerAvatar}>
        <Text style={styles.payerInitial}>
          {item.name.charAt(0).toUpperCase()}
        </Text>
      </View>
      <View style={styles.payerInfo}>
        <Text style={styles.payerName}>{item.name}</Text>
      </View>
      <MaterialIcons name="chevron-right" size={24} color={colors.gray500} />
    </TouchableOpacity>
  );

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
        <Text style={styles.title}>Who Paid?</Text>
        <View style={{ width: 24 }} />
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading group members...</Text>
        </View>
      ) : (
        <FlatList
          data={payerOptions}
          renderItem={renderPayerItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No members found</Text>
            </View>
          }
        />
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: typography.fontSize.md,
    color: colors.gray900,
  },
  listContent: {
    padding: spacing.md,
  },
  payerItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  payerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },
  payerInitial: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.black,
  },
  payerInfo: {
    flex: 1,
  },
  payerName: {
    fontSize: typography.fontSize.md,
    color: colors.gray900,
  },
  emptyContainer: {
    padding: spacing.xl,
    alignItems: "center",
  },
  emptyText: {
    fontSize: typography.fontSize.md,
    color: colors.gray500,
  },
});

export default SelectPayerScreen;
