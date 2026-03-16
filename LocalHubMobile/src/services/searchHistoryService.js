import api from './api';

const searchHistoryService = {
  saveSearchHistory: async (data) => {
    try {
      const response = await api.post('/search-history', data);
      return { data: response || { ...data, id: 'sh_new' }};
    } catch (e) {
      return { data: { ...data, id: 'sh_new' }};
    }
  },
  getSearchHistory: async () => {
    try {
      const response = await api.get('/search-history');
      return { data: response || [] };
    } catch (e) {
      return { data: [] };
    }
  },
};

export default searchHistoryService;
