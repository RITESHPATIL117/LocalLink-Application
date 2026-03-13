import api from './api';

const userService = {
  getProfile: async () => {
    return api.get('/users/profile');
  },
};

export default userService;
