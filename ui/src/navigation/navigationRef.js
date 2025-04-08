import * as React from "react";
import { CommonActions, StackActions } from "@react-navigation/native";

export const navigationRef = React.createRef();

/**
 * Safely navigate to a route
 * @param {string} name - The name of the route
 * @param {object} params - The parameters to pass to the route
 */
export function navigate(name, params) {
  try {
    if (navigationRef.current?.isReady()) {
      navigationRef.current?.navigate(name, params);
    } else {
      console.warn("Navigation attempted before navigator was ready:", name);
    }
  } catch (error) {
    console.error("Navigation error in navigate():", error);
  }
}

/**
 * Safely navigate within a nested navigator
 * @param {string} parent - The parent navigator
 * @param {string} screen - The screen name
 * @param {object} params - The parameters to pass
 */
export function navigateNested(parent, screen, params) {
  try {
    if (navigationRef.current?.isReady()) {
      navigationRef.current?.navigate(parent, {
        screen: screen,
        params: params,
      });
    } else {
      console.warn("Nested navigation attempted before navigator was ready");
    }
  } catch (error) {
    console.error("Navigation error in navigateNested():", error);
  }
}

/**
 * Helper for navigating to Pay screen
 */
export function navigateToPay(params) {
  try {
    navigateNested("Home", "Pay", params);
  } catch (error) {
    console.error("Navigation error in navigateToPay():", error);
  }
}

/**
 * Helper for navigating to Request screen
 */
export function navigateToRequest(params) {
  try {
    navigateNested("Home", "Request", params);
  } catch (error) {
    console.error("Navigation error in navigateToRequest():", error);
  }
}

/**
 * Safely reset the navigation state
 * @param {Array} routes - The routes to reset to
 */
export function reset(routes = [{ name: "Main" }]) {
  try {
    if (navigationRef.current?.isReady()) {
      navigationRef.current?.dispatch(
        CommonActions.reset({
          index: 0,
          routes,
        })
      );
    } else {
      console.warn("Navigation reset attempted before navigator was ready");
    }
  } catch (error) {
    console.error("Navigation error in reset():", error);
  }
}

/**
 * Safely go back to the previous screen
 */
export function goBack() {
  try {
    if (
      navigationRef.current?.isReady() &&
      navigationRef.current?.canGoBack()
    ) {
      navigationRef.current?.goBack();
    } else {
      console.warn("Cannot go back or navigator not ready");
    }
  } catch (error) {
    console.error("Navigation error in goBack():", error);
  }
}

/**
 * Check if the navigator is initialized
 */
export function isNavigationReady() {
  return navigationRef.current?.isReady() || false;
}

/**
 * Get the current route name
 */
export function getCurrentRouteName() {
  try {
    if (navigationRef.current?.isReady()) {
      return navigationRef.current?.getCurrentRoute()?.name;
    }
    return null;
  } catch (error) {
    console.error("Error getting current route:", error);
    return null;
  }
}

/**
 * Safely navigate to a specific screen with a delay
 * This is useful for handling navigation after state changes
 * @param {string} name - The name of the route
 * @param {object} params - The parameters to pass to the route
 * @param {number} delay - The delay in milliseconds
 */
export function navigateWithDelay(name, params, delay = 100) {
  setTimeout(() => {
    navigate(name, params);
  }, delay);
}

// Other common navigation functions can be added here
