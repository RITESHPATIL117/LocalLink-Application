import api from './api';

const reviewService = {
  createReview: async (data) => {
    return api.post('/reviews', data);
  },
  getReviewsByBusiness: async (businessId) => {
    return api.get(`/reviews/business/${businessId}`);
  },
};

export default reviewService;
