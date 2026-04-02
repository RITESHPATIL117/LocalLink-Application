const db = require('./src/config/db');

const categories = [
  { id: 1, name: 'Home Services', subs: ['Electrician', 'Plumber', 'Carpenter', 'Painter'] },
  { id: 2, name: 'Appliance Repair', subs: ['AC Service & Repair', 'Refrigerator Repair', 'Washing Machine', 'TV & Electronics'] },
  { id: 3, name: 'Cleaning & Pest', subs: ['Full Home Deep Clean', 'Sofa & Carpet Spa', 'Pest Control', 'Bathroom Cleaning'] },
  { id: 4, name: 'Beauty & Grooming', subs: ['Salon for Women', 'Men\'s Grooming', 'Spa & Massage', 'Makeup & Styling'] },
  { id: 5, name: 'Packers & Movers', subs: ['Local Shifting', 'Inter-City Moves', 'Vehicle Transport'] },
  { id: 6, name: 'Health & Medical', subs: ['General Physician', 'Dentists', 'Physiotherapy', 'Diagnostic Labs'] },
  { id: 7, name: 'Automobile', subs: ['Car Maintenance', 'Bike Repair', 'Periodic Wash', 'Emergency Jump Start'] },
  { id: 8, name: 'Events & Weddings', subs: ['Photographers', 'Event Organizers', 'Caterers', 'Decorators'] },
  { id: 9, name: 'Tutors & Education', subs: ['Math & Sciences', 'Language Tutors', 'Music Lessons'] },
  { id: 10, name: 'Emergency', subs: ['Ambulance', 'Midnight Plumber', 'Towing Services'] },
  { id: 11, name: 'Real Estate', subs: ['Residential Rentals', 'Commercial Spaces', 'Land & Plots'] },
  { id: 12, name: 'Daily Needs', subs: ['Groceries & Staples', 'Hardware Stores', 'Laundry Services', 'Drinking Water Supply'] }
];

const images = {
  // Home Services
  'Electrician': 'https://images.unsplash.com/photo-1621905252507-eb6368d5ba18',
  'Plumber': 'https://images.unsplash.com/photo-1581094794329-c8112a89af12',
  'Carpenter': 'https://images.unsplash.com/photo-1595844730298-b960ff98fee0',
  'Painter': 'https://images.unsplash.com/photo-1562591176-3293099a0bf3',
  // Appliance Repair
  'AC Service & Repair': 'https://images.unsplash.com/photo-1563770660941-20978e870e26',
  'Refrigerator Repair': 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a',
  'Washing Machine': 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1',
  'TV & Electronics': 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1',
  // Cleaning & Pest
  'Full Home Deep Clean': 'https://images.unsplash.com/photo-1581578731548-c64695cc6952',
  'Sofa & Carpet Spa': 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac',
  'Pest Control': 'https://images.unsplash.com/photo-1583842183201-9018448ec629',
  'Bathroom Cleaning': 'https://images.unsplash.com/photo-1584622781564-1d987f7333c1',
  // Beauty & Grooming
  'Salon for Women': 'https://images.unsplash.com/photo-1522337660859-02fbefca4702',
  'Men\'s Grooming': 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1',
  'Spa & Massage': 'https://images.unsplash.com/photo-1544161515-4af6ce1ad8b1',
  'Makeup & Styling': 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f',
  // Packers & Movers
  'Local Shifting': 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c',
  'Inter-City Moves': 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a',
  'Vehicle Transport': 'https://images.unsplash.com/photo-1605152276897-4f618f831968',
  // Health & Medical
  'General Physician': 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528',
  'Dentists': 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5',
  'Physiotherapy': 'https://images.unsplash.com/photo-1576091160550-2173dba999ef',
  'Diagnostic Labs': 'https://images.unsplash.com/photo-1579154712747-4bc80093782d',
  // Automobile
  'Car Maintenance': 'https://images.unsplash.com/photo-1486495146582-966cbce089ea',
  'Bike Repair': 'https://images.unsplash.com/photo-1558981403-c5f91cbba527',
  'Periodic Wash': 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f',
  'Emergency Jump Start': 'https://images.unsplash.com/photo-1597762137022-aa973c5adfcd',
  // Events & Weddings
  'Photographers': 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32',
  'Event Organizers': 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622',
  'Caterers': 'https://images.unsplash.com/photo-1555244162-803834f70033',
  'Decorators': 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3',
  // Tutors & Education
  'Math & Sciences': 'https://images.unsplash.com/photo-1509062522246-3755977927d7',
  'Language Tutors': 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173',
  'Music Lessons': 'https://images.unsplash.com/photo-1511379938547-c1f69419868d',
  // Emergency
  'Ambulance': 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7',
  'Midnight Plumber': 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1',
  'Towing Services': 'https://images.unsplash.com/photo-1551524559-8af4e6624178',
  // Real Estate
  'Residential Rentals': 'https://images.unsplash.com/photo-1560518883-ce09059eeffa',
  'Commercial Spaces': 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab',
  'Land & Plots': 'https://images.unsplash.com/photo-1500382017468-9049fed747ef',
  // Daily Needs
  'Groceries & Staples': 'https://images.unsplash.com/photo-1542838132-92c53300491e',
  'Hardware Stores': 'https://images.unsplash.com/photo-1534073828943-f801091bb18c',
  'Laundry Services': 'https://images.unsplash.com/photo-1545173168-9f1947eebb7f',
  'Drinking Water Supply': 'https://images.unsplash.com/photo-1548843900-5800d3a58eeb'
};

