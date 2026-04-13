import api from './api';
import logger from '../utils/logger';
import { getSeededBusinesses, mergeBusinessLists } from '../utils/businessSearchFilter';

const mockBusinesses = [
  {
    id: 'b1',
    name: 'Sparkle Home Cleaning',
    category: 'Home Services',
    rating: 4.8,
    reviews: 124,
    address: '123 Clean St, City Center',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=400',
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
    image: 'https://images.unsplash.com/photo-1516321165247-4aa89a48be28?q=80&w=400',
    distance: '2.5 km',
    tier: 'basic',
    featured: true
  },
  {
    id: 'b3',
    name: 'Glow Beauty Salon',
    category: 'Beauty',
    rating: 4.9,
    reviews: 312,
    address: '789 Main St, Downtown',
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=400',
    distance: '0.8 km',
    tier: 'premium',
    featured: true
  },
  {
    id: 'b4',
    name: 'Elite Electricians',
    category: 'Electrical',
    rating: 4.7,
    reviews: 156,
    address: '321 Style Blvd, Uptown',
    image: 'https://images.unsplash.com/photo-1621905252507-b352224075b9?q=80&w=400',
    distance: '3.1 km',
    tier: 'standard',
    featured: true
  }
];

const businessService = {
  isBusinessLive: (b) => {
    const status = String(b?.status || b?.business_status || '').toLowerCase().trim();
    const approval = String(b?.approvalStatus || b?.approval_status || '').toLowerCase().trim();
    const verifiedRaw = b?.is_verified ?? b?.isVerified ?? b?.verified ?? b?.isApproved;

    // Verification flags can be number / boolean / string.
    // IMPORTANT: if verified=true/1, treat listing as live even when status is stale.
    if (verifiedRaw != null) {
      if (typeof verifiedRaw === 'boolean') return verifiedRaw;
      const asNum = Number(verifiedRaw);
      if (!Number.isNaN(asNum)) return asNum === 1;
      const asText = String(verifiedRaw).toLowerCase().trim();
      if (asText === 'true' || asText === 'yes' || asText === 'approved' || asText === 'verified' || asText === 'live') return true;
      if (asText === 'false' || asText === 'no' || asText === 'pending' || asText === 'rejected') return false;
    }

    // Explicit approval status from backend
    if (approval) {
      if (approval === 'approved' || approval === 'live' || approval === 'verified') return true;
      if (approval === 'pending' || approval === 'rejected' || approval === 'suspended') return false;
    }

    // Explicit status from backend
    if (status) {
      if (status === 'active' || status === 'approved' || status === 'live' || status === 'verified') return true;
      if (status === 'pending' || status === 'rejected' || status === 'suspended') return false;
    }

    // Backward compatibility: when backend doesn't expose moderation fields, don't hide listings.
    return true;
  },
  getPublicStats: async () => {
    return api.get('/businesses/public-stats');
  },
  getAllBusinesses: async (params) => {
    try {
      logger.info('Fetching all businesses...', params);
      const response = await api.get('/businesses', { params });
      const apiRows = Array.isArray(response)
        ? response
        : (Array.isArray(response?.data) ? response.data : []);

      if (apiRows.length > 0) {
        logger.info(`Successfully fetched ${apiRows.length} businesses`);
        // Map backend image_url to image frontend expectations
        const mapped = apiRows.map(b => ({ ...b, image: b.image_url || b.image }));

        // Customer side should not see pending/unverified listings
        const approvedOnly = mapped.filter((b) => businessService.isBusinessLive(b));
        return { data: approvedOnly };
      }
      logger.warn('No businesses returned from API, using mock data');
      return { data: mergeBusinessLists(mockBusinesses, getSeededBusinesses()) };
    } catch (error) {
      return { data: mergeBusinessLists(mockBusinesses, getSeededBusinesses()) };
    }
  },
  getNearbyBusinesses: async (params) => {
    try {
      logger.info('Fetching nearby businesses...', params);
      const response = await api.get('/businesses/nearby', { params });
      return { data: response || mockBusinesses };
    } catch (e) {
      logger.error('Failed to fetch nearby businesses', e.message);
      return { data: mockBusinesses };
    }
  },
  getBusinessById: async (id) => {
    try {
      logger.debug(`Fetching business details for ID: ${id}`);
      const response = await api.get(`/businesses/${id}`);
      return { data: response || mockBusinesses.find(b => b.id === id) };
    } catch (e) {
      logger.error(`Failed to fetch business ${id}`, e.message);
      return { data: mockBusinesses.find(b => b.id === id) };
    }
  },
  addBusiness: async (data) => {
    logger.info('Adding new business', { name: data.name });
    return api.post('/businesses', data);
  },
  updateBusiness: async (id, data) => {
    logger.info(`Updating business ${id}`, { name: data.name });
    return api.put(`/businesses/${id}`, data);
  },
  deleteBusiness: async (id) => {
    logger.warn(`Deleting business ${id}`);
    return api.delete(`/businesses/${id}`);
  },
  getOwnerBusinesses: async () => {
    try {
      logger.info('Fetching business owner listings...');
      const response = await api.get('/businesses/my-businesses');
      return { data: response || [] };
    } catch (e) {
      logger.error('Failed to fetch owner businesses', e.message);
      return { data: [] };
    }
  },
};

export default businessService;
