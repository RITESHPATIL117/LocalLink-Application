import api from './api';

const businessImageService = {
  uploadImage: async (data) => {
    return api.post('/business-images', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  getImages: async (businessId) => {
    return api.get(`/business-images/business/${businessId}`);
  },
  deleteImage: async (id) => {
    return api.delete(`/business-images/${id}`);
  },
};

export default businessImageService;
