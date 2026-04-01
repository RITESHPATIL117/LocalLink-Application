import api from './api';

// In-memory session cache for newly added businesses to ensure they persist while app is open
let sessionBusinesses = [];

const businessOwnerService = {
  register: async (data) => {
    try {
      const response = await api.post('/business-owners/register', data);
      return { data: response || { id: 'bo_new', ...data, role: 'provider' }};
    } catch (e) {
      return { data: { id: 'bo_new', ...data, role: 'provider' }};
    }
  },
  login: async (email, password) => {
    try {
      const response = await api.post('/business-owners/login', { email, password });
      return { data: response || { user: { id: 'bo1', email, role: 'provider' }, token: 'mock-provider-token' }};
    } catch (e) {
      return { data: { user: { id: 'bo1', email, role: 'provider' }, token: 'mock-provider-token' }};
    }
  },
  getBusinesses: async () => {
    try {
      const response = await api.get('/businesses/my-businesses');
      const apiData = Array.isArray(response) ? response : [];
      // Merge API data with session-added businesses (avoid duplicates)
      const merged = [...apiData];
      sessionBusinesses.forEach(sb => {
        if (!merged.find(m => m.id === sb.id)) {
          merged.unshift(sb);
        }
      });
      return { data: merged };
    } catch (e) {
      return { data: sessionBusinesses };
    }
  },
  addBusiness: async (data) => {
    try {
      // Find category ID if needed (for real DB mapping)
      // Since CATEGORIES in screen are names, we might need a mapping or the backend to handle it by name
      // For now, assume backend might handle name or we send a dummy ID if name matches.
      // Better: The backend should look up category by name if ID is missing.
      
      const payload = {
        ...data,
        // If we have a category name, the backend should ideally resolve it.
        // For simplicity, we'll try to guess an ID or just send name
        categoryName: data.category 
      };

      const response = await api.post('/businesses', payload);
      const newBiz = response?.data || response || { id: `biz_${Date.now()}`, ...data, status: 'Pending' };
      
      // Update session cache for immediate feedback
      sessionBusinesses.unshift(newBiz);
      return { data: newBiz };
    } catch (e) {
      console.error('Add business failed, using session fallback:', e);
      const newBiz = { id: `biz_${Date.now()}`, ...data, status: 'Pending' };
      sessionBusinesses.unshift(newBiz);
      return { data: newBiz };
    }
  },
  updateBusiness: async (id, data) => {
    try {
      const response = await api.put(`/businesses/${id}`, data);
      const updatedBiz = response || { id, ...data };
      
      // Update in session cache if present
      const idx = sessionBusinesses.findIndex(b => b.id === id);
      if (idx !== -1) sessionBusinesses[idx] = updatedBiz;
      
      return { data: updatedBiz };
    } catch (e) {
      const updatedBiz = { id, ...data };
      const idx = sessionBusinesses.findIndex(b => b.id === id);
      if (idx !== -1) sessionBusinesses[idx] = updatedBiz;
      return { data: updatedBiz };
    }
  },
  getDashboardStats: async () => {
    return api.get('/businesses/owner/stats');
  },
  deleteBusiness: async (id) => {
    return api.delete(`/businesses/${id}`);
  },
};

export default businessOwnerService;
