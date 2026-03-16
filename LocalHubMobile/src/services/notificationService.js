import api from './api';

const notificationService = {
  getNotifications: async () => {
    try {
       const response = await api.get('/notifications');
       return { data: response || [] };
    } catch (e) {
      return { data: [] };
    }
  },
  markAsRead: async (id) => {
    try {
      const response = await api.put(`/notifications/${id}/read`);
      return { data: response || { success: true }};
    } catch (e) {
      return { data: { success: true }};
    }
  },
};

export default notificationService;
