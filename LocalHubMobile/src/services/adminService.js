import api from './api';

const adminService = {
  getStats: async () => {
    try {
      const response = await api.get('/admin/stats');
      return { data: response };
    } catch (e) {
      console.log('API getStats failed:', e.message || e);
      throw e;
    }
  },
  getPendingBusinesses: async () => {
    try {
      const response = await api.get('/admin/pending-businesses');
      return { data: response };
    } catch (e) {
      console.log('API getPendingBusinesses failed:', e.message || e);
      throw e;
    }
  },
  verifyBusiness: async (id) => {
    try {
      const response = await api.patch(`/admin/business/${id}/verify`);
      return { data: response };
    } catch (e) {
      console.log('API verifyBusiness failed:', e.message || e);
      throw e;
    }
  },
  getAllUsers: async () => {
    try {
      const response = await api.get('/admin/users');
      return { data: response };
    } catch (e) {
      console.log('API getAllUsers failed:', e.message || e);
      throw e;
    }
  },
  updateUserStatus: async (id, status) => {
    try {
      const response = await api.patch(`/admin/user/${id}/status`, { status });
      return { data: response };
    } catch (e) {
      console.log('API updateUserStatus failed:', e.message || e);
      throw e;
    }
  }
};

export default adminService;
