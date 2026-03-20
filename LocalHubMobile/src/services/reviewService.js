import api from './api';

const mockReviews = [
  {
    id: 'r1',
    user: { name: 'Alice Smith', avatar: 'https://i.pravatar.cc/150?img=1' },
    rating: 5,
    comment: 'Amazing service! Highly recommended.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'r2',
    user: { name: 'Bob Jones', avatar: 'https://i.pravatar.cc/150?img=2' },
    rating: 4,
    comment: 'Good experience overall, will use again.',
    createdAt: new Date(Date.now() - 86400000).toISOString()
  }
];

const reviewService = {
  createReview: async (data) => {
    try {
      const response = await api.post('/reviews', data);
      return { data: response || { ...data, id: 'r_new', createdAt: new Date().toISOString() } };
    } catch (e) {
      console.log('API createReview failed:', e.message || e);
      return { data: { ...data, id: 'r_new', createdAt: new Date().toISOString() } };
    }
  },
  getReviewsByBusiness: async (businessId) => {
    try {
      const response = await api.get(`/reviews/${businessId}`);
      return { data: response || mockReviews };
    } catch (e) {
      console.log('API getReviews failed:', e.message || e);
      return { data: mockReviews };
    }
  },
};

export default reviewService;
