import api from './api';

const favoriteService = {
  addFavorite: async (data) => {
    try {
      const response = await api.post('/favorites', data);
      return { data: response || { ...data, id: 'f_new' }};
    } catch (e) {
      return { data: { ...data, id: 'f_new' }};
    }
  },
  deleteFavorite: async (id) => {
    try {
      const response = await api.delete(`/favorites/${id}`);
      return { data: response || { success: true }};
    } catch (e) {
      return { data: { success: true }};
    }
  },
  getFavoritesByUser: async () => {
    try {
      const response = await api.get('/favorites/user');
      return { data: response || [] };
    } catch (e) {
      return { data: [] };
    }
  },
};

export default favoriteService;
