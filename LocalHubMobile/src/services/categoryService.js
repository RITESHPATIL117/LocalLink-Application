import api from './api';
import logger from '../utils/logger';

const CATEGORY_IMAGE_BY_NAME = {
  'home services': 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=800',
  'appliance repair': 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=800',
  'cleaning & pest': 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800',
  'beauty & grooming': 'https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=800',
  'packers & movers': 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800',
  'health & medical': 'https://images.unsplash.com/photo-1512678080530-7760d81faba6?q=80&w=800',
  automobile: 'https://images.unsplash.com/photo-1487754164641-a095905fd481?q=80&w=800',
  'events & weddings': 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=800',
  'tutors & education': 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=800',
  emergency: 'https://images.unsplash.com/photo-1583842183201-9018448ec629?q=80&w=800',
  'real estate': 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=800',
  'daily needs': 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=800',
  'food & dining': 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800',
};

const SUBCATEGORY_IMAGE_BY_NAME = {
  electrician: 'https://images.unsplash.com/photo-1621905252507-eb6368d5ba18?q=80&w=800',
  plumber: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=800',
  carpenter: 'https://images.unsplash.com/photo-1595844730298-b960ff98fee0?q=80&w=800',
  painter: 'https://images.unsplash.com/photo-1562591176-3293099a0bf3?q=80&w=800',
  restaurants: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800',
  'cafés & bakeries': 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=800',
  'street food & snacks': 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?q=80&w=800',
  'catering & tiffin': 'https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=800',
  ambulance: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?q=80&w=800',
  'ac service & repair': 'https://images.unsplash.com/photo-1563770660941-20978e870e26?q=80&w=800',
  'refrigerator repair': 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800',
  'washing machine': 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?q=80&w=800',
  'tv & electronics': 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?q=80&w=800',
};

const CATEGORY_IMAGE_BY_KEYWORD = [
  ['home', CATEGORY_IMAGE_BY_NAME['home services']],
  ['appliance', CATEGORY_IMAGE_BY_NAME['appliance repair']],
  ['clean', CATEGORY_IMAGE_BY_NAME['cleaning & pest']],
  ['pest', CATEGORY_IMAGE_BY_NAME['cleaning & pest']],
  ['beauty', CATEGORY_IMAGE_BY_NAME['beauty & grooming']],
  ['groom', CATEGORY_IMAGE_BY_NAME['beauty & grooming']],
  ['mover', CATEGORY_IMAGE_BY_NAME['packers & movers']],
  ['medical', CATEGORY_IMAGE_BY_NAME['health & medical']],
  ['health', CATEGORY_IMAGE_BY_NAME['health & medical']],
  ['auto', CATEGORY_IMAGE_BY_NAME.automobile],
  ['car', CATEGORY_IMAGE_BY_NAME.automobile],
  ['event', CATEGORY_IMAGE_BY_NAME['events & weddings']],
  ['wedding', CATEGORY_IMAGE_BY_NAME['events & weddings']],
  ['educat', CATEGORY_IMAGE_BY_NAME['tutors & education']],
  ['tutor', CATEGORY_IMAGE_BY_NAME['tutors & education']],
  ['emergency', CATEGORY_IMAGE_BY_NAME.emergency],
  ['estate', CATEGORY_IMAGE_BY_NAME['real estate']],
  ['daily', CATEGORY_IMAGE_BY_NAME['daily needs']],
  ['grocery', CATEGORY_IMAGE_BY_NAME['daily needs']],
  ['food', CATEGORY_IMAGE_BY_NAME['food & dining']],
  ['restaurant', CATEGORY_IMAGE_BY_NAME['food & dining']],
  ['dining', CATEGORY_IMAGE_BY_NAME['food & dining']],
  ['hotel', CATEGORY_IMAGE_BY_NAME['food & dining']],
];

