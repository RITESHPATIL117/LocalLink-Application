import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import colors from '../styles/colors';

// Import Screens
import DashboardScreen from '../screens/admin/DashboardScreen';
import UsersScreen from '../screens/admin/UsersScreen';
import ReportsScreen from '../screens/admin/ReportsScreen';
import BusinessesScreen from '../screens/admin/BusinessesScreen';
import ApprovalsScreen from '../screens/admin/ApprovalsScreen';
import CategoriesScreen from '../screens/admin/CategoriesScreen';
import BusinessDetailsScreen from '../screens/user/BusinessDetailsScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const AdminDashboardStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="AdminDashboard" component={DashboardScreen} />
    <Stack.Screen name="Users" component={UsersScreen} />
    <Stack.Screen name="Reports" component={ReportsScreen} />
    <Stack.Screen name="Businesses" component={BusinessesScreen} />
    <Stack.Screen name="Approvals" component={ApprovalsScreen} />
    <Stack.Screen name="Categories" component={CategoriesScreen} />
    <Stack.Screen name="BusinessDetails" component={BusinessDetailsScreen} />
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

          if (route.name === 'HomeTab') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'UsersTab') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'ApprovalsTab') {
            iconName = focused ? 'checkmark-circle' : 'checkmark-circle-outline';
          } else if (route.name === 'CategoriesTab') {
            iconName = focused ? 'grid' : 'grid-outline';
          } else if (route.name === 'ReportsTab') {
            iconName = focused ? 'document-text' : 'document-text-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="HomeTab" component={AdminDashboardStack} options={{ tabBarLabel: 'Home' }} />
      <Tab.Screen name="UsersTab" component={UsersScreen} options={{ tabBarLabel: 'Users' }} />
      <Tab.Screen name="ApprovalsTab" component={ApprovalsScreen} options={{ tabBarLabel: 'Approvals' }} />
      <Tab.Screen name="CategoriesTab" component={CategoriesScreen} options={{ tabBarLabel: 'Categories' }} />
      <Tab.Screen name="ReportsTab" component={ReportsScreen} options={{ tabBarLabel: 'Reports' }} />
    </Tab.Navigator>
  );
};

export default AdminNavigator;
