import axios from 'axios';
import { API_URL, IS_MOCK_ENABLED } from '../config/env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import logger from '../utils/logger';

const api = axios.create({
  baseURL: API_URL,
  timeout: 5000, // Slightly increased for more stable "Real-time" response
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach auth token
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      logger.debug(`API Request: ${config.method.toUpperCase()} ${config.url}`);
    } catch (e) {
      logger.error('Error fetching token for API request', e);
    }
    return config;
  },
  (error) => {
    logger.error('API Request Error', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    logger.debug(`API Success: ${response.config.method.toUpperCase()} ${response.config.url}`);
    return response.data;
  },
  (error) => {
    const isMockEndpont = error.config?.url?.includes('/admin/') || error.config?.url?.includes('/leads');
    
    // Detailed Network Error Log
    if (error.code === 'ERR_NETWORK') {
      logger.error(`NETWORK ERROR: Cannot reach ${API_URL}. Check your server and network connection.`);
    }

    // Resilience Logic: Only use mocks if explicitly enabled and appropriate
    if (IS_MOCK_ENABLED && isMockEndpont && (error.response?.status === 404 || error.response?.status === 500 || error.code === 'ERR_NETWORK')) {
      logger.warn(`API FALLBACK: Using resilient mock mode for ${error.config?.url}`);
      return Promise.reject(error); // In current app logic, services handle .catch to return mock data
    }

    if (error.response?.status === 401) {
      logger.warn('Auth Error: Unauthorized access. Token might be expired.');
    }

    logger.error(`API FAILURE: ${error.config?.method?.toUpperCase()} ${error.config?.url} | Status: ${error.response?.status || error.code}`, {
      message: error.message
    });

    return Promise.reject(error);
  }
);

export default api;
