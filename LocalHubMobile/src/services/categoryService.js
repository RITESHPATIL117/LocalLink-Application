import api from './api';

const categoryService = {
  getCategories: async () => {
    return api.get('/categories');
  },
};

export default categoryService;
