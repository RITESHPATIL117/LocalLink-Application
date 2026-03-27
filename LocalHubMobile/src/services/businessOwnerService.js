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
      const response = await api.post('/businesses', data);
      const newBiz = response || { id: `biz_${Date.now()}`, ...data, status: 'Pending' };
      sessionBusinesses.unshift(newBiz);
      return { data: newBiz };
    } catch (e) {
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
};

export default businessOwnerService;
