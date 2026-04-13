import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';

import { navigationRef } from './navigationRef';
import AdminNavigator from './AdminNavigator';
import UserNavigator from './UserNavigator';
import MainDrawerNavigator from './MainDrawerNavigator';
import ProviderNavigator from './ProviderNavigator';
import { ROLES } from '../utils/constants';

import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';

import SettingsScreen from '../screens/user/SettingsScreen';
import SupportScreen from '../screens/user/SupportScreen';
import AboutUsScreen from '../screens/user/AboutUsScreen';
import InfoScreen from '../screens/user/InfoScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { isAuthenticated, role } = useSelector((state) => state.auth);

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated && role === ROLES.ADMIN ? (
          <Stack.Screen name="AdminRoot" component={AdminNavigator} />
        ) : isAuthenticated && role === ROLES.PROVIDER ? (
          <Stack.Screen name="ProviderRoot" component={ProviderNavigator} />
        ) : (
          <>
            {/* UserRoot is the default, visible when logged out or when logged in as USER */}
            <Stack.Screen name="UserRoot" component={MainDrawerNavigator} />
            
            {/* Make Login accessible if not authenticated */}
            {!isAuthenticated && (
              <>
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Register" component={RegisterScreen} />
                <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
              </>
            )}
          </>
        )}
        <Stack.Screen name="Support" component={SupportScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="AboutUs" component={AboutUsScreen} />
        <Stack.Screen name="Info" component={InfoScreen} />
    </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
