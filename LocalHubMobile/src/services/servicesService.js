import api from './api';

const servicesService = {
  addService: async (data) => {
    return api.post('/services', data);
  },
  updateService: async (id, data) => {
    return api.put(`/services/${id}`, data);
  },
  deleteService: async (id) => {
    return api.delete(`/services/${id}`);
  },
  getServicesByBusiness: async (businessId) => {
    return api.get(`/services/business/${businessId}`);
  },
};

export default servicesService;
