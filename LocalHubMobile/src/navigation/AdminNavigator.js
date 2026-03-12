import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import colors from '../styles/colors';

// Import Screens (to be created)
import DashboardScreen from '../screens/admin/DashboardScreen';
import UsersScreen from '../screens/admin/UsersScreen';
import ReportsScreen from '../screens/admin/ReportsScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const AdminDashboardStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="AdminDashboard" component={DashboardScreen} options={{ title: 'Admin Dashboard' }} />
  </Stack.Navigator>
);

const AdminNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
      }}
    >
      <Tab.Screen name="DashboardTab" component={AdminDashboardStack} options={{ tabBarLabel: 'Dashboard' }} />
      <Tab.Screen name="UsersTab" component={UsersScreen} options={{ tabBarLabel: 'Users' }} />
      <Tab.Screen name="ReportsTab" component={ReportsScreen} options={{ tabBarLabel: 'Reports' }} />
    </Tab.Navigator>
  );
};

export default AdminNavigator;
