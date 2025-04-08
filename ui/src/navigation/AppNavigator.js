import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import {
  HomeScreen,
  AddExpenseScreen,
  ExpenseDetailsScreen,
  NotificationScreen,
  PayScreen,
  RequestScreen,
  ProfileScreen,
  PersonalInfoScreen,
  NotificationSettingsScreen,
  SecurityScreen,
  BillingSubscriptionsScreen,
  LinkedAccountsScreen,
  DataAnalyticsScreen,
  AppAppearanceScreen,
  ThemeScreen,
  AppLanguageScreen,
  LogoutConfirmScreen,
  ContactsScreen,
  ContactDetailScreen,
  SearchContactScreen,
  AddContactScreen,
  DeleteContactConfirmScreen,
  ContactDeletedScreen,
  GroupsScreen,
  NewGroupScreen,
  SelectParticipantsScreen,
  GroupDetailScreen,
  AddGroupExpenseScreen,
  SplitByScreen,
  EditGroupScreen,
  LeaveGroupConfirmScreen,
  DeleteGroupConfirmScreen,
  SelectCategoryScreen,
  RequestPaymentScreen,
  GroupSettingsScreen,
  ActivityScreen,
  GroupCreationSuccessScreen,
  SelectPayerScreen,
} from "../screens";
import { TabBar } from "../components";
import { colors } from "../theme/theme";

// Placeholder screens
const ScanScreen = () => (
  <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    <Text>Scan Receipt Screen</Text>
  </View>
);

// Create navigators
const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();
const GroupsStack = createNativeStackNavigator();
const ScanStack = createNativeStackNavigator();
const ProfileStack = createNativeStackNavigator();
const ContactsStack = createNativeStackNavigator();

// Home stack navigator
const HomeStackNavigator = () => {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="HomeMain" component={HomeScreen} />
      <HomeStack.Screen
        name="ExpenseDetails"
        component={ExpenseDetailsScreen}
      />
      <HomeStack.Screen name="AddExpense" component={AddExpenseScreen} />
      <HomeStack.Screen name="Notification" component={NotificationScreen} />
      <HomeStack.Screen
        name="NotificationSettings"
        component={NotificationSettingsScreen}
      />
      <HomeStack.Screen name="Activity" component={ActivityScreen} />
      <HomeStack.Screen name="Pay" component={PayScreen} />
      <HomeStack.Screen name="Request" component={RequestScreen} />
    </HomeStack.Navigator>
  );
};

// Groups stack navigator
const GroupsStackNavigator = () => {
  return (
    <GroupsStack.Navigator screenOptions={{ headerShown: false }}>
      <GroupsStack.Screen name="GroupsMain" component={GroupsScreen} />
      <GroupsStack.Screen name="NewGroup" component={NewGroupScreen} />
      <GroupsStack.Screen
        name="SelectParticipants"
        component={SelectParticipantsScreen}
      />
      <GroupsStack.Screen
        name="GroupCreationSuccess"
        component={GroupCreationSuccessScreen}
      />
      <GroupsStack.Screen name="GroupDetails" component={GroupDetailScreen} />
      <GroupsStack.Screen
        name="GroupSettings"
        component={GroupSettingsScreen}
      />
      <GroupsStack.Screen name="AddExpense" component={AddGroupExpenseScreen} />
      <GroupsStack.Screen name="SplitBy" component={SplitByScreen} />
      <GroupsStack.Screen name="EditGroup" component={EditGroupScreen} />
      <GroupsStack.Screen
        name="SelectCategory"
        component={SelectCategoryScreen}
      />
      <GroupsStack.Screen name="SelectPayer" component={SelectPayerScreen} />
      <GroupsStack.Screen
        name="ExpenseDetails"
        component={ExpenseDetailsScreen}
      />
      <GroupsStack.Screen
        name="LeaveGroupConfirm"
        component={LeaveGroupConfirmScreen}
        options={{
          presentation: "transparentModal",
          cardOverlayEnabled: true,
        }}
      />
      <GroupsStack.Screen
        name="DeleteGroupConfirm"
        component={DeleteGroupConfirmScreen}
        options={{
          presentation: "transparentModal",
          cardOverlayEnabled: true,
        }}
      />
      <GroupsStack.Screen
        name="RequestPayment"
        component={RequestPaymentScreen}
      />
    </GroupsStack.Navigator>
  );
};

