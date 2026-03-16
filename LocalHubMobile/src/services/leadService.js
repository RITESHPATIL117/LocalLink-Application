import api from './api';

const leadService = {
  sendLead: async (data) => {
    try {
      const response = await api.post('/leads', data);
      return { data: response };
    } catch (e) {
      return { data: null, error: e.message };
    }
  },
  getLeadsByBusiness: async (businessId) => {
    try {
      const response = await api.get(`/leads/business/${businessId}`);
      return { data: response || [] };
    } catch (e) {
      return { data: [] };
    }
  },
};

export default leadService;
