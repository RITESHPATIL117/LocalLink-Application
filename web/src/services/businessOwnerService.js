import api from './api';

const businessOwnerService = {
  getBusinesses: async () => {
    try {
      const response = await api.get('/businesses/owner');
      return response;
    } catch (error) {
      console.error('Error fetching owner businesses:', error);
      throw error;
    }
  },
  
  createBusiness: async (data, isFormData = false) => {
    try {
      const config = isFormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};
      const response = await api.post('/businesses', data, config);
      return response;
    } catch (error) {
      console.error('Error creating business:', error);
      throw error;
    }
  }
};

export default businessOwnerService;
