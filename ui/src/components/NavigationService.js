import { navigationRef } from "../navigation/navigationRef";
import { CommonActions } from "@react-navigation/native";

class NavigationService {
  static navigate(name, params) {
    if (navigationRef.current?.isReady()) {
      navigationRef.current?.dispatch(
        CommonActions.navigate({
          name,
          params,
        })
      );
    } else {
      console.warn("Navigation attempted before navigator was ready:", name);
    }
  }

  static push(name, params) {
    if (navigationRef.current?.isReady()) {
      navigationRef.current?.dispatch(
        CommonActions.navigate({
          name,
          params,
        })
      );
    } else {
      console.warn("Push attempted before navigator was ready:", name);
    }
  }

  static goBack() {
    if (
      navigationRef.current?.isReady() &&
      navigationRef.current?.canGoBack()
    ) {
      navigationRef.current?.dispatch(CommonActions.goBack());
    } else {
      console.warn("Cannot go back or navigator not ready");
    }
  }

  static navigateAndReset(routeName, params) {
    if (navigationRef.current?.isReady()) {
      navigationRef.current?.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: routeName, params }],
        })
      );
    } else {
      console.warn("Navigation reset attempted before navigator was ready");
    }
  }

  static getCurrentRoute() {
    if (navigationRef.current?.isReady()) {
      return navigationRef.current?.getCurrentRoute()?.name;
    }
    return null;
  }

  static isReady() {
    return navigationRef.current?.isReady() || false;
  }
}

export default NavigationService;
