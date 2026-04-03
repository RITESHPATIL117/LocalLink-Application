import { Platform } from 'react-native';
import Constants from 'expo-constants';

const getBaseUrl = () => {
  if (Platform.OS === 'web') {
    return 'http://localhost:3000/api';
  }
  
  // Use the host machine's IP from Expo Constants for development
  // Fallback to the known local IP if detection fails
  const hostUri = Constants.expoConfig?.hostUri;
  const host = hostUri ? hostUri.split(':').shift() : '10.13.9.254';
  
  // In Android Emulator, 10.0.2.2 usually maps to localhost
  const finalHost = Platform.OS === 'android' && !hostUri ? '10.0.2.2' : host;
  
  return `http://${finalHost}:3000/api`;
};

export const API_URL = getBaseUrl();
export const ENV = 'development';
export const IS_MOCK_ENABLED = false; // Force real API calls to avoid Network Error in production logic
