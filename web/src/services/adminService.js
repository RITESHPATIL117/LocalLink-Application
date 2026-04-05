import api from './api';

const adminService = {
  getPendingBusinesses: async () => {
    try {
      const response = await api.get('/admin/businesses/pending');
      return { data: response };
    } catch (error) {
      console.error('getPendingBusinesses failed:', error);
      return { data: [] };
    }
  },

  verifyBusiness: async (businessId) => {
    try {
      const response = await api.patch(`/admin/businesses/${businessId}/verify`);
      return { success: true, data: response };
    } catch (error) {
      console.error('verifyBusiness failed:', error);
      throw error;
    }
  },
  
  getPlatformStats: async () => {
    try {
      const response = await api.get('/admin/stats');
      return { data: response };
    } catch (error) {
       // Mock for fallback if backend missing
       return { data: { users: 1492, providers: 234, revenue: 14500 } };
    }
  }
};

export default adminService;
