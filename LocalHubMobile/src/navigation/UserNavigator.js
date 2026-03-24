import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import colors from '../styles/colors';

// Import Screens
import HomeScreen from '../screens/user/HomeScreen';
import SearchResultsScreen from '../screens/user/SearchResultsScreen';
import BusinessDetailsScreen from '../screens/user/BusinessDetailsScreen';
import CategoriesScreen from '../screens/user/CategoriesScreen';
import FavoritesScreen from '../screens/user/FavoritesScreen';
import ProfileScreen from '../screens/user/ProfileScreen';
import PricingScreen from '../screens/user/PricingScreen';
import SubcategoryScreen from '../screens/user/SubcategoryScreen';
import RequestsScreen from '../screens/user/RequestsScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const HomeStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
    <Stack.Screen name="SearchResults" component={SearchResultsScreen} options={{ headerShown: false }} />
    <Stack.Screen name="BusinessDetails" component={BusinessDetailsScreen} options={{ headerShown: false }} />
    <Stack.Screen name="Subcategory" component={SubcategoryScreen} options={{ headerShown: false }} />
    <Stack.Screen name="Pricing" component={PricingScreen} options={{ headerShown: false }} />
  </Stack.Navigator>
);

const RequestsStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Requests" component={RequestsScreen} options={{ headerShown: false }} />
  </Stack.Navigator>
);

const CategoriesStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Categories" component={CategoriesScreen} options={{ headerShown: false }} />
    <Stack.Screen name="Subcategory" component={SubcategoryScreen} options={{ headerShown: false }} />
    <Stack.Screen name="SearchResults" component={SearchResultsScreen} options={{ headerShown: false }} />
    <Stack.Screen name="BusinessDetails" component={BusinessDetailsScreen} options={{ headerShown: false }} />
  </Stack.Navigator>
);

const FavoritesStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Favorites" component={FavoritesScreen} options={{ headerShown: false }} />
    <Stack.Screen name="BusinessDetails" component={BusinessDetailsScreen} options={{ headerShown: false }} />
  </Stack.Navigator>
);

const ProfileStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
    {/* Add other profile-related stacks here if needed */}
  </Stack.Navigator>
);

const UserNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'HomeTab') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'CategoriesTab') iconName = focused ? 'grid' : 'grid-outline';
          else if (route.name === 'RequestsTab') iconName = focused ? 'document-text' : 'document-text-outline';
          else if (route.name === 'FavoritesTab') iconName = focused ? 'heart' : 'heart-outline';
          else if (route.name === 'ProfileTab') iconName = focused ? 'person' : 'person-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="HomeTab" component={HomeStack} options={{ tabBarLabel: 'Home' }} />
      <Tab.Screen name="CategoriesTab" component={CategoriesStack} options={{ tabBarLabel: 'Categories' }} />
      <Tab.Screen name="RequestsTab" component={RequestsStack} options={{ tabBarLabel: 'Requests' }} />
      <Tab.Screen name="FavoritesTab" component={FavoritesStack} options={{ tabBarLabel: 'Favorites' }} />
      <Tab.Screen name="ProfileTab" component={ProfileStack} options={{ tabBarLabel: 'Profile' }} />
    </Tab.Navigator>
  );
};

export default UserNavigator;
