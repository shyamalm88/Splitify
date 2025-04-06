import React from "react";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import {
  colors,
  typography,
  spacing,
  shadows,
  borderRadius,
} from "../../theme/theme";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";

/**
 * TabBar component for bottom navigation
 */
const TabBar = ({ state, descriptors, navigation }) => {
  return (
    <View style={styles.container}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;
        const isScanTab = route.name === "Scan";

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        if (isScanTab) {
          return (
            <TouchableOpacity
              key={index}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={styles.tabButton}
            >
              <View style={styles.scanButtonContainer}>
                <View
                  style={[
                    styles.scanButton,
                    isFocused && styles.scanButtonFocused,
                  ]}
                >
                  <MaterialCommunityIcons
                    name="qrcode-scan"
                    size={28}
                    color={colors.black}
                  />
                </View>
              </View>
            </TouchableOpacity>
          );
        }

        return (
          <TouchableOpacity
            key={index}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tabButton}
          >
            <View
              style={[
                styles.tabItemContainer,
                isFocused && styles.activeTabItemContainer,
              ]}
            >
              {options.tabBarIcon &&
                options.tabBarIcon({
                  focused: isFocused,
                  color: isFocused ? colors.white : colors.black,
                  size: 34,
                })}
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.gray300,
    paddingBottom: spacing.lg,
    paddingTop: spacing.md,
    ...shadows.md,
    height: 80,
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.sm,
  },
  tabItemContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 0,
    marginTop: -spacing.sm,
  },
  indicator: {
    position: "absolute",
    top: -spacing.sm,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.primary,
  },
  scanButtonContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: -spacing.lg,
  },
  scanButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: colors.gray300,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 8,
  },
  scanButtonFocused: {
    backgroundColor: colors.white,
    borderWidth: 3,
    borderColor: colors.primary,
  },
  scanButtonText: {
    fontSize: 24,
  },
  activeTabItemContainer: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.full,
  },
});

export default TabBar;
