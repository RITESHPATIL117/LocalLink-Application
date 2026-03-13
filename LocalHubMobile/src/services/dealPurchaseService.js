import api from './api';

const dealPurchaseService = {
  purchaseDeal: async (data) => {
    return api.post('/deal-purchases', data);
  },
  getDealPurchasesByUser: async () => {
    return api.get('/deal-purchases/user');
  },
};

export default dealPurchaseService;
