import api from './api';

const businessService = {
  getAllBusinesses: async (params) => {
    return api.get('/businesses', { params });
  },
  getBusinessById: async (id) => {
    return api.get(`/businesses/${id}`);
  },
  addBusiness: async (data) => {
    return api.post('/businesses', data);
  },
  updateBusiness: async (id, data) => {
    return api.put(`/businesses/${id}`, data);
  },
  deleteBusiness: async (id) => {
    return api.delete(`/businesses/${id}`);
  },
};

export default businessService;
