import api from './api';

const favoriteService = {
  getFavorites: async () => {
    const response = await api.get('/favorites');
    return response.data || response || [];
  },

  addFavorite: async (businessId) => {
    return api.post('/favorites', { business_id: businessId });
  },

  removeFavorite: async (businessId) => {
    return api.delete(`/favorites/${businessId}`);
  },

  toggleFavorite: async (businessId) => {
    const response = await api.post('/favorites/toggle', { business_id: businessId });
    return response.data || response;
  }
};

export default favoriteService;
