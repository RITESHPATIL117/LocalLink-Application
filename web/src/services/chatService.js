import api from './api';

const chatService = {
  getChats: async () => {
    try {
      // In a real scenario, this fetches active chats
      const response = await api.get('/chats');
      return response;
    } catch (error) {
      console.error('Error fetching chats:', error);
      throw error;
    }
  },

  getChatHistory: async (chatId) => {
    try {
      const response = await api.get(`/chats/${chatId}/messages`);
      return response;
    } catch (error) {
      console.error('Error fetching chat history:', error);
      throw error;
    }
  },

  sendMessage: async (chatId, messageData) => {
    try {
      const response = await api.post(`/chats/${chatId}/messages`, messageData);
      return response;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }
};

export default chatService;
