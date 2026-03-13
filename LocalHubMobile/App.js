import React, { useEffect } from 'react';
import { View, StyleSheet, Platform, ScrollView } from 'react-native';
import { Provider, useDispatch } from 'react-redux';
import { store } from './src/store';
import AppNavigator from './src/navigation/AppNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { checkAuthStatus } from './src/store/authSlice';

function AppContent() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuthStatus());
  }, [dispatch]);

  return (
    <SafeAreaProvider>
      <View style={styles.rootContainer}>
        <View style={styles.appContainer}>
          <AppNavigator />
          <Toast />
        </View>
      </View>
    </SafeAreaProvider>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}
 // Overwriting export default in first chunk, removing it here

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: '#E5E7EB', // Grey background for the "side distance"
    alignItems: 'center',       // Center the app container
  },
  appContainer: {
    flex: 1,
    width: '100%',
    maxWidth: Platform.OS === 'web' ? 480 : '100%', // Mobile width on Web/Laptop, full on device
    backgroundColor: '#FFFFFF',
    // Optional shadow for the web container
    ...Platform.select({
      web: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
      },
    }),
  },
});
