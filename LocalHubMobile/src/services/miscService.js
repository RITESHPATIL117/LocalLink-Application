import api from './api';

const miscService = {
  getNewRequest: async () => {
    return api.get('/new-request');
  },
};

export default miscService;
