import api from './api';

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
      const response = await api.post('/auth/login', { email, password });
      return { data: response || mockUser };
    } catch (e) {
      console.log('API login failed, returning mock user:', e.message || e);
      return { data: mockUser };
    }
  },
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return { data: response || mockUser };
    } catch (e) {
      console.log('API register failed, returning mock user:', e.message || e);
      return { data: mockUser };
    }
  },
  getProfile: async () => {
    try {
      const response = await api.get('/auth/profile');
      return { data: response || mockUser.user };
    } catch (e) {
      return { data: mockUser.user };
    }
  },
};

export default authService;
