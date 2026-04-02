import api from './api';

// In-memory session cache for newly added businesses to ensure they persist while app is open
const businessOwnerService = {
  register: async (data) => {
    return api.post('/business-owners/register', data);
  },
  login: async (email, password) => {
    return api.post('/business-owners/login', { email, password });
  },
  getBusinesses: async () => {
    return api.get('/businesses/my-businesses');
  },
  addBusiness: async (data) => {
    const payload = {
      ...data,
      categoryName: data.category 
    };
    return api.post('/businesses', payload);
  },
  updateBusiness: async (id, data) => {
    return api.put(`/businesses/${id}`, data);
  },
  getDashboardStats: async () => {
    return api.get('/businesses/owner/stats');
  },
  deleteBusiness: async (id) => {
    return api.delete(`/businesses/${id}`);
  },
};

export default businessOwnerService;
