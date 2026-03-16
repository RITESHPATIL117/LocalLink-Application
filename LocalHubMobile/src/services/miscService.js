import api from './api';

const miscService = {
  getNewRequest: async () => {
    try {
      const response = await api.get('/new-request');
      return { data: response };
    } catch (e) {
      return { data: null };
    }
  },
};

export default miscService;
