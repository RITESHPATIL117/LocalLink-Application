import api from './api';

const authService = {
  login: async (email, password) => {
    return api.post('/auth/login', { email, password });
  },
  register: async (userData) => {
    return api.post('/auth/register', userData);
  },
  getProfile: async () => {
    return api.get('/auth/profile');
  },
};

export default authService;
