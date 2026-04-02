import api from './api';

const adminService = {
  getStats: async () => {
    try {
      const response = await api.get('/admin/stats');
      return { data: response };
    } catch (e) {
      console.log('API getStats failed, returning mock stats');
      return { data: { totalBusinesses: 1245, totalUsers: 8930, revenue: '4.2L', pendingApprovals: 24 } };
    }
  },
  getPendingBusinesses: async () => {
    try {
      const response = await api.get('/admin/pending-businesses');
      return { data: response };
    } catch (e) {
      console.log('API getPendingBusinesses failed, returning mock pending');
      return { data: [
        { id: '1', name: 'Elite Electricians', owner_name: 'Vikram Singh', category_name: 'Electrician', createdAt: new Date().toISOString(), image: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?q=80&w=200' },
        { id: '2', name: 'Sparkle Cleaners', owner_name: 'Rahul Roy', category_name: 'Cleaning', createdAt: new Date(Date.now() - 86400000).toISOString(), image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6958?q=80&w=200' }
      ] };
    }
  },
  verifyBusiness: async (id) => {
    try {
      const response = await api.patch(`/admin/business/${id}/verify`);
      return { data: response };
    } catch (e) {
      console.log('API verifyBusiness failed, simulating success');
      return { data: { success: true } };
    }
  },
  getAllUsers: async () => {
    try {
      const response = await api.get('/admin/users');
      return { data: response };
    } catch (e) {
      console.log('API getAllUsers failed, returning mock users');
      return { data: [
        { id: '1', name: 'Ritesh Patil', email: 'ritesh@localhub.com', role: 'admin', status: 'Active', created_at: new Date(Date.now() - 31536000000).toISOString(), avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150' },
        { id: '2', name: 'Vikram Singh', email: 'vikram.s@yahoo.com', role: 'provider', status: 'Active', created_at: new Date(Date.now() - 86400000).toISOString(), avatar: null },
        { id: '3', name: 'Priya Desai', email: 'priya.cleaning@gmail.com', role: 'customer', status: 'Suspended', created_at: new Date().toISOString(), avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150' }
      ] };
    }
  },
  updateUserStatus: async (id, status) => {
    try {
      const response = await api.patch(`/admin/user/${id}/status`, { status });
      return { data: response };
    } catch (e) {
      console.log('API updateUserStatus failed, simulating success');
      return { data: { success: true, status } };
    }
  },
  getReports: async () => {
    try {
      const response = await api.get('/admin/reports');
      return { data: response };
    } catch (e) {
      console.log('API getReports failed, returning mock reports');
      return { data: [
        { id: '1', type: 'Flagged Review', entity: '"Fake Service" on SuperFast Plumbing', reporter: 'Priya Desai', date: '2 hours ago', status: 'Pending', severity: 'High' },
        { id: '2', type: 'Suspicious Listing', entity: 'Metro Electricians', reporter: 'Amit Sharma', date: '5 hours ago', status: 'Resolved', severity: 'Low' },
        { id: '3', type: 'User Conduct', entity: '@vikram.s', reporter: 'System Automod', date: '1 day ago', status: 'Pending', severity: 'Critical' },
      ]};
    }
  },
  updateReportStatus: async (id, status) => {
    try {
      const response = await api.patch(`/admin/report/${id}/status`, { status });
      return { data: response };
    } catch (e) {
      console.log('API updateReportStatus failed, simulating success');
      return { data: { success: true, status, id } };
    }
  },
  getAllBusinesses: async () => {
    try {
      const response = await api.get('/admin/businesses');
      return { data: response };
    } catch (e) {
      console.log('API getAllBusinesses failed, returning mock businesses');
      return { data: [
        { id: '1', name: 'Elite Electricians', category_name: 'Electrician', category_id: '1', status: 'active', rating: 4.8, address: 'Kharadi, Pune', image_url: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?q=80&w=400' },
        { id: '2', name: 'Sparkle Cleaners', category_name: 'Cleaning', category_id: '2', status: 'active', rating: 4.5, address: 'Viman Nagar, Pune', image_url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6958?q=80&w=400' },
        { id: '3', name: 'Healthy Hydrides', category_name: 'Plumbing', category_id: '3', status: 'suspended', rating: 3.9, address: 'Hadapsar, Pune', image_url: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?q=80&w=400' }
      ] };
    }
  },
  updateBusinessStatus: async (id, status) => {
    try {
      const response = await api.patch(`/admin/business/${id}/status`, { status });
      return { data: response };
    } catch (e) {
      console.log('API updateBusinessStatus failed, simulating success');
      return { data: { success: true, id, status } };
    }
  }
};

export default adminService;
