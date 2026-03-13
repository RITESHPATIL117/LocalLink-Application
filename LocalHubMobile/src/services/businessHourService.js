import api from './api';

const businessHourService = {
  addBusinessHours: async (data) => {
    return api.post('/business-hours', data);
  },
  updateBusinessHours: async (id, data) => {
    return api.put(`/business-hours/${id}`, data);
  },
  getBusinessHours: async (businessId) => {
    return api.get(`/business-hours/business/${businessId}`);
  },
};

export default businessHourService;
