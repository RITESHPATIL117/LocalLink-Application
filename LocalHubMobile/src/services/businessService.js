import api from './api';

const mockBusinesses = [
  {
    id: 'b1',
    name: 'Sparkle Home Cleaning',
    category: 'Home Services',
    rating: 4.8,
    reviews: 124,
    address: '123 Clean St, City Center',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=1000',
    distance: '1.2 km',
    tier: 'premium',
    featured: true
  },
  {
    id: 'b2',
    name: 'QuickFix Auto Mechanics',
    category: 'Auto Repair',
    rating: 4.6,
    reviews: 89,
    address: '456 Garage Ave, Westside',
    image: 'https://images.unsplash.com/photo-1516321165247-4aa89a48be28?q=80&w=1000',
    distance: '2.5 km',
    tier: 'basic',
    featured: true
  },
  {
    id: 'b3',
    name: 'Fresh Market Groceries',
    category: 'Local Shops',
    rating: 4.9,
    reviews: 312,
    address: '789 Main St, Downtown',
    image: 'https://images.unsplash.com/photo-1556740758-90de374c12ad?q=80&w=1000',
    distance: '0.8 km',
    tier: 'premium',
    featured: true
  },
  {
    id: 'b4',
    name: 'Glow Beauty Salon',
    category: 'Beauty & Salon',
    rating: 4.7,
    reviews: 156,
    address: '321 Style Blvd, Uptown',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13fee7a3af?q=80&w=1000',
    distance: '3.1 km',
    tier: 'standard',
    featured: true
  }
];

const businessService = {
  getAllBusinesses: async (params) => {
    try {
      const response = await api.get('/businesses', { params });
      if (response && response.data && response.data.length > 0) {
        return response;
      }
      return { data: mockBusinesses };
    } catch (error) {
      console.log('API failed, returning mock businesses');
      return { data: mockBusinesses };
    }
  },
  getNearbyBusinesses: async (params) => {
    try {
      return await api.get('/businesses/nearby', { params });
    } catch (e) {
      return { data: mockBusinesses };
    }
  },
  getBusinessById: async (id) => {
    try {
      return await api.get(`/businesses/${id}`);
    } catch (e) {
      return { data: mockBusinesses.find(b => b.id === id) };
    }
  },
  addBusiness: async (data) => {
    return api.post('/businesses', data);
  },
  updateBusiness: async (id, data) => {
    return api.put(`/businesses/${id}`, data);
  },
  deleteBusiness: async (id) => {
    return api.delete(`/businesses/${id}`);
  },
};

export default businessService;