const SUBCATEGORY_IMAGE_BY_KEYWORD = [
  ['electric', SUBCATEGORY_IMAGE_BY_NAME.electrician],
  ['plumb', SUBCATEGORY_IMAGE_BY_NAME.plumber],
  ['carpent', SUBCATEGORY_IMAGE_BY_NAME.carpenter],
  ['paint', SUBCATEGORY_IMAGE_BY_NAME.painter],
  ['restaurant', SUBCATEGORY_IMAGE_BY_NAME.restaurants],
  ['cafe', SUBCATEGORY_IMAGE_BY_NAME['cafés & bakeries']],
  ['bakery', SUBCATEGORY_IMAGE_BY_NAME['cafés & bakeries']],
  ['street food', SUBCATEGORY_IMAGE_BY_NAME['street food & snacks']],
  ['snack', SUBCATEGORY_IMAGE_BY_NAME['street food & snacks']],
  ['cater', SUBCATEGORY_IMAGE_BY_NAME['catering & tiffin']],
  ['tiffin', SUBCATEGORY_IMAGE_BY_NAME['catering & tiffin']],
  ['ambulance', SUBCATEGORY_IMAGE_BY_NAME.ambulance],
  ['ac', SUBCATEGORY_IMAGE_BY_NAME['ac service & repair']],
  ['refrigerator', SUBCATEGORY_IMAGE_BY_NAME['refrigerator repair']],
  ['fridge', SUBCATEGORY_IMAGE_BY_NAME['refrigerator repair']],
  ['washing', SUBCATEGORY_IMAGE_BY_NAME['washing machine']],
  ['tv', SUBCATEGORY_IMAGE_BY_NAME['tv & electronics']],
  ['electronic', SUBCATEGORY_IMAGE_BY_NAME['tv & electronics']],
  ['hotel', SUBCATEGORY_IMAGE_BY_NAME.restaurants],
];

const imageForCategoryName = (name) => {
  const key = String(name || '').toLowerCase().trim();
  if (CATEGORY_IMAGE_BY_NAME[key]) return CATEGORY_IMAGE_BY_NAME[key];
  for (const [needle, image] of CATEGORY_IMAGE_BY_KEYWORD) {
    if (key.includes(needle)) return image;
  }
  return '';
};

const imageForSubcategoryName = (name) => {
  const key = String(name || '').toLowerCase().trim();
  if (SUBCATEGORY_IMAGE_BY_NAME[key]) return SUBCATEGORY_IMAGE_BY_NAME[key];
  for (const [needle, image] of SUBCATEGORY_IMAGE_BY_KEYWORD) {
    if (key.includes(needle)) return image;
  }
  return '';
};

