import api from './api';

const businessImageService = {
  uploadImage: async (data) => {
    try {
      const response = await api.post('/business-images', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return { data: response };
    } catch (e) {
      return { data: null, error: e.message };
    }
  },
  getImages: async (businessId) => {
    try {
      const response = await api.get(`/business-images/business/${businessId}`);
      return { data: response || [] };
    } catch (e) {
      return { data: [] };
    }
  },
  deleteImage: async (id) => {
    try {
      const response = await api.delete(`/business-images/${id}`);
      return { data: response || { success: true } };
    } catch (e) {
      return { data: { success: true } };
    }
  },
};

export default businessImageService;
