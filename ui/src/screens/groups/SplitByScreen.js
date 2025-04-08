import React, { useState, useEffect, useMemo } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { colors, typography, spacing, borderRadius } from "../../theme/theme";

// Move members array outside of component to prevent it from causing re-renders
const MEMBERS = [
  { id: "1", name: "Andrew Ainsley (You)" },
  { id: "2", name: "Charlotte Hanlin" },
  { id: "3", name: "Darren Kahminski" },
  { id: "4", name: "Kevin Wilson" },
  { id: "5", name: "Joseph Thames" },
];

const SplitByScreen = ({ navigation, route }) => {
  const {
    groupId,
    amount = 0,
    onSelectSplitMethod,
    currentSplitMethod,
  } = route.params || {};
  const [activeTab, setActiveTab] = useState("equally");
  const [splitAmounts, setSplitAmounts] = useState({});
  const [percentages, setPercentages] = useState({});
  const [shares, setShares] = useState({});
  const [adjustments, setAdjustments] = useState({});
  const [totalPercentage, setTotalPercentage] = useState(100);
  const [totalShares, setTotalShares] = useState(0);
  const [totalAmount, setTotalAmount] = useState(parseFloat(amount) || 0);
  // Add state to track which percentages have been manually set by the user
  const [touchedPercentages, setTouchedPercentages] = useState({});

  // Use the constant members array
  const members = MEMBERS;

  // Calculate the equal amount once to avoid recalculations
  const equalAmount = useMemo(() => {
    return amount / members.length;
  }, [amount, members.length]);

  // Initialize values only once when component mounts or amount/currentSplitMethod changes
  useEffect(() => {
    // Set default active tab based on current split method
    if (currentSplitMethod === "Equally") {
      setActiveTab("equally");
    } else if (currentSplitMethod === "By Percentage") {
      setActiveTab("percentage");
    } else if (currentSplitMethod === "By Shares") {
      setActiveTab("shares");
    } else if (currentSplitMethod === "By Adjustment") {
      setActiveTab("adjustment");
    }

    // Initialize split amounts for equal split
    const initialSplitAmounts = {};
    const initialPercentages = {};
    const initialShares = {};
    const initialAdjustments = {};

    members.forEach((member) => {
      initialSplitAmounts[member.id] = equalAmount.toFixed(2);
      initialPercentages[member.id] = (100 / members.length).toFixed(2);
      initialShares[member.id] = 1;
      initialAdjustments[member.id] = 0;
    });

    setSplitAmounts(initialSplitAmounts);
    setPercentages(initialPercentages);
    setShares(initialShares);
    setAdjustments(initialAdjustments);
    setTotalShares(members.length);
    setTotalAmount(parseFloat(amount) || 0);

    // Reset touched percentages when initializing
    setTouchedPercentages({});
  }, [amount, currentSplitMethod, equalAmount]);

  // Handle tab changes separately from calculations
  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
  };

  const handlePercentageChange = (id, value) => {
    // Mark this percentage as touched by the user
    setTouchedPercentages((prev) => ({ ...prev, [id]: true }));

    // Prevent NaN by providing a default value
    const newValue = value === "" ? "" : value;
    const newPercentages = { ...percentages, [id]: newValue };

    // Calculate how much percentage has been allocated to touched members
    let touchedTotal = 0;
    let untouchedCount = 0;

    // Count touched percentages and untouched members
    Object.keys(newPercentages).forEach((memberId) => {
      if (memberId === id || touchedPercentages[memberId]) {
        // This is either the current member being edited or another touched member
        touchedTotal +=
          newPercentages[memberId] === ""
            ? 0
            : parseFloat(newPercentages[memberId]);
      } else {
        // This is an untouched member
        untouchedCount++;
      }
    });

    // Calculate the remaining percentage to distribute among untouched members
    const remainingPercentage = 100 - touchedTotal;

    // If there are untouched members, distribute the remaining percentage evenly
    if (untouchedCount > 0) {
      const percentPerUntouched = remainingPercentage / untouchedCount;

      // Update percentages for untouched members
      Object.keys(newPercentages).forEach((memberId) => {
        if (memberId !== id && !touchedPercentages[memberId]) {
          newPercentages[memberId] = percentPerUntouched.toFixed(2);
        }
      });
    }

    // Update the state
    setPercentages(newPercentages);

    // Calculate and update total percentage
    let newTotalPercentage = 0;
    Object.values(newPercentages).forEach((p) => {
      newTotalPercentage += p === "" ? 0 : parseFloat(p);
    });
    setTotalPercentage(newTotalPercentage);

    // Update split amounts based on percentages
    const newSplitAmounts = { ...splitAmounts };
    Object.keys(newPercentages).forEach((memberId) => {
      const memberPercentage =
        newPercentages[memberId] === ""
          ? 0
          : parseFloat(newPercentages[memberId]);
      newSplitAmounts[memberId] = ((amount * memberPercentage) / 100).toFixed(
        2
      );
    });
    setSplitAmounts(newSplitAmounts);
  };

  const handleSharesChange = (id, value) => {
    // Allow empty input without converting to number yet
    const newShares = { ...shares, [id]: value };
    setShares(newShares);

    // Calculate total shares
    let newTotalShares = 0;
    Object.values(newShares).forEach((s) => {
      newTotalShares += s === "" ? 0 : parseInt(s);
    });
    setTotalShares(newTotalShares);

    // Update split amounts based on shares
    if (newTotalShares > 0) {
      const newSplitAmounts = { ...splitAmounts };
      Object.keys(newShares).forEach((memberId) => {
        const memberShares =
          newShares[memberId] === "" ? 0 : parseInt(newShares[memberId]);
        newSplitAmounts[memberId] = (
          (amount * memberShares) /
          newTotalShares
        ).toFixed(2);
      });
      setSplitAmounts(newSplitAmounts);
    }
  };

  const handleAdjustmentChange = (id, value) => {
    // Allow empty input without converting to number yet
    const newAdjustments = { ...adjustments, [id]: value };
    setAdjustments(newAdjustments);

    // Recalculate equal amounts with adjustments
    const basicEqualAmount = amount / members.length;
    const newSplitAmounts = { ...splitAmounts };

    // Apply adjustments
    let newTotal = 0;
    Object.keys(newAdjustments).forEach((memberId) => {
      const adjustment =
        newAdjustments[memberId] === ""
          ? 0
          : parseFloat(newAdjustments[memberId]);
      const adjustedAmount = basicEqualAmount + adjustment;
      newSplitAmounts[memberId] = adjustedAmount.toFixed(2);
      newTotal += adjustedAmount;
    });

    setSplitAmounts(newSplitAmounts);
    setTotalAmount(newTotal);
  };

  const handleOK = () => {
    let method = "Equally";

    if (activeTab === "percentage") {
      method = "By Percentage";
    } else if (activeTab === "shares") {
      method = "By Shares";
    } else if (activeTab === "adjustment") {
      method = "By Adjustment";
    }

    if (onSelectSplitMethod) {
      onSelectSplitMethod(method);
    }

    navigation.goBack();
  };

  const renderEquallyTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.explanation}>
        Everyone pays an equal amount of ${equalAmount.toFixed(2)}
      </Text>

      <View style={styles.membersList}>
        {members.map((member) => (
          <View key={member.id} style={styles.memberItem}>
            <Text style={styles.memberName}>{member.name}</Text>
            <Text style={styles.memberAmount}>
              ${splitAmounts[member.id] || equalAmount.toFixed(2)}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.totalContainer}>
        <Text style={styles.totalLabel}>Total per person</Text>
        <Text style={styles.totalAmount}>${equalAmount.toFixed(2)}</Text>
      </View>
    </View>
  );

  const renderPercentageTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.membersList}>
        {members.map((member) => (
          <View key={member.id} style={styles.memberItem}>
            <Text style={styles.memberName}>{member.name}</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.percentageInput}
                value={percentages[member.id]?.toString() || ""}
                onChangeText={(value) =>
                  handlePercentageChange(member.id, value)
                }
                keyboardType="decimal-pad"
              />
              <Text style={styles.percentSign}>%</Text>
              <Text style={styles.memberAmount}>
                ${splitAmounts[member.id] || "0.00"}
              </Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.totalContainer}>
        <Text style={styles.totalLabel}>Total percentage</Text>
        <Text
          style={[
            styles.totalAmount,
            Math.abs(totalPercentage - 100) > 0.01 ? styles.errorText : null,
          ]}
        >
          {totalPercentage.toFixed(2)}%
        </Text>
      </View>

      {Math.abs(totalPercentage - 100) > 0.01 && (
        <Text style={styles.warningText}>
          Total percentage should equal 100%
        </Text>
      )}
    </View>
  );

  const renderSharesTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.membersList}>
        {members.map((member) => (
          <View key={member.id} style={styles.memberItem}>
            <Text style={styles.memberName}>{member.name}</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.sharesInput}
                value={shares[member.id]?.toString() || ""}
                onChangeText={(value) => handleSharesChange(member.id, value)}
                keyboardType="number-pad"
              />
              <Text style={styles.shareText}>shares</Text>
              <Text style={styles.memberAmount}>
                ${splitAmounts[member.id] || "0.00"}
              </Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.totalContainer}>
        <Text style={styles.totalLabel}>Total shares</Text>
        <Text style={styles.totalAmount}>{totalShares || 0}</Text>
      </View>
    </View>
  );

  const renderAdjustmentTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.explanation}>
        Base split: ${equalAmount.toFixed(2)} per person
      </Text>

      <View style={styles.membersList}>
        {members.map((member) => (
          <View key={member.id} style={styles.memberItem}>
            <Text style={styles.memberName}>{member.name}</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.adjustmentPrefix}>+/-</Text>
              <TextInput
                style={styles.adjustmentInput}
                value={adjustments[member.id]?.toString() || ""}
                onChangeText={(value) =>
                  handleAdjustmentChange(member.id, value)
                }
                keyboardType="decimal-pad"
              />
              <Text style={styles.memberAmount}>
                ${splitAmounts[member.id] || equalAmount.toFixed(2)}
              </Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.totalContainer}>
        <Text style={styles.totalLabel}>Total amount</Text>
        <Text
          style={[
            styles.totalAmount,
            Math.abs(totalAmount - amount) > 0.01 ? styles.errorText : null,
          ]}
        >
          ${(totalAmount || 0).toFixed(2)}
        </Text>
      </View>

      {Math.abs(totalAmount - amount) > 0.01 && (
        <Text style={styles.warningText}>
          Total doesn't match expense amount (${amount.toFixed(2)})
        </Text>
      )}
    </View>
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
        <Text style={styles.title}>Split by</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Tabs */}
      <View style={styles.tabBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "equally" && styles.activeTab]}
            onPress={() => handleTabChange("equally")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "equally" && styles.activeTabText,
              ]}
            >
              Equally
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === "percentage" && styles.activeTab]}
            onPress={() => handleTabChange("percentage")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "percentage" && styles.activeTabText,
              ]}
            >
              By Percentage
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === "shares" && styles.activeTab]}
            onPress={() => handleTabChange("shares")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "shares" && styles.activeTabText,
              ]}
            >
              By Shares
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === "adjustment" && styles.activeTab]}
            onPress={() => handleTabChange("adjustment")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "adjustment" && styles.activeTabText,
              ]}
            >
              By Adjustment
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Tab Content */}
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {activeTab === "equally" && renderEquallyTab()}
        {activeTab === "percentage" && renderPercentageTab()}
        {activeTab === "shares" && renderSharesTab()}
        {activeTab === "adjustment" && renderAdjustmentTab()}
      </ScrollView>

      {/* Bottom Buttons */}
      <View style={styles.bottomButtons}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.okButton} onPress={handleOK}>
          <Text style={styles.okButtonText}>OK</Text>
        </TouchableOpacity>
      </View>
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
  tabBar: {
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
  contentContainer: {
    padding: spacing.lg,
  },
  tabContent: {
    flex: 1,
  },
  explanation: {
    fontSize: typography.fontSize.md,
    color: colors.gray700,
    marginBottom: spacing.lg,
    textAlign: "center",
  },
  membersList: {
    marginBottom: spacing.lg,
  },
  memberItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  memberName: {
    fontSize: typography.fontSize.md,
    color: colors.gray900,
    flex: 1,
  },
  memberAmount: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
    color: colors.gray900,
    marginLeft: spacing.sm,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  percentageInput: {
    width: 50,
    borderWidth: 1,
    borderColor: colors.gray300,
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    textAlign: "center",
  },
  percentSign: {
    marginLeft: spacing.xs,
    fontSize: typography.fontSize.md,
    color: colors.gray700,
  },
  sharesInput: {
    width: 40,
    borderWidth: 1,
    borderColor: colors.gray300,
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    textAlign: "center",
  },
  shareText: {
    marginLeft: spacing.xs,
    fontSize: typography.fontSize.sm,
    color: colors.gray700,
  },
  adjustmentPrefix: {
    marginRight: spacing.xs,
    fontSize: typography.fontSize.md,
    color: colors.gray700,
  },
  adjustmentInput: {
    width: 60,
    borderWidth: 1,
    borderColor: colors.gray300,
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    textAlign: "center",
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.gray300,
    marginTop: spacing.md,
  },
  totalLabel: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
    color: colors.gray900,
  },
  totalAmount: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.gray900,
  },
  errorText: {
    color: colors.error,
  },
  warningText: {
    fontSize: typography.fontSize.sm,
    color: colors.error,
    textAlign: "center",
    marginTop: spacing.sm,
  },
  bottomButtons: {
    flexDirection: "row",
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.gray200,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: spacing.md,
    marginRight: spacing.md,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.gray300,
    borderRadius: borderRadius.full,
  },
  cancelButtonText: {
    fontSize: typography.fontSize.md,
    color: colors.gray900,
  },
  okButton: {
    flex: 1,
    paddingVertical: spacing.md,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
  },
  okButtonText: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
    color: colors.black,
  },
});

export default SplitByScreen;
