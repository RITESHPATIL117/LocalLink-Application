import api from './api';

const adminService = {
  getStats: async () => {
    return api.get('/admin/stats');
  },
  getPendingBusinesses: async () => {
    return api.get('/admin/pending-businesses');
  },
  verifyBusiness: async (id) => {
    return api.patch(`/admin/business/${id}/verify`);
  },
  getAllUsers: async () => {
    return api.get('/admin/users');
  },
  updateUserStatus: async (id, status) => {
    return api.patch(`/admin/user/${id}/status`, { status });
  },
  getReports: async () => {
    return api.get('/admin/reports');
  },
  updateReportStatus: async (id, status) => {
    return api.patch(`/admin/report/${id}/status`, { status });
  },
  getAllBusinesses: async () => {
    return api.get('/admin/businesses');
  },
  updateBusinessStatus: async (id, status) => {
    return api.patch(`/admin/business/${id}/status`, { status });
  }
};

export default adminService;
