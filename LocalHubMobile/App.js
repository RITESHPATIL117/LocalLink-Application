import React, { useEffect } from 'react';
import { View, StyleSheet, Platform, ScrollView } from 'react-native';
import { Provider, useDispatch } from 'react-redux';
import { store } from './src/store';
import AppNavigator from './src/navigation/AppNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { checkAuthStatus } from './src/store/authSlice';

import { GestureHandlerRootView } from 'react-native-gesture-handler';

function AppContent() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuthStatus());
  }, [dispatch]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <View style={styles.rootContainer}>
          <View style={styles.appContainer}>
            <AppNavigator />
            <Toast />
          </View>
        </View>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: '#F3F4F6', // Lighter grey for better contrast
    alignItems: 'center',       
  },
  appContainer: {
    flex: 1,
    width: '100%',
    maxWidth: Platform.OS === 'web' ? 1280 : '100%', // Increased to 1280 for a full web experience
    backgroundColor: '#FFFFFF',
    ...Platform.select({
      web: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.05,
        shadowRadius: 15,
      },
    }),
  },
});
