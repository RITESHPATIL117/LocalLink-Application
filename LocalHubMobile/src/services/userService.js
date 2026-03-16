import api from './api';

const userService = {
  getProfile: async () => {
    try {
      const response = await api.get('/users/profile');
      return { data: response };
    } catch (e) {
      return { data: null, error: e.message };
    }
  },
};

export default userService;
