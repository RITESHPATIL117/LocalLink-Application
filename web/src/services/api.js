import axios from 'axios';

/**
 * DEFINITIVE PROXY CONFIGURATION
 * We use a relative '/api' base URL. Next.js handles the proxying to backend port 5000
 * as configured in next.config.mjs. This avoids all port-desync 404 errors.
 */
const api = axios.create({
  baseURL: '/api',
  timeout: 30000,
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
  async (error) => {
    // Log the full request details to help debug 404s
    console.error(`[API ERROR] ${error.config?.method?.toUpperCase()} ${error.config?.url}`, error.response?.status);

    const originalRequest = error.config || {};
    const shouldTryRefresh = error.response?.status === 401 && !originalRequest._retry && !String(originalRequest.url || '').includes('/auth/refresh');

    if (shouldTryRefresh && typeof window !== 'undefined') {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refreshToken');

      if (refreshToken) {
        if (!isRefreshing) {
          isRefreshing = true;
          try {
            const refreshResponse = await axios.post('/api/auth/refresh', { refreshToken });
            const payload = refreshResponse?.data?.data || refreshResponse?.data || {};
            if (payload.token) {
              localStorage.setItem('token', payload.token);
            }
            if (payload.refreshToken) {
              localStorage.setItem('refreshToken', payload.refreshToken);
            }
            resolveRefreshQueue(payload.token);
            isRefreshing = false;
          } catch (refreshError) {
            isRefreshing = false;
            if (typeof window !== 'undefined') {
              localStorage.removeItem('token');
              localStorage.removeItem('refreshToken');
              localStorage.removeItem('userData');
            }
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
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userData');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
