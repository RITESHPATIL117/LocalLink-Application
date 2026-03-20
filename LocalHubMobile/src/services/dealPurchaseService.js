import api from './api';

const dealPurchaseService = {
  purchaseDeal: async (data) => {
    try {
      const response = await api.post('/deal-purchases', data);
      return { data: response };
    } catch (e) {
      return { data: null, error: e.message };
    }
  },
  getDealPurchasesByUser: async (userId) => {
    try {
      const response = await api.get(`/deal-purchases/user/${userId}`);
      return { data: response || [] };
    } catch (e) {
      return { data: [] };
    }
  },
};

export default dealPurchaseService;
