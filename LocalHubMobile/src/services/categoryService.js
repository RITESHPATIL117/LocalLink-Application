import api from './api';
import logger from '../utils/logger';

const mockCategories = [
  {
    id: '1',
    name: 'Home Services',
    title: 'Home Services',
    icon: 'home',
    isMaterial: false,
    color: '#3B82F6',
    subcategories: [
      { id: '1-1', name: 'Cleaning', icon: 'broom', isMaterial: true, color: '#3B82F6' },
      { id: '1-2', name: 'Plumbing', icon: 'water', isMaterial: true, color: '#3B82F6' },
      { id: '1-3', name: 'Electrician', icon: 'lightning-bolt', isMaterial: true, color: '#3B82F6' },
    ]
  },
  {
    id: '2',
    name: 'Auto Repair',
    title: 'Auto Repair',
    icon: 'car-wrench',
    isMaterial: true,
    color: '#EF4444',
    subcategories: [
      { id: '2-1', name: 'Mechanic', icon: 'wrench', isMaterial: true, color: '#EF4444' },
      { id: '2-2', name: 'Car Wash', icon: 'car-wash', isMaterial: true, color: '#EF4444' },
    ]
  },
  {
    id: '3',
    name: 'Beauty & Salon',
    title: 'Beauty & Salon',
    icon: 'content-cut',
    isMaterial: true,
    color: '#EC4899',
    subcategories: [
      { id: '3-1', name: 'Haircut', icon: 'content-cut', isMaterial: true, color: '#EC4899' },
      { id: '3-2', name: 'Spa', icon: 'spa', isMaterial: true, color: '#EC4899' },
    ]
  },
  {
    id: '4',
    name: 'Local Shops',
    title: 'Local Shops',
    icon: 'storefront',
    isMaterial: false,
    color: '#10B981',
    subcategories: [
      { id: '4-1', name: 'Grocery', icon: 'cart', isMaterial: true, color: '#10B981' },
      { id: '4-2', name: 'Hardware', icon: 'hammer-wrench', isMaterial: true, color: '#10B981' },
    ]
  },
  {
    id: '5',
    name: 'Events & Catering',
    title: 'Events & Catering',
    icon: 'party-popper',
    isMaterial: true,
    color: '#F59E0B',
    subcategories: [
      { id: '5-1', name: 'Catering', icon: 'food', isMaterial: true, color: '#F59E0B' },
      { id: '5-2', name: 'Decor', icon: 'balloon', isMaterial: true, color: '#F59E0B' },
    ]
  },
  {
    id: '6',
    name: 'Health & Fitness',
    title: 'Health & Fitness',
    icon: 'dumbbell',
    isMaterial: true,
    color: '#8B5CF6',
    subcategories: [
      { id: '6-1', name: 'Gym', icon: 'dumbbell', isMaterial: true, color: '#8B5CF6' },
      { id: '6-2', name: 'Yoga', icon: 'yoga', isMaterial: true, color: '#8B5CF6' },
    ]
  },
  {
    id: '7',
    name: 'Education',
    title: 'Education',
    icon: 'school',
    isMaterial: false,
    color: '#F43F5E',
    subcategories: [
      { id: '7-1', name: 'Tutors', icon: 'book', isMaterial: false, color: '#F43F5E' },
      { id: '7-2', name: 'Music Lessons', icon: 'musical-notes', isMaterial: false, color: '#F43F5E' },
    ]
  },
  {
    id: '8',
    name: 'Pet Services',
    title: 'Pet Services',
    icon: 'paw',
    isMaterial: true,
    color: '#06B6D4',
    subcategories: [
      { id: '8-1', name: 'Pet Grooming', icon: 'dog', isMaterial: true, color: '#06B6D4' },
      { id: '8-2', name: 'Vet', icon: 'stethoscope', isMaterial: true, color: '#06B6D4' },
    ]
  },
  {
    id: '9',
    name: 'Real Estate',
    title: 'Real Estate',
    icon: 'home-city',
    isMaterial: true,
    color: '#6366F1',
    subcategories: [
      { id: '9-1', name: 'Rentals', icon: 'key', isMaterial: true, color: '#6366F1' },
      { id: '9-2', name: 'Buying', icon: 'home-search', isMaterial: true, color: '#6366F1' },
      { id: '9-3', name: 'Commercial', icon: 'office-building', isMaterial: true, color: '#6366F1' },
    ]
  },
  {
    id: '10',
    name: 'Restaurants',
    title: 'Restaurants',
    icon: 'silverware-fork-knife',
    isMaterial: true,
    color: '#EAB308',
    subcategories: [
      { id: '10-1', name: 'Cafe', icon: 'coffee', isMaterial: true, color: '#EAB308' },
      { id: '10-2', name: 'Fast Food', icon: 'hamburger', isMaterial: true, color: '#EAB308' },
      { id: '10-3', name: 'Fine Dining', icon: 'glass-wine', isMaterial: true, color: '#EAB308' },
    ]
  },
  {
    id: '11',
    name: 'Laundry',
    title: 'Laundry',
    icon: 'washing-machine',
    isMaterial: true,
    color: '#0EA5E9',
    subcategories: [
      { id: '11-1', name: 'Dry Cleaning', icon: 'hanger', isMaterial: true, color: '#0EA5E9' },
      { id: '11-2', name: 'Ironing', icon: 'iron', isMaterial: true, color: '#0EA5E9' },
      { id: '11-3', name: 'Normal Wash', icon: 'tshirt-crew', isMaterial: true, color: '#0EA5E9' },
    ]
  },
  {
    id: '12',
    name: 'Moving & Storage',
    title: 'Moving & Storage',
    icon: 'truck',
    isMaterial: true,
    color: '#84CC16',
    subcategories: [
      { id: '12-1', name: 'Packers & Movers', icon: 'box', isMaterial: true, color: '#84CC16' },
      { id: '12-2', name: 'Storage Units', icon: 'warehouse', isMaterial: true, color: '#84CC16' },
    ]
  }
];

const categoryService = {
  getCategories: async () => {
    try {
      logger.info('Fetching categories...');
      const response = await api.get('/categories');
      // If we got a response (already unwrapped by interceptor), return it in the expected format
      if (response && (Array.isArray(response) ? response.length > 0 : response)) {
        logger.info(`Successfully fetched ${Array.isArray(response) ? response.length : 1} categories`);
        return { data: response };
      }
      logger.warn('API returned empty categories, using mock data');
      return { data: mockCategories };
    } catch (error) {
      logger.error('API failed while fetching categories, returning mock data', {
        message: error.message,
        error
      });
      return { data: mockCategories };
    }
  },
};

export default categoryService;
