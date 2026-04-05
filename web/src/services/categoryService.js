import api from './api';

const categoryService = {
  // Fetch all main categories
  getCategories: async () => {
    try {
      const response = await api.get('/categories');
      return response;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  // Fetch subcategories for a specific parent category
  getSubcategories: async (categoryId) => {
    try {
      const response = await api.get(`/categories/${categoryId}/subcategories`);
      return response;
    } catch (error) {
      console.error('Error fetching subcategories:', error);
      throw error;
    }
  },

  // Fetch all trending/popular subcategories (optional)
  getPopularSubcategories: async () => {
    try {
      const response = await api.get('/categories/popular/subcategories');
      return response;
    } catch (error) {
      console.error('Error fetching popular subcategories:', error);
      throw error;
    }
  }
};

export default categoryService;
