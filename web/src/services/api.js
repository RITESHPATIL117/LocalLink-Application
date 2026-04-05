import axios from 'axios';

/**
 * DEFINITIVE PROXY CONFIGURATION
 * We use a relative '/api' base URL. Next.js handles the proxying to port 3000
 * as configured in next.config.mjs. This avoids all port-desync 404 errors.
 */
const api = axios.create({
  baseURL: '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request interceptor for unified authentication
 */
api.interceptors.request.use(
  (config) => {
    try {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    } catch (e) {
      console.error('Error fetching token:', e);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Response interceptor for automatic error handling
 */
api.interceptors.response.use(
  (response) => {
    // Return data directly for cleaner service methods
    return response.data;
  },
  (error) => {
    // Log the full request details to help debug 404s
    console.error(`[API ERROR] ${error.config?.method?.toUpperCase()} ${error.config?.url}`, error.response?.status);
    
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