const mockCategories = [
  {
    id: '1', name: 'Home Services', title: 'Electrician, Plumber, Carpenter', icon: 'hammer-outline', color: '#6366F1', image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=800',
    subcategories: [
      { id: '1-1', name: 'Electrician', icon: 'flash', image: 'https://images.unsplash.com/photo-1621905252507-eb6368d5ba18?q=80&w=800', isMaterial: true, color: '#6366F1' },
      { id: '1-2', name: 'Plumber', icon: 'water', image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=800', isMaterial: true, color: '#6366F1' },
      { id: '1-3', name: 'Carpenter', icon: 'hammer', image: 'https://images.unsplash.com/photo-1595844730298-b960ff98fee0?q=80&w=800', isMaterial: true, color: '#6366F1' },
      { id: '1-4', name: 'Painter', icon: 'color-palette', image: 'https://images.unsplash.com/photo-1562591176-3293099a0bf3?q=80&w=800', isMaterial: true, color: '#6366F1' }
    ]
  },
  {
    id: '2', name: 'Appliance Repair', title: 'AC, Fridge, Washing Machine', icon: 'snow-outline', color: '#06B6D4', image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=800',
    subcategories: [
      { id: '2-1', name: 'AC Service & Repair', icon: 'snow', image: 'https://images.unsplash.com/photo-1563770660941-20978e870e26?q=80&w=800', isMaterial: true, color: '#06B6D4' },
      { id: '2-2', name: 'Refrigerator Repair', icon: 'thermometer', image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800', isMaterial: true, color: '#06B6D4' },
      { id: '2-3', name: 'Washing Machine', icon: 'sync', image: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?q=80&w=800', isMaterial: true, color: '#06B6D4' },
      { id: '2-4', name: 'TV & Electronics', icon: 'tv', image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?q=80&w=800', isMaterial: true, color: '#06B6D4' }
    ]
  },
  {
    id: '3', name: 'Cleaning & Pest', title: 'Deep Cleaning, Safa Spa, Guard', icon: 'sparkles-outline', color: '#3B82F6', image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800',
    subcategories: [
      { id: '3-1', name: 'Full Home Deep Clean', icon: 'home', image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=800', isMaterial: true, color: '#3B82F6' },
      { id: '3-2', name: 'Sofa & Carpet Spa', icon: 'water', image: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?q=80&w=800', isMaterial: true, color: '#3B82F6' },
      { id: '3-3', name: 'Pest Control', icon: 'bug', image: 'https://images.unsplash.com/photo-1583842183201-9018448ec629?q=80&w=800', isMaterial: true, color: '#3B82F6' },
      { id: '3-4', name: 'Bathroom Cleaning', icon: 'color-filter', image: 'https://images.unsplash.com/photo-1584622781564-1d987f7333c1?q=80&w=800', isMaterial: true, color: '#3B82F6' }
    ]
  },
  {
    id: '4', name: 'Beauty & Grooming', title: 'Salon, Massage, Skincare', icon: 'cut-outline', color: '#EC4899', image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=800',
    subcategories: [
      { id: '4-1', name: 'Salon for Women', icon: 'rose', image: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=800', isMaterial: true, color: '#EC4899' },
      { id: '4-2', name: 'Men\'s Grooming', icon: 'cut', image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=800', isMaterial: true, color: '#EC4899' },
      { id: '4-3', name: 'Spa & Massage', icon: 'body', image: 'https://images.unsplash.com/photo-1544161515-4af6ce1ad8b1?q=80&w=800', isMaterial: true, color: '#EC4899' },
      { id: '4-4', name: 'Makeup & Styling', icon: 'brush', image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=800', isMaterial: true, color: '#EC4899' }
    ]
  },
  {
    id: '5', name: 'Packers & Movers', title: 'Relocation & Transport', icon: 'bus-outline', color: '#F59E0B', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800',
    subcategories: [
      { id: '5-1', name: 'Local Shifting', icon: 'home', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800', isMaterial: true, color: '#F59E0B' },
      { id: '5-2', name: 'Inter-City Moves', icon: 'airplane', image: 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?q=80&w=800', isMaterial: true, color: '#F59E0B' },
      { id: '5-3', name: 'Vehicle Transport', icon: 'car', image: 'https://images.unsplash.com/photo-1605152276897-4f618f831968?q=80&w=800', isMaterial: true, color: '#F59E0B' }
    ]
  },
  {
    id: '6', name: 'Health & Medical', title: 'Physician, Dentist, Pharmacy', icon: 'medical-outline', color: '#10B981', image: 'https://images.unsplash.com/photo-1512678080530-7760d81faba6?q=80&w=800',
    subcategories: [
      { id: '6-1', name: 'General Physician', icon: 'medkit', image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=800', isMaterial: true, color: '#10B981' },
      { id: '6-2', name: 'Dentists', icon: 'sad', image: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=800', isMaterial: true, color: '#10B981' },
      { id: '6-3', name: 'Physiotherapy', icon: 'body', image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=800', isMaterial: true, color: '#10B981' },
      { id: '6-4', name: 'Diagnostic Labs', icon: 'flask', image: 'https://images.unsplash.com/photo-1579154712747-4bc80093782d?q=80&w=800', isMaterial: true, color: '#10B981' }
    ]
  },
  {
    id: '7', name: 'Automobile', title: 'Car & Bike Repair', icon: 'car-sport-outline', color: '#EF4444', image: 'https://images.unsplash.com/photo-1487754164641-a095905fd481?q=80&w=800',
    subcategories: [
      { id: '7-1', name: 'Car Maintenance', icon: 'car', image: 'https://images.unsplash.com/photo-1486495146582-966cbce089ea?q=80&w=800', isMaterial: true, color: '#EF4444' },
      { id: '7-2', name: 'Bike Repair', icon: 'bicycle', image: 'https://images.unsplash.com/photo-1558981403-c5f91cbba527?q=80&w=800', isMaterial: true, color: '#EF4444' },
      { id: '7-3', name: 'Periodic Wash', icon: 'water', image: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?q=80&w=800', isMaterial: true, color: '#EF4444' },
      { id: '7-4', name: 'Emergency Jump Start', icon: 'battery-charging', image: 'https://images.unsplash.com/photo-1597762137022-aa973c5adfcd?q=80&w=800', isMaterial: true, color: '#EF4444' }
    ]
  },
  {
    id: '8', name: 'Events & Weddings', title: 'Plan & Execute perfectly', icon: 'calendar-outline', color: '#8B5CF6', image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=800',
    subcategories: [
      { id: '8-1', name: 'Photographers', icon: 'camera', image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=800', isMaterial: true, color: '#8B5CF6' },
      { id: '8-2', name: 'Event Organizers', icon: 'mic', image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=800', isMaterial: true, color: '#8B5CF6' },
      { id: '8-3', name: 'Caterers', icon: 'restaurant', image: 'https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=800', isMaterial: true, color: '#8B5CF6' },
      { id: '8-4', name: 'Decorators', icon: 'color-wand', image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=800', isMaterial: true, color: '#8B5CF6' }
    ]
  },
  {
    id: '9', name: 'Tutors & Education', title: 'Learn from local pros', icon: 'book-outline', color: '#F43F5E', image: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=800',
    subcategories: [
      { id: '9-1', name: 'Math & Sciences', icon: 'add-circle', image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=800', isMaterial: true, color: '#F43F5E' },
      { id: '9-2', name: 'Language Tutors', icon: 'language', image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=800', isMaterial: true, color: '#F43F5E' },
      { id: '9-3', name: 'Music Lessons', icon: 'musical-notes', image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=800', isMaterial: true, color: '#F43F5E' }
    ]
  },
  {
    id: '10', name: 'Emergency', title: '24/7 Priority Services', icon: 'alert-circle-outline', color: '#EF4444', image: 'https://images.unsplash.com/photo-1583842183201-9018448ec629?q=80&w=800',
    subcategories: [
      { id: '10-1', name: 'Ambulance', icon: 'fitness', image: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?q=80&w=800', isMaterial: true, color: '#EF4444' },
      { id: '10-2', name: 'Midnight Plumber', icon: 'water', image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=800', isMaterial: true, color: '#EF4444' },
      { id: '10-3', name: 'Towing Services', icon: 'car', image: 'https://images.unsplash.com/photo-1551524559-8af4e6624178?q=80&w=800', isMaterial: true, color: '#EF4444' }
    ]
  },
  {
    id: '11', name: 'Real Estate', title: 'Rent, Buy, Expand', icon: 'business-outline', color: '#0F172A', image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=800',
    subcategories: [
      { id: '11-1', name: 'Residential Rentals', icon: 'key', image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=800', isMaterial: true, color: '#0F172A' },
      { id: '11-2', name: 'Commercial Spaces', icon: 'business', image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800', isMaterial: true, color: '#0F172A' },
      { id: '11-3', name: 'Land & Plots', icon: 'map', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=800', isMaterial: true, color: '#0F172A' }
    ]
  },
  {
    id: '12', name: 'Daily Needs', title: 'Groceries, Dairy & Utility', icon: 'basket-outline', color: '#0EA5E9', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=800',
    subcategories: [
      { id: '12-1', name: 'Groceries & Staples', icon: 'cart', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=800', isMaterial: true, color: '#0EA5E9' },
      { id: '12-2', name: 'Hardware Stores', icon: 'hammer', image: 'https://images.unsplash.com/photo-1534073828943-f801091bb18c?q=80&w=800', isMaterial: true, color: '#0EA5E9' },
      { id: '12-3', name: 'Laundry Services', icon: 'shirt', image: 'https://images.unsplash.com/photo-1545173168-9f1947eebb7f?q=80&w=800', isMaterial: true, color: '#0EA5E9' },
      { id: '12-4', name: 'Drinking Water Supply', icon: 'water', image: 'https://images.unsplash.com/photo-1548843900-5800d3a58eeb?q=80&w=800', isMaterial: true, color: '#0EA5E9' }
    ]
  },
  {
    id: '13',
    name: 'Food & Dining',
    title: 'Restaurants, Cafés & Catering',
    icon: 'restaurant-outline',
    color: '#EA580C',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800',
    subcategories: [
      { id: '13-1', name: 'Restaurants', icon: 'restaurant', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800', isMaterial: true, color: '#EA580C' },
      { id: '13-2', name: 'Cafés & Bakeries', icon: 'cafe', image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=800', isMaterial: true, color: '#EA580C' },
      { id: '13-3', name: 'Street Food & Snacks', icon: 'fast-food', image: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?q=80&w=800', isMaterial: true, color: '#EA580C' },
      { id: '13-4', name: 'Catering & Tiffin', icon: 'nutrition', image: 'https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=800', isMaterial: true, color: '#EA580C' }
    ]
  }
];

const categoryService = {
  getCategories: async () => {
    try {
      logger.info('Fetching categories...');
      const response = await api.get('/categories?tree=true');
      
      // Standardize response extraction
      const apiCats = Array.isArray(response) 
        ? response 
        : (response?.data && Array.isArray(response.data) ? response.data : []);

      if (apiCats.length > 0) {
        const normalized = apiCats.map((cat) => {
          const mockMatch = mockCategories.find((m) => m.name?.toLowerCase() === cat.name?.toLowerCase());
          return {
            ...cat,
            id: cat.id?.toString() || mockMatch?.id || Math.random().toString(),
            color: cat.color || mockMatch?.color || '#3B82F6',
            bg: cat.bg || mockMatch?.bg || '#EFF6FF',
            icon: cat.icon || mockMatch?.icon || 'grid-outline',
            image: imageForCategoryName(cat.name) || cat.image || cat.image_url || mockMatch?.image || '',
            subcategories: (cat.subcategories || [])
              .filter((sub) => {
                const p = sub.parent_id ?? sub.parentId ?? sub.category_id ?? sub.categoryId;
                if (p == null) return true;
                return String(p) === String(cat.id);
              })
              .map((sub) => {
                const mockSubMatch = (mockMatch?.subcategories || []).find(
                  (ms) => ms.name?.toLowerCase() === sub.name?.toLowerCase()
                );
                return {
                  ...sub,
                  id: sub.id?.toString() || mockSubMatch?.id || `${cat.id}-${sub.name}`,
                  icon: sub.icon || mockSubMatch?.icon || 'construct-outline',
                  image: imageForSubcategoryName(sub.name) || sub.image || sub.image_url || mockSubMatch?.image || '',
                };
              }),
          };
        });
        return { data: normalized };
      }
      
      // Merge Strategy: Sync IDs from DB into our rich mock data, prevent ID collisions
      const merged = mockCategories.map(m => ({ ...m }));
      
      merged.forEach(m => {
        const apiMatch = apiCats.find(a => a.name.toLowerCase() === m.name.toLowerCase());
        if (apiMatch) {
          m.id = apiMatch.id.toString();
          m.image = imageForCategoryName(m.name) || apiMatch.image || apiMatch.image_url || m.image;
        } else {
          // If no API match, ensure the ID does not collide with real DB IDs
          if (!m.id.startsWith('mock-')) {
            m.id = 'mock-' + m.id;
          }
        }
      });

      // Prepare return set: Use all mocks, and add any API-only categories
      apiCats.forEach(apiCat => {
        if (!merged.find(m => m.name.toLowerCase() === apiCat.name.toLowerCase())) {
          merged.push({
            ...apiCat,
            id: apiCat.id.toString(),
            subcategories: []
          });
        }
      });

      // Deduplicate final list by ID just in case
      const uniqueMerged = Array.from(new Map(merged.map(item => [item.id, item])).values());

      logger.info(`Successfully prepared ${uniqueMerged.length} categories (Merged API + Mocks)`);
      return { data: uniqueMerged };
    } catch (_error) {
      logger.warn('API failed, falling back to pure mocks');
      return { data: mockCategories };
    }
  },
  createCategory: async (categoryData) => {
    try {
      logger.info('Creating new category...');
      const response = await api.post('/categories', categoryData);
      return { data: response || { ...categoryData, id: Math.random().toString() } };
    } catch (_error) {
      logger.error('API failed while creating category. Simulating success locally.');
      const newCategory = { ...categoryData, id: Math.random().toString() };
      mockCategories.unshift(newCategory); // Add locally so it appears in immediate fetches
      return { data: newCategory };
    }
  },
  getSubcategories: async (catId) => {
    try {
      logger.info(`Fetching subcategories for cat: ${catId}`);
      const response = await api.get(`/categories/${catId}/subcategories`);
      const apiSubs = Array.isArray(response)
        ? response
        : (response?.data && Array.isArray(response.data) ? response.data : []);

      if (apiSubs.length > 0) {
        const parentMock = mockCategories.find(c => c.id === catId.toString());
        const scoped = apiSubs.filter((sub) => {
          const p = sub.parent_id ?? sub.parentId ?? sub.category_id ?? sub.categoryId;
          if (p == null) return true;
          return String(p) === String(catId);
        });
        const list = scoped.length > 0 ? scoped : apiSubs;
        const normalizedSubs = list.map((sub) => {
          const mockSubMatch = (parentMock?.subcategories || []).find(
            (ms) => ms.name?.toLowerCase() === sub.name?.toLowerCase()
          );
          return {
            ...sub,
            id: sub.id?.toString() || mockSubMatch?.id || `${catId}-${sub.name}`,
            icon: sub.icon || mockSubMatch?.icon || 'construct-outline',
            image: imageForSubcategoryName(sub.name) || sub.image || sub.image_url || mockSubMatch?.image || '',
          };
        });
        return { data: normalizedSubs };
      }

      const fallbackCat = mockCategories.find(c => c.id === catId.toString());
      return { data: fallbackCat ? fallbackCat.subcategories : [] };
    } catch (_error) {
      const fallbackCat = mockCategories.find(c => c.id === catId.toString());
      return { data: fallbackCat ? fallbackCat.subcategories : [] };
    }
  },
  suggestCategory: async (name) => {
    try {
      logger.info(`Suggesting new category: ${name}`);
      const response = await api.post('/categories/suggest', { name });
      return { data: response || { success: true } };
    } catch (error) {
      logger.error('Failed to suggest category', error);
      return { success: false, error: error.message };
    }
  }
};

export { mockCategories };
export default categoryService;
