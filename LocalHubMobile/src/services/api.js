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

let isRefreshing = false;
let refreshQueue = [];

const resolveRefreshQueue = (newToken) => {
  refreshQueue.forEach((cb) => cb(newToken));
  refreshQueue = [];
};

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
  async (error) => {
    const originalRequest = error.config || {};
    const shouldTryRefresh = error.response?.status === 401 && !originalRequest._retry && !String(originalRequest.url || '').includes('/auth/refresh');

    if (shouldTryRefresh) {
      originalRequest._retry = true;
      const refreshToken = await AsyncStorage.getItem('refreshToken');

      if (refreshToken) {
        if (!isRefreshing) {
          isRefreshing = true;
          try {
            const refreshResponse = await axios.post(`${API_URL}/auth/refresh`, { refreshToken });
            const payload = refreshResponse?.data?.data || refreshResponse?.data || {};
            if (payload.token) {
              await AsyncStorage.setItem('token', payload.token);
            }
            if (payload.refreshToken) {
              await AsyncStorage.setItem('refreshToken', payload.refreshToken);
            }
            resolveRefreshQueue(payload.token);
            isRefreshing = false;
          } catch (refreshError) {
            isRefreshing = false;
            await AsyncStorage.multiRemove(['token', 'refreshToken', 'userData']).catch(() => {});
            return Promise.reject(refreshError);
          }
        }

        return new Promise((resolve, reject) => {
          refreshQueue.push((newToken) => {
            if (!newToken) return reject(error);
            originalRequest.headers = originalRequest.headers || {};
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            resolve(api(originalRequest));
          });
        });
      }
    }

    if (error.response?.status === 401) {
      // Clear unified token and user data
      AsyncStorage.multiRemove(['token', 'refreshToken', 'userData']).catch(() => {});
    }
    return Promise.reject(error);
  }
);

export default api;
