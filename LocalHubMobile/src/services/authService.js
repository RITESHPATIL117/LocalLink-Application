import api from './api';
import logger from '../utils/logger';

const authService = {
  login: async (email, password, role = 'user') => {
    try {
      logger.info(`Attempting login for: ${email} as ${role}`);
      const response = await api.post('/auth/login', { email, password, role });
      logger.info('Login successful');
      return { data: response };
    } catch (e) {
      logger.error('API login failed', { message: e.message, email });
      if (e.code === 'ERR_NETWORK' || e.message?.includes('timeout')) {
        logger.warn('Network issue detected. Entering Demo Mode fallback.');
        // Allow demo login even if API is down
        return { data: { token: 'demo-token', user: { id: 'u1', name: 'Demo User', email, role } } };
      }
      throw e;
    }
  },
  register: async (userData) => {
    try {
      logger.info(`Attempting registration for: ${userData.email}`);
      const response = await api.post('/auth/register', userData);
      logger.info('Registration successful');
      return { data: response };
    } catch (e) {
      const serverMessage = e.response?.data?.message || e.message;
      logger.error('API register failed', { message: serverMessage, email: userData.email });
      if (e.code === 'ERR_NETWORK' || e.message?.includes('timeout')) {
        return { data: { token: 'demo-token', user: { ...userData, id: 'u_new' } } };
      }
      throw e;
    }
  },
  getProfile: async () => {
    try {
      logger.debug('Fetching user profile...');
      const response = await api.get('/users/profile');
      return { data: response };
    } catch (e) {
      logger.error('Failed to fetch profile', e.message);
      return { data: { id: 'u1', name: 'Demo User', email: 'demo@localhub.com', role: 'user' } };
    }
  },
  ownerLogin: async (email, password) => {
    try {
      logger.info(`Attempting owner login for: ${email}`);
      const response = await api.post('/business-owners/login', { email, password });
      return { data: response };
    } catch (e) {
      logger.error('Owner login failed', e.message);
      throw e;
    }
  },
  ownerRegister: async (userData) => {
    try {
      logger.info(`Attempting owner registration for: ${userData.email}`);
      const response = await api.post('/business-owners/register', userData);
      return { data: response };
    } catch (e) {
      logger.error('Owner registration failed', e.message);
      throw e;
    }
  },
};

export default authService;
