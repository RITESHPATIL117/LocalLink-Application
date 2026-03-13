import api from './api';

const leadService = {
  sendLead: async (data) => {
    return api.post('/leads', data);
  },
  getLeadsByBusiness: async (businessId) => {
    return api.get(`/leads/business/${businessId}`);
  },
};

export default leadService;
