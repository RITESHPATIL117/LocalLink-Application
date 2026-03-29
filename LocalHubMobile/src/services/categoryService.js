import api from './api';
import logger from '../utils/logger';

const mockCategories = [
  {
    id: '1',
    name: 'Cleaning',
    title: 'Cleaning Services',
    icon: 'sparkles',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=400',
    color: '#3B82F6',
    subcategories: [
      { id: '1-1', name: 'Home Deep Cleaning', icon: 'sparkles', isMaterial: true, color: '#3B82F6' },
      { id: '1-2', name: 'Sofa & Carpet Cleaning', icon: 'water', isMaterial: true, color: '#3B82F6' },
      { id: '1-3', name: 'Kitchen & Bathroom', icon: 'color-filter', isMaterial: true, color: '#3B82F6' },
      { id: '1-4', name: 'Pest Control', icon: 'bug', isMaterial: true, color: '#3B82F6' },
    ]
  },
  {
    id: '2',
    name: 'Plumbing',
    title: 'Plumbing & Repair',
    icon: 'water',
    image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=400',
    color: '#3B82F6',
    subcategories: [
      { id: '2-1', name: 'Pipe Leaks', icon: 'water', isMaterial: true, color: '#3B82F6' },
      { id: '2-2', name: 'Water Heater', icon: 'thermometer', isMaterial: true, color: '#3B82F6' },
      { id: '2-3', name: 'Toilet Repair', icon: 'business', isMaterial: true, color: '#3B82F6' },
      { id: '2-4', name: 'Drain Cleaning', icon: 'sync', isMaterial: true, color: '#3B82F6' },
    ]
  },
  {
    id: '3',
    name: 'Electrical',
    title: 'Electrical Work',
    icon: 'flash',
    image: 'https://images.unsplash.com/photo-1621905252507-b352224075b9?q=80&w=400',
    color: '#F59E0B',
    subcategories: [
      { id: '3-1', name: 'Wiring & Panels', icon: 'flash', isMaterial: true, color: '#F59E0B' },
      { id: '3-2', name: 'Lighting Fix', icon: 'sunny', isMaterial: true, color: '#F59E0B' },
      { id: '3-3', name: 'Appliance Repair', icon: 'hammer', isMaterial: true, color: '#F59E0B' },
      { id: '3-4', name: 'Fan & Cooler', icon: 'aperture', isMaterial: true, color: '#F59E0B' },
    ]
  },
  {
    id: '4',
    name: 'HVAC',
    title: 'AC & Cooling',
    icon: 'snow',
    image: 'https://images.unsplash.com/photo-1563770660941-20978e870e26?q=80&w=400',
    color: '#06B6D4',
    subcategories: [
      { id: '4-1', name: 'AC Service & Repair', icon: 'snow', isMaterial: true, color: '#06B6D4' },
      { id: '4-2', name: 'AC Installation', icon: 'build', isMaterial: true, color: '#06B6D4' },
      { id: '4-3', name: 'Gas Refill', icon: 'flask', isMaterial: true, color: '#06B6D4' },
      { id: '4-4', name: 'AMC Plans', icon: 'calendar', isMaterial: true, color: '#06B6D4' },
    ]
  },
  {
    id: '5',
    name: 'Pet Care',
    title: 'Dog & Cat Services',
    icon: 'paw',
    image: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?q=80&w=400',
    color: '#EC4899',
    subcategories: [
      { id: '5-1', name: 'Pet Grooming', icon: 'cut', isMaterial: true, color: '#EC4899' },
      { id: '5-2', name: 'Dog Walking', icon: 'walk', isMaterial: true, color: '#EC4899' },
      { id: '5-3', name: 'Vet Consultation', icon: 'medical', isMaterial: true, color: '#EC4899' },
      { id: '5-4', name: 'Pet Sitting', icon: 'heart', isMaterial: true, color: '#EC4899' },
    ]
  },
  {
    id: '6',
    name: 'Automobile',
    title: 'Car & Bike Repair',
    icon: 'car-sport',
    image: 'https://images.unsplash.com/photo-1487754164641-a095905fd481?q=80&w=400',
    color: '#EF4444',
    subcategories: [
      { id: '6-1', name: 'Car Wash & Spa', icon: 'water', isMaterial: true, color: '#EF4444' },
      { id: '6-2', name: 'Mechanic Services', icon: 'wrench', isMaterial: true, color: '#EF4444' },
      { id: '6-3', name: 'Wheel Alignment', icon: 'color-wheel', isMaterial: true, color: '#EF4444' },
      { id: '6-4', name: 'Battery Service', icon: 'battery-full', isMaterial: true, color: '#EF4444' },
    ]
  },
  {
    id: '7',
    name: 'Events',
    title: 'Plan & Execute',
    icon: 'calendar',
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=400',
    color: '#8B5CF6',
    subcategories: [
      { id: '7-1', name: 'Photography', icon: 'camera', isMaterial: true, color: '#8B5CF6' },
      { id: '7-2', name: 'Catering Services', icon: 'restaurant', isMaterial: true, color: '#8B5CF6' },
      { id: '7-3', name: 'DJ & Sound', icon: 'musical-notes', isMaterial: true, color: '#8B5CF6' },
      { id: '7-4', name: 'Decor & Flowers', icon: 'rose', isMaterial: true, color: '#8B5CF6' },
    ]
  },
  {
    id: '8',
    name: 'Health',
    title: 'Personal Wellness',
    icon: 'fitness',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=400',
    color: '#10B981',
    subcategories: [
      { id: '8-1', name: 'Yoga Instructor', icon: 'body', isMaterial: true, color: '#10B981' },
      { id: '8-2', name: 'Gym Training', icon: 'barbell', isMaterial: true, color: '#10B981' },
      { id: '8-3', name: 'Physiotherapy', icon: 'bandage', isMaterial: true, color: '#10B981' },
      { id: '8-4', name: 'Diet Plan', icon: 'leaf', isMaterial: true, color: '#10B981' },
    ]
  },
  {
    id: '9',
    name: 'Home Design',
    title: 'Interior & Decor',
    icon: 'home',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=400',
    color: '#6366F1',
    subcategories: [
      { id: '9-1', name: 'Wall Painting', icon: 'color-palette', isMaterial: true, color: '#6366F1' },
      { id: '9-2', name: 'Interior Design', icon: 'cube', isMaterial: true, color: '#6366F1' },
      { id: '9-3', name: 'Modular Kitchen', icon: 'grid', isMaterial: true, color: '#6366F1' },
      { id: '9-4', name: 'False Ceiling', icon: 'layers', isMaterial: true, color: '#6366F1' },
    ]
  },
  {
    id: '10',
    name: 'Legal',
    title: 'Professional Help',
    icon: 'briefcase',
    image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=400',
    color: '#374151',
    subcategories: [
      { id: '10-1', name: 'Notary Help', icon: 'document-text', isMaterial: true, color: '#374151' },
      { id: '10-2', name: 'GST & Tax Consult', icon: 'calculator', isMaterial: true, color: '#374151' },
      { id: '10-3', name: 'Legal Advice', icon: 'library', isMaterial: true, color: '#374151' },
      { id: '10-4', name: 'Property Reg', icon: 'key', isMaterial: true, color: '#374151' },
    ]
  },
  {
    id: '11',
    name: 'Education',
    title: 'Learning & Tutors',
    icon: 'school',
    image: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=400',
    color: '#F43F5E',
    subcategories: [
      { id: '11-1', name: 'Private Tutors', icon: 'book', isMaterial: true, color: '#F43F5E' },
      { id: '11-2', name: 'Music Lessons', icon: 'musical-notes', isMaterial: true, color: '#F43F5E' },
      { id: '11-3', name: 'Language classes', icon: 'language', isMaterial: true, color: '#F43F5E' },
    ]
  },
  {
    id: '12',
    name: 'Real Estate',
    title: 'Buy, Sell, Rent',
    icon: 'home-city',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=400',
    color: '#6366F1',
    subcategories: [
      { id: '12-1', name: 'Rentals', icon: 'key', isMaterial: true, color: '#6366F1' },
      { id: '12-2', name: 'Property Buying', icon: 'business', isMaterial: true, color: '#6366F1' },
      { id: '12-3', name: 'Commercial', icon: 'briefcase', isMaterial: true, color: '#6366F1' },
    ]
  },
  {
    id: '13',
    name: 'Laundry',
    title: 'Wash & Fold',
    icon: 'washing-machine',
    image: 'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?q=80&w=400',
    color: '#0EA5E9',
    subcategories: [
      { id: '13-1', name: 'Dry Cleaning', icon: 'shirt', isMaterial: true, color: '#0EA5E9' },
      { id: '13-2', name: 'Ironing', icon: 'layers', isMaterial: true, color: '#0EA5E9' },
    ]
  },
  {
    id: '14',
    name: 'Restaurants',
    title: 'Dine & Order',
    icon: 'restaurant',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=400',
    color: '#EAB308',
    subcategories: [
      { id: '14-1', name: 'Cafe', icon: 'cafe', isMaterial: true, color: '#EAB308' },
      { id: '14-2', name: 'Fast Food', icon: 'fast-food', isMaterial: true, color: '#EAB308' },
      { id: '14-3', name: 'Fine Dining', icon: 'wine', isMaterial: true, color: '#EAB308' },
    ]
  }
];

