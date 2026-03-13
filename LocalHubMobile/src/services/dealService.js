import api from './api';

const dealService = {
  createDeal: async (data) => {
    return api.post('/deals', data);
  },
  getDeals: async () => {
    return api.get('/deals');
  },
  getDealsByBusiness: async (businessId) => {
    return api.get(`/deals/business/${businessId}`);
  },
  updateDeal: async (id, data) => {
    return api.put(`/deals/${id}`, data);
  },
};

export default dealService;
