import api from './api';

const adService = {
  getAds: async () => {
    return api.get('/ads');
  },
  createAd: async (data) => {
    return api.post('/ads', data);
  },
  updateAd: async (id, data) => {
    return api.put(`/ads/${id}`, data);
  },
  deleteAd: async (id) => {
    return api.delete(`/ads/${id}`);
  },
};

export default adService;