// Scan stack navigator
const ScanStackNavigator = () => {
  return (
    <ScanStack.Navigator screenOptions={{ headerShown: false }}>
      <ScanStack.Screen name="ScanMain" component={ScanScreen} />
    </ScanStack.Navigator>
  );
};

// Profile stack navigator
const ProfileStackNavigator = () => {
  return (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
      <ProfileStack.Screen name="ProfileMain" component={ProfileScreen} />
      <ProfileStack.Screen name="PersonalInfo" component={PersonalInfoScreen} />
      <ProfileStack.Screen
        name="Notification"
        component={NotificationSettingsScreen}
      />
      <ProfileStack.Screen name="AccountSecurity" component={SecurityScreen} />
      <ProfileStack.Screen name="PaymentMethods" component={ProfileScreen} />
      <ProfileStack.Screen
        name="BillingSubscriptions"
        component={BillingSubscriptionsScreen}
      />
      <ProfileStack.Screen
        name="LinkedAccounts"
        component={LinkedAccountsScreen}
      />
      <ProfileStack.Screen
        name="AppAppearance"
        component={AppAppearanceScreen}
        options={{ headerShown: false }}
      />
      <ProfileStack.Screen
        name="Theme"
        component={ThemeScreen}
        options={{ headerShown: false }}
      />
      <ProfileStack.Screen
        name="AppLanguage"
        component={AppLanguageScreen}
        options={{ headerShown: false }}
      />
      <ProfileStack.Screen
        name="DataAnalytics"
        component={DataAnalyticsScreen}
      />
      <ProfileStack.Screen name="HelpSupport" component={ProfileScreen} />
      <ProfileStack.Screen
        name="LogoutConfirm"
        component={LogoutConfirmScreen}
        options={{
          headerShown: false,
          presentation: "transparentModal",
          cardOverlayEnabled: true,
        }}
      />
    </ProfileStack.Navigator>
  );
};

// Contacts stack navigator
const ContactsStackNavigator = () => {
  return (
    <ContactsStack.Navigator screenOptions={{ headerShown: false }}>
      <ContactsStack.Screen name="ContactsMain" component={ContactsScreen} />
      <ContactsStack.Screen
        name="ContactDetail"
        component={ContactDetailScreen}
      />
      <ContactsStack.Screen
        name="SearchContact"
        component={SearchContactScreen}
      />
      <ContactsStack.Screen name="AddContact" component={AddContactScreen} />
      <ContactsStack.Screen
        name="DeleteContactConfirm"
        component={DeleteContactConfirmScreen}
        options={{
          presentation: "transparentModal",
          cardOverlayEnabled: true,
        }}
      />
      <ContactsStack.Screen
        name="ContactDeleted"
        component={ContactDeletedScreen}
        options={{
          presentation: "transparentModal",
          cardOverlayEnabled: true,
        }}
      />
    </ContactsStack.Navigator>
  );
};

// Tab navigator
const AppNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.gray600,
      }}
      tabBar={(props) => <TabBar {...props} />}
    >
      <Tab.Screen
        name="Home"
        component={HomeStackNavigator}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialIcons name="home" size={28} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Groups"
        component={GroupsStackNavigator}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialIcons name="groups" size={28} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Scan"
        component={ScanStackNavigator}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialIcons name="document-scanner" size={28} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Contacts"
        component={ContactsStackNavigator}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialIcons name="people" size={28} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStackNavigator}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialIcons name="person" size={28} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default AppNavigator;
