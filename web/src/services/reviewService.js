import api from './api';

const reviewService = {
  getReviewsByBusiness: async (businessId) => {
    try {
      const response = await api.get(`/reviews/business/${businessId}`);
      return response;
    } catch (error) {
      console.error('Error fetching reviews:', error);
      throw error;
    }
  },

  replyToReview: async (reviewId, replyText) => {
    try {
      const response = await api.post(`/reviews/${reviewId}/reply`, { reply: replyText });
      return response;
    } catch (error) {
      console.error('Error posting reply:', error);
      throw error;
    }
  }
};

export default reviewService;
