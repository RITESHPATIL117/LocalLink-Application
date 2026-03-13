import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
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
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'DashboardTab') {
            iconName = focused ? 'speedometer' : 'speedometer-outline';
          } else if (route.name === 'UsersTab') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'ReportsTab') {
            iconName = focused ? 'document-text' : 'document-text-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="DashboardTab" component={AdminDashboardStack} options={{ tabBarLabel: 'Dashboard' }} />
      <Tab.Screen name="UsersTab" component={UsersScreen} options={{ tabBarLabel: 'Users' }} />
      <Tab.Screen name="ReportsTab" component={ReportsScreen} options={{ tabBarLabel: 'Reports' }} />
    </Tab.Navigator>
  );
};

export default AdminNavigator;
