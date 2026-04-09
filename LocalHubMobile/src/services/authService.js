import api from './api';
import logger from '../utils/logger';

const normalizeAuthPayload = (response) => {
  const payload = response?.data || response || {};
  return payload?.data || payload;
};

const authService = {
  login: async (email, password, role = 'user') => {
    try {
      logger.info(`Attempting login for: ${email} as ${role}`);
      const response = await api.post('/auth/login', { email, password, role });
      logger.info('Login successful');
      return { data: normalizeAuthPayload(response) };
    } catch (e) {
      logger.error('API login failed', { message: e.message, email });
      if (e.code === 'ERR_NETWORK' || e.message?.includes('timeout')) {
        logger.warn('Network issue detected. Entering Demo Mode fallback.');
        // Allow demo login even if API is down
        return { data: { token: 'demo-token', refreshToken: 'demo-refresh-token', user: { id: 'u1', name: 'Demo User', email, role } } };
      }
      throw e;
    }
  },
  register: async (userData) => {
    try {
      logger.info(`Attempting registration for: ${userData.email}`);
      const response = await api.post('/auth/register', userData);
      logger.info('Registration successful');
      return { data: normalizeAuthPayload(response) };
    } catch (e) {
      const serverMessage = e.response?.data?.message || e.message;
      logger.error('API register failed', { message: serverMessage, email: userData.email });
      if (e.code === 'ERR_NETWORK' || e.message?.includes('timeout')) {
        return { data: { token: 'demo-token', refreshToken: 'demo-refresh-token', user: { ...userData, id: 'u_new' } } };
      }
      throw e;
    }
  },
  getProfile: async () => {
    try {
      logger.debug('Fetching user profile...');
      const response = await api.get('/auth/me');
      return { data: response };
    } catch (e) {
      logger.error('Failed to fetch profile', e.message);
      return { data: { id: 'u1', name: 'Demo User', email: 'demo@localhub.com', role: 'user' } };
    }
  },
  ownerLogin: async (email, password) => {
    try {
      logger.info(`Attempting owner login for: ${email}`);
      const response = await api.post('/auth/login', { email, password, role: 'provider' });
      return { data: normalizeAuthPayload(response) };
    } catch (e) {
      logger.error('Owner login failed', e.message);
      throw e;
    }
  },
  ownerRegister: async (userData) => {
    try {
      logger.info(`Attempting owner registration for: ${userData.email}`);
      const response = await api.post('/auth/register', { ...userData, role: 'provider' });
      return { data: normalizeAuthPayload(response) };
    } catch (e) {
      logger.error('Owner registration failed', e.message);
      throw e;
    }
  },
};

export default authService;
