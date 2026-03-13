import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import colors from '../styles/colors';

// Import Screens (to be created)
import DashboardScreen from '../screens/provider/DashboardScreen';
import MyListingsScreen from '../screens/provider/MyListingsScreen';
import LeadsScreen from '../screens/provider/LeadsScreen';
import ReviewsScreen from '../screens/provider/ReviewsScreen';
import AnalyticsScreen from '../screens/provider/AnalyticsScreen';
import AddBusinessScreen from '../screens/provider/AddBusinessScreen';

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
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'DashboardTab') {
            iconName = focused ? 'grid' : 'grid-outline';
          } else if (route.name === 'MyListingsTab') {
            iconName = focused ? 'list' : 'list-outline';
          } else if (route.name === 'LeadsTab') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'MoreTab') {
            iconName = focused ? 'bar-chart' : 'bar-chart-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="DashboardTab" component={DashboardStack} options={{ tabBarLabel: 'Dashboard' }} />
      <Tab.Screen name="MyListingsTab" component={MyListingsScreen} options={{ tabBarLabel: 'My Listings' }} />
      <Tab.Screen name="LeadsTab" component={LeadsScreen} options={{ tabBarLabel: 'Leads' }} />
      <Tab.Screen name="MoreTab" component={AnalyticsScreen} options={{ tabBarLabel: 'Analytics' }} />
    </Tab.Navigator>
  );
};

export default ProviderNavigator;
