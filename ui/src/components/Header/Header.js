import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { colors, typography, spacing } from "../../theme/theme";

/**
 * Header component with support for back button, title, and right action
 */
const Header = ({
  title,
  leftIcon,
  rightIcon,
  onLeftPress,
  onRightPress,
  backgroundColor = colors.white,
  titleColor = colors.gray900,
  style,
  titleStyle,
  showStatusBar = true,
  statusBarStyle = "dark-content",
  ...props
}) => {
  return (
    <View style={[styles.container, { backgroundColor }, style]} {...props}>
      {showStatusBar && <StatusBar barStyle={statusBarStyle} />}

      <View style={styles.content}>
        <View style={styles.leftContainer}>
          {leftIcon && (
            <TouchableOpacity
              style={styles.iconButton}
              onPress={onLeftPress}
              disabled={!onLeftPress}
            >
              {leftIcon}
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.titleContainer}>
          <Text
            style={[styles.title, { color: titleColor }, titleStyle]}
            numberOfLines={1}
          >
            {title}
          </Text>
        </View>

        <View style={styles.rightContainer}>
          {rightIcon && (
            <TouchableOpacity
              style={styles.iconButton}
              onPress={onRightPress}
              disabled={!onRightPress}
            >
              {rightIcon}
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: spacing.lg,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 56,
    paddingHorizontal: spacing.md,
  },
  leftContainer: {
    minWidth: 40,
    alignItems: "flex-start",
  },
  titleContainer: {
    flex: 1,
    alignItems: "center",
  },
  rightContainer: {
    minWidth: 40,
    alignItems: "flex-end",
  },
  title: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
  },
  iconButton: {
    padding: spacing.xs,
  },
});

export default Header;
