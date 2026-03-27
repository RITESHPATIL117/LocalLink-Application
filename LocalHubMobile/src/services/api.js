import axios from 'axios';
import { API_URL } from '../config/env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import logger from '../utils/logger';

const api = axios.create({
  baseURL: API_URL,
  timeout: 3000, // 3 seconds timeout for "Real-time" responsiveness
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
      logger.debug(`API Request: ${config.method.toUpperCase()} ${config.url}`, config.params || config.data);
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

// Response interceptor - unwraps response.data for easier consumption
api.interceptors.response.use(
  (response) => {
    logger.debug(`API Response: ${response.config.method.toUpperCase()} ${response.config.url}`, response.data);
    // If the backend returns data directly, this will be that data
    return response.data;
  },
  (error) => {
    const isMockEndpont = error.config?.url?.includes('/admin/') || error.config?.url?.includes('/leads');
    
    if (error.code === 'ERR_NETWORK') {
      logger.debug(`NETWORK OFFLINE: ${API_URL}. Using resilient mock mode.`);
    }

    // Silence common failures for endpoints known to have mock fallbacks
    if (isMockEndpont && (error.response?.status === 404 || error.response?.status === 500)) {
      logger.debug(`API Silence: ${error.config?.method?.toUpperCase()} ${error.config?.url} (Mocking Active)`);
    } else if (error.response?.status === 404 || error.response?.status === 500 || error.code === 'ERR_NETWORK') {
      logger.warn(`API Expected Failure: ${error.config?.method?.toUpperCase()} ${error.config?.url} | Status: ${error.response?.status || error.code}`);
    } else {
      logger.error(`API Response Error: ${error.config?.method?.toUpperCase()} ${error.config?.url}`, {
        message: error.message,
        status: error.response?.status
      });
    }
    return Promise.reject(error);
  }
);

export default api;
