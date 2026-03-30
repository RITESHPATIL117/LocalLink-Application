import api from './api';
import logger from '../utils/logger';

const mockCategories = [
  {
    id: '1', name: 'Home Services', title: 'Electrician, Plumber, Carpenter', icon: 'hammer-outline', color: '#6366F1', image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=400',
    subcategories: [
      { id: '1-1', name: 'Electrician', icon: 'flash', image: 'https://images.unsplash.com/photo-1621905252507-b352224075b9?q=80&w=300', isMaterial: true, color: '#6366F1' },
      { id: '1-2', name: 'Plumber', icon: 'water', image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=300', isMaterial: true, color: '#6366F1' },
      { id: '1-3', name: 'Carpenter', icon: 'hammer', image: 'https://images.unsplash.com/photo-1595844730298-b960ff98fee0?q=80&w=300', isMaterial: true, color: '#6366F1' },
      { id: '1-4', name: 'Painter', icon: 'color-palette', image: 'https://images.unsplash.com/photo-1562591176-3293099a0bf3?q=80&w=300', isMaterial: true, color: '#6366F1' }
    ]
  },
  {
    id: '2', name: 'Appliance Repair', title: 'AC, Fridge, Washing Machine', icon: 'snow-outline', color: '#06B6D4', image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=400',
    subcategories: [
      { id: '2-1', name: 'AC Service & Repair', icon: 'snow', image: 'https://images.unsplash.com/photo-1563770660941-20978e870e26?q=80&w=300', isMaterial: true, color: '#06B6D4' },
      { id: '2-2', name: 'Refrigerator Repair', icon: 'thermometer', image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=300', isMaterial: true, color: '#06B6D4' },
      { id: '2-3', name: 'Washing Machine', icon: 'sync', image: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?q=80&w=300', isMaterial: true, color: '#06B6D4' },
      { id: '2-4', name: 'TV & Electronics', icon: 'tv', image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?q=80&w=300', isMaterial: true, color: '#06B6D4' }
    ]
  },
  {
    id: '3', name: 'Cleaning & Pest', title: 'Deep Cleaning, Safa Spa, Guard', icon: 'sparkles-outline', color: '#3B82F6', image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=400',
    subcategories: [
      { id: '3-1', name: 'Full Home Deep Clean', icon: 'home', image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=300', isMaterial: true, color: '#3B82F6' },
      { id: '3-2', name: 'Sofa & Carpet Spa', icon: 'water', image: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?q=80&w=300', isMaterial: true, color: '#3B82F6' },
      { id: '3-3', name: 'Pest Control', icon: 'bug', image: 'https://images.unsplash.com/photo-1583842183201-9018448ec629?q=80&w=300', isMaterial: true, color: '#3B82F6' },
      { id: '3-4', name: 'Bathroom Cleaning', icon: 'color-filter', image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=300', isMaterial: true, color: '#3B82F6' }
    ]
  },
  {
    id: '4', name: 'Beauty & Grooming', title: 'Salon, Massage, Skincare', icon: 'cut-outline', color: '#EC4899', image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=400',
    subcategories: [
      { id: '4-1', name: 'Salon for Women', icon: 'rose', image: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=300', isMaterial: true, color: '#EC4899' },
      { id: '4-2', name: 'Men\'s Grooming', icon: 'cut', image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=300', isMaterial: true, color: '#EC4899' },
      { id: '4-3', name: 'Spa & Massage', icon: 'body', image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=300', isMaterial: true, color: '#EC4899' },
      { id: '4-4', name: 'Makeup & Styling', icon: 'brush', image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=300', isMaterial: true, color: '#EC4899' }
    ]
  },
  {
    id: '5', name: 'Packers & Movers', title: 'Relocation & Transport', icon: 'bus-outline', color: '#F59E0B', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=400',
    subcategories: [
      { id: '5-1', name: 'Local Shifting', icon: 'home', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=300', isMaterial: true, color: '#F59E0B' },
      { id: '5-2', name: 'Inter-City Moves', icon: 'airplane', image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=300', isMaterial: true, color: '#F59E0B' },
      { id: '5-3', name: 'Vehicle Transport', icon: 'car', image: 'https://images.unsplash.com/photo-1494905998402-395d579af36f?q=80&w=300', isMaterial: true, color: '#F59E0B' }
    ]
  },
  {
    id: '6', name: 'Health & Medical', title: 'Physician, Dentist, Pharmacy', icon: 'medical-outline', color: '#10B981', image: 'https://images.unsplash.com/photo-1512678080530-7760d81faba6?q=80&w=400',
    subcategories: [
      { id: '6-1', name: 'General Physician', icon: 'medkit', image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=300', isMaterial: true, color: '#10B981' },
      { id: '6-2', name: 'Dentists', icon: 'sad', image: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=300', isMaterial: true, color: '#10B981' },
      { id: '6-3', name: 'Physiotherapy', icon: 'body', image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=300', isMaterial: true, color: '#10B981' },
      { id: '6-4', name: 'Diagnostic Labs', icon: 'flask', image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=300', isMaterial: true, color: '#10B981' }
    ]
  },
  {
    id: '7', name: 'Automobile', title: 'Car & Bike Repair', icon: 'car-sport-outline', color: '#EF4444', image: 'https://images.unsplash.com/photo-1487754164641-a095905fd481?q=80&w=400',
    subcategories: [
      { id: '7-1', name: 'Car Maintenance', icon: 'car', image: 'https://images.unsplash.com/photo-1486495146582-966cbce089ea?q=80&w=300', isMaterial: true, color: '#EF4444' },
      { id: '7-2', name: 'Bike Repair', icon: 'bicycle', image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=300', isMaterial: true, color: '#EF4444' },
      { id: '7-3', name: 'Periodic Wash', icon: 'water', image: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?q=80&w=300', isMaterial: true, color: '#EF4444' },
      { id: '7-4', name: 'Emergency Jump Start', icon: 'battery-charging', image: 'https://images.unsplash.com/photo-1655110508544-7fcd54fd866e?q=80&w=300', isMaterial: true, color: '#EF4444' }
    ]
  },
  {
    id: '8', name: 'Events & Weddings', title: 'Plan & Execute perfectly', icon: 'calendar-outline', color: '#8B5CF6', image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=400',
    subcategories: [
      { id: '8-1', name: 'Photographers', icon: 'camera', image: 'https://images.unsplash.com/photo-1516961642265-531546e84af2?q=80&w=300', isMaterial: true, color: '#8B5CF6' },
      { id: '8-2', name: 'Event Organizers', icon: 'mic', image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=300', isMaterial: true, color: '#8B5CF6' },
      { id: '8-3', name: 'Caterers', icon: 'restaurant', image: 'https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=300', isMaterial: true, color: '#8B5CF6' },
      { id: '8-4', name: 'Decorators', icon: 'color-wand', image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=300', isMaterial: true, color: '#8B5CF6' }
    ]
  },
  {
    id: '9', name: 'Tutors & Education', title: 'Learn from local pros', icon: 'book-outline', color: '#F43F5E', image: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=400',
    subcategories: [
      { id: '9-1', name: 'Math & Sciences', icon: 'add-circle', image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=300', isMaterial: true, color: '#F43F5E' },
      { id: '9-2', name: 'Language Tutors', icon: 'language', image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=300', isMaterial: true, color: '#F43F5E' },
      { id: '9-3', name: 'Music Lessons', icon: 'musical-notes', image: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?q=80&w=300', isMaterial: true, color: '#F43F5E' }
    ]
  },
  {
    id: '10', name: 'Emergency', title: '24/7 Priority Services', icon: 'alert-circle-outline', color: '#EF4444', image: 'https://images.unsplash.com/photo-1583842183201-9018448ec629?q=80&w=400',
    subcategories: [
      { id: '10-1', name: 'Ambulance', icon: 'fitness', image: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?q=80&w=300', isMaterial: true, color: '#EF4444' },
      { id: '10-2', name: 'Midnight Plumber', icon: 'water', image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=300', isMaterial: true, color: '#EF4444' },
      { id: '10-3', name: 'Towing Services', icon: 'car', image: 'https://images.unsplash.com/photo-1518985175263-2200dc896b02?q=80&w=300', isMaterial: true, color: '#EF4444' }
    ]
  },
  {
    id: '11', name: 'Real Estate', title: 'Rent, Buy, Expand', icon: 'business-outline', color: '#0F172A', image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=400',
    subcategories: [
      { id: '11-1', name: 'Residential Rentals', icon: 'key', image: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?q=80&w=300', isMaterial: true, color: '#0F172A' },
      { id: '11-2', name: 'Commercial Spaces', icon: 'business', image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=300', isMaterial: true, color: '#0F172A' },
      { id: '11-3', name: 'Land & Plots', icon: 'map', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=300', isMaterial: true, color: '#0F172A' }
    ]
  },
  {
    id: '12', name: 'Daily Needs', title: 'Groceries, Dairy & Utility', icon: 'basket-outline', color: '#0EA5E9', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=400',
    subcategories: [
      { id: '12-1', name: 'Groceries & Staples', icon: 'cart', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=300', isMaterial: true, color: '#0EA5E9' },
      { id: '12-2', name: 'Hardware Stores', icon: 'hammer', image: 'https://images.unsplash.com/photo-1513467655676-561b7d489a88?q=80&w=300', isMaterial: true, color: '#0EA5E9' },
      { id: '12-3', name: 'Laundry Services', icon: 'shirt', image: 'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?q=80&w=300', isMaterial: true, color: '#0EA5E9' },
      { id: '12-4', name: 'Drinking Water Supply', icon: 'water', image: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?q=80&w=300', isMaterial: true, color: '#0EA5E9' }
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
