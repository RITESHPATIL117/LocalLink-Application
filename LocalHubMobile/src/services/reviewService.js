import api from './api';

const reviewService = {
  getTopReviews: async (limit = 6) => {
    try {
      const response = await api.get(`/reviews/top?limit=${limit}`);
      return { data: response || [] };
    } catch (e) {
      // Fallback for testimonials is handled in the UI
      return { data: [] };
    }
  },
  getReviewsByBusiness: async (businessId) => {
    try {
      const response = await api.get(`/reviews/business/${businessId}`);
      return { data: response || [] };
    } catch (e) {
      return { data: [] };
    }
  },
  createReview: async (reviewData) => {
    try {
      const response = await api.post('/reviews', reviewData);
      return { data: response };
    } catch (e) {
      return { data: null, error: e.message };
    }
  }
};

export default reviewService;
