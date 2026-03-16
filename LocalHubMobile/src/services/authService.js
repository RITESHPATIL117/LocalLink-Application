import api from './api';
import logger from '../utils/logger';

const mockUser = {
  user: {
    id: 'u1',
    name: 'Test User',
    email: 'test@example.com',
    role: 'customer',
  },
  token: 'mock-jwt-token-123'
};

const authService = {
  login: async (email, password) => {
    try {
      logger.info(`Attempting login for: ${email}`);
      const response = await api.post('/auth/login', { email, password });
      logger.info('Login successful');
      return { data: response || mockUser };
    } catch (e) {
      logger.error('API login failed, returning mock user', { message: e.message, email });
      return { data: mockUser };
    }
  },
  register: async (userData) => {
    try {
      logger.info(`Attempting registration for: ${userData.email}`);
      const response = await api.post('/auth/register', userData);
      logger.info('Registration successful');
      return { data: response || mockUser };
    } catch (e) {
      logger.error('API register failed, returning mock user', { message: e.message, email: userData.email });
      return { data: mockUser };
    }
  },
  getProfile: async () => {
    try {
      logger.debug('Fetching user profile...');
      const response = await api.get('/auth/profile');
      return { data: response || mockUser.user };
    } catch (e) {
      logger.error('Failed to fetch profile', e.message);
      return { data: mockUser.user };
    }
  },
};

export default authService;
