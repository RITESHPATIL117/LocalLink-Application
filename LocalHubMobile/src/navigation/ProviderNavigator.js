import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import colors from '../styles/colors';

// Import Screens (to be created)
import DashboardScreen from '../screens/serviceProvider/DashboardScreen';
import MyListingsScreen from '../screens/serviceProvider/MyListingsScreen';
import LeadsScreen from '../screens/serviceProvider/LeadsScreen';
import ReviewsScreen from '../screens/serviceProvider/ReviewsScreen';
import AnalyticsScreen from '../screens/serviceProvider/AnalyticsScreen';
import AddBusinessScreen from '../screens/serviceProvider/AddBusinessScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const DashboardStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="ProviderDashboard" component={DashboardScreen} options={{ title: 'Provider Dashboard' }} />
    <Stack.Screen name="AddBusiness" component={AddBusinessScreen} options={{ title: 'Add Business' }} />
  </Stack.Navigator>
);

const ProviderNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
      }}
    >
      <Tab.Screen name="DashboardTab" component={DashboardStack} options={{ tabBarLabel: 'Dashboard' }} />
      <Tab.Screen name="MyListingsTab" component={MyListingsScreen} options={{ tabBarLabel: 'My Listings' }} />
      <Tab.Screen name="LeadsTab" component={LeadsScreen} options={{ tabBarLabel: 'Leads' }} />
      <Tab.Screen name="MoreTab" component={AnalyticsScreen} options={{ tabBarLabel: 'Analytics' }} />
    </Tab.Navigator>
  );
};

export default ProviderNavigator;
