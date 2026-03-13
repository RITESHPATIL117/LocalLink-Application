import api from './api';

const cityService = {
  getCities: async () => {
    return api.get('/cities');
  },
};

export default cityService;
