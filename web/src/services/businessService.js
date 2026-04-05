import api from './api';

const businessService = {
  getAllBusinesses: async (params = {}) => {
    try {
      const response = await api.get('/businesses', { params });
      return response;
    } catch (error) {
      console.error('Error fetching businesses:', error);
      throw error;
    }
  },

  getBusinessById: async (id) => {
    try {
      const response = await api.get(`/businesses/${id}`);
      return response;
    } catch (error) {
      console.error('Error fetching business by id:', error);
      throw error;
    }
  },

  getPublicStats: async () => {
    try {
      const response = await api.get('/businesses/stats/public');
      return response;
    } catch (error) {
      console.error('Error fetching public stats:', error);
      throw error;
    }
  }
};

export default businessService;
