import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Platform, useWindowDimensions } from 'react-native';

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
import EditProfileScreen from '../screens/user/EditProfileScreen';

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
    <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ headerShown: false }} />
  </Stack.Navigator>
);

const UserNavigator = () => {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: '#94A3B8',
        tabBarStyle: {
          // Keep bottom tabs on web desktop so Home / Categories / Profile stay reachable (drawer alone hid all tabs).
          display: isDesktop && Platform.OS !== 'web' ? 'none' : 'flex',
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#F1F5F9',
          height: Platform.OS === 'ios' ? 84 : 64,
          paddingBottom: Platform.OS === 'ios' ? 24 : 8,
          paddingTop: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -10 },
          shadowOpacity: 0.08,
          shadowRadius: 20,
          elevation: 20,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '900',
          textTransform: 'uppercase',
          letterSpacing: 0.5,
        },

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
