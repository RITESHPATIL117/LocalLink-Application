import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import colors from '../styles/colors';

// Import Screens
import DashboardScreen from '../screens/provider/DashboardScreen';
import MyListingsScreen from '../screens/provider/MyListingsScreen';
import LeadsScreen from '../screens/provider/LeadsScreen';
import LeadDetailScreen from '../screens/provider/LeadDetailScreen'; // Rename fix
import ReviewsScreen from '../screens/provider/ReviewsScreen';
import AnalyticsScreen from '../screens/provider/AnalyticsScreen';
import AddBusinessScreen from '../screens/provider/AddBusinessScreen';
import ChatListScreen from '../screens/provider/ChatListScreen'; // New
import ChatDetailScreen from '../screens/provider/ChatDetailScreen'; // New
import NotificationsScreen from '../screens/provider/NotificationsScreen'; // New
import EarningsScreen from '../screens/provider/EarningsScreen'; // New
import ProviderProfileScreen from '../screens/provider/ProviderProfileScreen'; // New
import ProviderSettingsScreen from '../screens/provider/ProviderSettingsScreen'; // New

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarActiveTintColor: colors.primary,
      tabBarInactiveTintColor: colors.textSecondary,
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;
        if (route.name === 'HomeTab') iconName = focused ? 'home' : 'home-outline';
        else if (route.name === 'MyListingsTab') iconName = focused ? 'list' : 'list-outline';
        else if (route.name === 'LeadsTab') iconName = focused ? 'people' : 'people-outline';
        else if (route.name === 'MoreTab') iconName = focused ? 'bar-chart' : 'bar-chart-outline';
        return <Ionicons name={iconName} size={size} color={color} />;
      },
    })}
  >
    <Tab.Screen name="HomeTab" component={DashboardScreen} options={{ tabBarLabel: 'Home' }} />
    <Tab.Screen name="MyListingsTab" component={MyListingsScreen} options={{ tabBarLabel: 'My Businesses' }} />
    <Tab.Screen name="LeadsTab" component={LeadsScreen} options={{ tabBarLabel: 'Leads' }} />
    <Tab.Screen name="MoreTab" component={AnalyticsScreen} options={{ tabBarLabel: 'Analytics' }} />
  </Tab.Navigator>
);

const ProviderNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerTintColor: colors.primary }}>
      <Stack.Screen name="MainTabs" component={TabNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="AddBusiness" component={AddBusinessScreen} options={{ title: 'Manage Business' }} />
      <Stack.Screen name="Reviews" component={ReviewsScreen} options={{ title: 'Customer Reviews' }} />
      <Stack.Screen name="LeadDetails" component={LeadDetailScreen} options={{ title: 'Lead Details' }} />
      <Stack.Screen name="ChatList" component={ChatListScreen} options={{ title: 'Messages' }} />
      <Stack.Screen name="ChatDetail" component={ChatDetailScreen} options={{ title: 'Chat' }} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} options={{ title: 'Notifications' }} />
      <Stack.Screen name="Earnings" component={EarningsScreen} options={{ title: 'My Earnings' }} />
      <Stack.Screen name="Profile" component={ProviderProfileScreen} options={{ title: 'Business Profile' }} />
      <Stack.Screen name="Settings" component={ProviderSettingsScreen} options={{ title: 'Settings' }} />
    </Stack.Navigator>
  );
};

export default ProviderNavigator;