const categoryService = {
  getCategories: async () => {
    try {
      logger.info('Fetching categories...');
      const response = await api.get('/categories');
      
      // Standardize response extraction
      const apiCats = Array.isArray(response) 
        ? response 
        : (response?.data && Array.isArray(response.data) ? response.data : []);
      
      // Merge Strategy: Sync IDs from DB into our rich mock data
      mockCategories.forEach(m => {
        const apiMatch = apiCats.find(a => a.name.toLowerCase() === m.name.toLowerCase());
        if (apiMatch) {
          m.id = apiMatch.id.toString();
        }
      });

      // Prepare return set: Use all mocks, and add any API-only categories
      const merged = [...mockCategories];
      apiCats.forEach(apiCat => {
        if (!merged.find(m => m.name.toLowerCase() === apiCat.name.toLowerCase())) {
          merged.push({
            ...apiCat,
            id: apiCat.id.toString(),
            subcategories: []
          });
        }
      });

      logger.info(`Successfully prepared ${merged.length} categories (Merged API + Mocks)`);
      return { data: merged };
    } catch (error) {
      logger.warn('API failed, falling back to pure mocks');
      return { data: mockCategories };
    }
  },
  createCategory: async (categoryData) => {
    try {
      logger.info('Creating new category...');
      const response = await api.post('/categories', categoryData);
      return { data: response || { ...categoryData, id: Math.random().toString() } };
    } catch (error) {
      logger.error('API failed while creating category. Simulating success locally.');
      const newCategory = { ...categoryData, id: Math.random().toString() };
      mockCategories.unshift(newCategory); // Add locally so it appears in immediate fetches
      return { data: newCategory };
    }
  },
  getSubcategories: async (catId) => {
    try {
      logger.info(`Fetching subcategories for cat: ${catId}`);
      await new Promise(resolve => setTimeout(resolve, 300)); 
      
      // Robust lookup: Match by id directly or try to find by ID in current state if we had access.
      // Since it's a singleton, mockCategories is now synced.
      let cat = mockCategories.find(c => c.id === catId.toString());
      
      // Final fallback: If we can't find it by ID, it might be because the ID didn't sync correctly.
      // But we should have synced them in getCategories.
      
      return { data: cat ? cat.subcategories : [] };
    } catch (error) {
      return { data: [] };
    }
  }
};

export default categoryService;
