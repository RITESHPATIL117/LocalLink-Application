import { Platform } from 'react-native';

const getBaseUrl = () => {
  if (Platform.OS === 'web') {
    return 'http://localhost:3000/api';
  }
  // Android Emulator commonly uses 10.0.2.2 to access the host machine
  // Update the IP below (10.13.9.254) whenever your local network IP changes
  return 'http://10.13.9.254:3000/api'; 
};

export const API_URL = getBaseUrl();
export const ENV = 'development';
export const IS_MOCK_ENABLED = true; // Set to false to force real API calls
