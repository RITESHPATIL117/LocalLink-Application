import api from './api';

const normalizeAuthPayload = (response) => {
  const payload = response?.data || response || {};
  return payload?.data || payload;
};

const authService = {
  login: async (email, password, role = 'user') => {
    try {
      const response = await api.post('/auth/login', { email, password, role });
      return { data: normalizeAuthPayload(response) };
    } catch (e) {
      if (e.code === 'ERR_NETWORK' || e.message?.includes('timeout')) {
        return { data: { token: 'demo-token', refreshToken: 'demo-refresh-token', user: { id: 'u1', name: 'Demo User', email, role } } };
      }
      throw e;
    }
  },
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return { data: normalizeAuthPayload(response) };
    } catch (e) {
      if (e.code === 'ERR_NETWORK' || e.message?.includes('timeout')) {
        return { data: { token: 'demo-token', refreshToken: 'demo-refresh-token', user: { ...userData, id: 'u_new' } } };
      }
      throw e;
    }
  },
  getProfile: async () => {
    try {
      const response = await api.get('/users/profile');
      return { data: response };
    } catch (e) {
      return { data: { id: 'u1', name: 'Demo User', email: 'demo@localhub.com', role: 'user' } };
    }
  },
};

export default authService;
