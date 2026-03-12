import axios from 'axios';
import { API_URL } from '../config/env';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach auth token
api.interceptors.request.use(
  (config) => {
    // You would normally retrieve the token from secure storage or Redux state
    // import { store } from '../store';
    // const state = store.getState();
    // if (state.auth.token) {
    //   config.headers.Authorization = `Bearer ${state.auth.token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Handle global errors, token expiration, etc.
    return Promise.reject(error);
  }
);

export default api;
