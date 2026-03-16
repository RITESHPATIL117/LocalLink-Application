import api from './api';

const mockDeals = [
  {
    id: 'd1',
    businessId: 'b1',
    title: '20% Off Spring Cleaning',
    description: 'Get your home ready for spring with our deep cleaning special.',
    discount: 20,
    validUntil: new Date(Date.now() + 864000000).toISOString()
  }
];

const dealService = {
  createDeal: async (data) => {
    try {
      const response = await api.post('/deals', data);
      return { data: response || { ...data, id: 'd_new' } };
    } catch (e) {
      return { data: { ...data, id: 'd_new' } };
    }
  },
  getDeals: async () => {
    try {
      const response = await api.get('/deals');
      return { data: response || mockDeals };
    } catch (e) {
      return { data: mockDeals };
    }
  },
  getDealsByBusiness: async (businessId) => {
    try {
      const response = await api.get(`/deals/business/${businessId}`);
      return { data: response || mockDeals.filter(d => d.businessId === businessId) || mockDeals };
    } catch (e) {
      return { data: mockDeals.filter(d => d.businessId === businessId) || mockDeals };
    }
  },
  updateDeal: async (id, data) => {
    try {
      return await api.put(`/deals/${id}`, data);
    } catch (e) {
      return { data: { ...data, id } };
    }
  },
};

export default dealService;
