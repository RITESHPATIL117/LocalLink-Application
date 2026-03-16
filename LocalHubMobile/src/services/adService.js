import api from './api';

const adService = {
  getAds: async () => {
    try {
      const response = await api.get('/ads');
      return { data: response || [] };
    } catch (e) {
      return { data: [] };
    }
  },
  createAd: async (data) => {
    try {
      const response = await api.post('/ads', data);
      return { data: response || { ...data, id: 'ad_new' } };
    } catch (e) {
      return { data: { ...data, id: 'ad_new' } };
    }
  },
  updateAd: async (id, data) => {
    try {
       const response = await api.put(`/ads/${id}`, data);
       return { data: response || { ...data, id } };
    } catch (e) {
      return { data: { ...data, id } };
    }
  },
  deleteAd: async (id) => {
    try {
      const response = await api.delete(`/ads/${id}`);
      return { data: response || { success: true } };
    } catch (e) {
      return { data: { success: true } };
    }
  },
};

export default adService;
