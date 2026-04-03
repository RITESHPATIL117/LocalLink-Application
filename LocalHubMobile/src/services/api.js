import axios from 'axios';
import { API_URL } from '../config/env';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: UNIFIED 'token' key
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      console.error('Error fetching token:', e);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Auto-clean on 401
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // Clear unified token and user data
      AsyncStorage.multiRemove(['token', 'userData']).catch(() => {});
    }
    return Promise.reject(error);
  }
);

export default api;
