import api from './api';

const searchHistoryService = {
  saveSearchHistory: async (data) => {
    return api.post('/search-history', data);
  },
  getSearchHistory: async () => {
    return api.get('/search-history');
  },
};

export default searchHistoryService;
