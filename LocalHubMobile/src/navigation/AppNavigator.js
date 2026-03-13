import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';

import AdminNavigator from './AdminNavigator';
import UserNavigator from './UserNavigator';
import ProviderNavigator from './ProviderNavigator';
import { ROLES } from '../utils/constants';

import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { isAuthenticated, role } = useSelector((state) => state.auth);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated && role === ROLES.ADMIN ? (
          <Stack.Screen name="AdminRoot" component={AdminNavigator} />
        ) : isAuthenticated && role === ROLES.PROVIDER ? (
          <Stack.Screen name="ProviderRoot" component={ProviderNavigator} />
        ) : (
          <>
            {/* UserRoot is the default, visible when logged out or when logged in as USER */}
            <Stack.Screen name="UserRoot" component={UserNavigator} />
            
            {/* Make Login accessible if not authenticated */}
            {!isAuthenticated && (
              <>
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Register" component={RegisterScreen} />
              </>
            )}
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
