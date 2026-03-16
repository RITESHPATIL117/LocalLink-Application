import api from './api';

const servicesService = {
  addService: async (data) => {
    try {
      const response = await api.post('/services', data);
      return { data: response };
    } catch (e) {
      return { data: null, error: e.message };
    }
  },
  updateService: async (id, data) => {
    try {
      const response = await api.put(`/services/${id}`, data);
      return { data: response };
    } catch (e) {
      return { data: null, error: e.message };
    }
  },
  deleteService: async (id) => {
    try {
      const response = await api.delete(`/services/${id}`);
      return { data: response };
    } catch (e) {
      return { data: null, error: e.message };
    }
  },
  getServicesByBusiness: async (businessId) => {
    try {
      const response = await api.get(`/services/business/${businessId}`);
      return { data: response || [] };
    } catch (e) {
      return { data: [] };
    }
  },
};

export default servicesService;
