import api from './api';

const businessOwnerService = {
  register: async (data) => {
    return api.post('/business-owners/register', data);
  },
  login: async (email, password) => {
    return api.post('/business-owners/login', { email, password });
  },
  getBusinesses: async () => {
    return api.get('/business-owners/businesses');
  },
};

export default businessOwnerService;
