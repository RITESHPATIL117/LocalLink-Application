import axios from 'axios';
import { API_URL } from '../config/env';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

import AsyncStorage from '@react-native-async-storage/async-storage';

// Request interceptor to attach auth token
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      console.log('Error fetching token for API request', e);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - unwraps response.data for easier consumption
api.interceptors.response.use(
  (response) => {
    // If the backend returns data directly, this will be that data
    return response.data;
  },
  (error) => {
    // Handle global errors, token expiration, etc.
    return Promise.reject(error);
  }
);

export default api;