const galleryFallbacks = [
  'https://images.unsplash.com/photo-1621905252507-eb6368d5ba18',
  'https://images.unsplash.com/photo-1581094794329-c8112a89af12',
  'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1',
  'https://images.unsplash.com/photo-1516321165247-4aa89a48be28',
  'https://images.unsplash.com/photo-1595844730298-b960ff98fee0',
  'https://images.unsplash.com/photo-1584622781564-1d987f7333c1'
];

const providers = [
  'Arjun', 'Basavaraj', 'Chaitra', 'Dinesh', 'Eknath', 'Falguni', 'Ganesh', 'Hema', 'Irfan', 'Jaya'
];

const cities = ['Sangli', 'Miraj', 'Kupwad', 'Vishrambag', 'Madhavnagar'];

async function seed() {
  try {
    console.log('--- Starting Seed Script ---');
    
    // Clear existing data
    await db.query('DELETE FROM business_images');
    await db.query('DELETE FROM reviews');
    await db.query('DELETE FROM leads');
    await db.query('DELETE FROM businesses');
    
    for (const cat of categories) {
      for (const sub of cat.subs) {
        // Create 2 businesses per subcategory for a focused look
        for (let i = 1; i <= 2; i++) {
          const provider = providers[Math.floor(Math.random() * providers.length)];
          const city = cities[Math.floor(Math.random() * cities.length)];
          const rating = (4.5 + Math.random() * 0.5).toFixed(1); // Higher ratings for launch look
          const reviews = Math.floor(Math.random() * 200) + 50;
          
          const bizName = i === 1 ? `${provider}'s Elite ${sub}` : `Premier ${sub} Solutions`;
          const mainImage = images[sub] || images['Electrician'];

          const [res] = await db.query(
            `INSERT INTO businesses 
             (provider_id, name, description, category_id, subcategory, address, city, rating, review_count, image_url, is_verified)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
            [
              1, // provider_id
              bizName,
              `Professional ${sub} services by certified experts. ${provider} provides the best ${sub.toLowerCase()} in ${city} with 100% satisfaction guaranteed.`,
              cat.id,
              sub,
              `${Math.floor(Math.random() * 500) + 1}, Main Road`,
              city,
              rating,
              reviews,
              mainImage
            ]
          );
          
          const businessId = res.insertId;
          
          // Add 4 gallery images per business
          const galleryValues = [];
          for (let j = 0; j < 4; j++) {
            const galleryImg = `${galleryFallbacks[Math.floor(Math.random() * galleryFallbacks.length)]}?sig=${businessId}_${j}`;
            galleryValues.push([businessId, galleryImg]);
          }
          await db.query('INSERT INTO business_images (business_id, image_url) VALUES ?', [galleryValues]);
        }
      }
    }

    console.log(`--- Seeded businesses and galleries successfully! ---`);
    process.exit(0);
  } catch (err) {
    console.error('Seed Error:', err);
    process.exit(1);
  }
}

seed();
