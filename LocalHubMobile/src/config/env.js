import { Platform } from 'react-native';
import Constants from 'expo-constants';

const getBaseUrl = () => {
  const configuredHost = process.env.EXPO_PUBLIC_API_HOST;
  const configuredPort = process.env.EXPO_PUBLIC_API_PORT || '5000';

  if (Platform.OS === 'web') {
    return `http://${configuredHost || '127.0.0.1'}:${configuredPort}/api`;
  }
  
  // Use the host machine's IP from Expo Constants for development
  // Fallback to the known local IP if detection fails
  const hostUri = Constants.expoConfig?.hostUri;
  const host = configuredHost || (hostUri ? hostUri.split(':').shift() : '10.13.9.254');
  
  // In Android Emulator, 10.0.2.2 usually maps to localhost
  const finalHost = Platform.OS === 'android' && !hostUri ? '10.0.2.2' : host;
  
  return `http://${finalHost}:${configuredPort}/api`;
};

export const API_URL = getBaseUrl();
export const ENV = 'development';
export const IS_MOCK_ENABLED = false; // Force real API calls to avoid Network Error in production logic
