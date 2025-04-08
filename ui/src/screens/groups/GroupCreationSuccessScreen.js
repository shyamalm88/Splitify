import React, { useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { colors, typography, spacing } from "../../theme/theme";

const GroupCreationSuccessScreen = ({ navigation, route }) => {
  const { group } = route.params;
  const scaleAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 5,
      tension: 40,
      useNativeDriver: true,
    }).start();

    // Auto navigate to group details after 2 seconds
    const timer = setTimeout(() => {
      handleViewGroup();
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleViewGroup = () => {
    navigation.replace("GroupDetails", { groupId: group._id });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View
        style={[styles.successContainer, { transform: [{ scale: scaleAnim }] }]}
      >
        <View style={styles.iconContainer}>
          <MaterialIcons
            name="check-circle"
            size={80}
            color={colors.green500}
          />
        </View>
        <Text style={styles.title}>Group Created!</Text>
        <Text style={styles.message}>
          Your group '{group.name}' has been created successfully.
        </Text>

        {group.imageUrl ? (
          <Image source={{ uri: group.imageUrl }} style={styles.groupImage} />
        ) : (
          <View style={styles.placeholderImage}>
            <Text style={styles.groupInitial}>{group.name.charAt(0)}</Text>
          </View>
        )}

        <TouchableOpacity style={styles.button} onPress={handleViewGroup}>
          <Text style={styles.buttonText}>View Group</Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.lg,
  },
  successContainer: {
    backgroundColor: colors.white,
    padding: spacing.xl,
    borderRadius: 20,
    alignItems: "center",
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    width: "90%",
  },
  iconContainer: {
    marginBottom: spacing.md,
  },
  title: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.gray900,
    marginBottom: spacing.sm,
  },
  message: {
    fontSize: typography.fontSize.md,
    color: colors.gray700,
    textAlign: "center",
    marginBottom: spacing.lg,
  },
  groupImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: spacing.lg,
  },
  placeholderImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.gray200,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  groupInitial: {
    fontSize: typography.fontSize.xl * 2,
    fontWeight: typography.fontWeight.bold,
    color: colors.gray700,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: 30,
    marginTop: spacing.md,
  },
  buttonText: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
    color: colors.black,
  },
});

export default GroupCreationSuccessScreen;
