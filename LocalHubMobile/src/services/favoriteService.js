import api from './api';

const favoriteService = {
  addFavorite: async (data) => {
    return api.post('/favorites', data);
  },
  deleteFavorite: async (id) => {
    return api.delete(`/favorites/${id}`);
  },
  getFavoritesByUser: async () => {
    return api.get('/favorites/user');
  },
};

export default favoriteService;
