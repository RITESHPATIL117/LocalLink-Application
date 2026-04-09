import api from './api';

const chatService = {
  getChats: async () => {
    try {
      const response = await api.get('/chats');
      const rows = response?.data || response || [];
      return { data: rows };
    } catch (e) {
      console.log('API getChats failed, returning mock conversations');
      return { data: [
        { id: '1', name: 'Amit Sharma', lastMessage: 'When can you visit my office?', time: '12:45 PM', unread: 2, isOnline: true, avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=150' },
        { id: '2', name: 'Neha Gupta', lastMessage: 'Okay, sounds good to me.', time: 'Yesterday', unread: 0, isOnline: false, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150' },
        { id: '3', name: 'System Alerts', lastMessage: 'Your listing is approved!', time: '2 days ago', unread: 0, isOnline: false, avatar: 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?q=80&w=150' }
      ]};
    }
  },
  getMessages: async (chatId) => {
    try {
      const response = await api.get(`/chats/${chatId}/messages`);
      return { data: response?.data || response || [] };
    } catch (e) {
      return { data: [] };
    }
  },
  sendMessage: async (chatId, message) => {
    try {
      return await api.post(`/chats/${chatId}/messages`, { message });
    } catch (e) {
      return { success: false, message: e.message };
    }
  }
};

export default chatService;
