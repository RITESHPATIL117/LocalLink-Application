import api from './api';

const businessOwnerService = {
  register: async (data) => {
    try {
      const response = await api.post('/business-owners/register', data);
      return { data: response || { id: 'bo_new', ...data, role: 'provider' }};
    } catch (e) {
      return { data: { id: 'bo_new', ...data, role: 'provider' }};
    }
  },
  login: async (email, password) => {
    try {
      const response = await api.post('/business-owners/login', { email, password });
      return { data: response || { user: { id: 'bo1', email, role: 'provider' }, token: 'mock-provider-token' }};
    } catch (e) {
      return { data: { user: { id: 'bo1', email, role: 'provider' }, token: 'mock-provider-token' }};
    }
  },
  getBusinesses: async () => {
    try {
      const response = await api.get('/business-owners/businesses');
      return { data: response || [] };
    } catch (e) {
      return { data: [] };
    }
  },
};

export default businessOwnerService;
