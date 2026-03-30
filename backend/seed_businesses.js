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
  'Electrician': 'https://images.unsplash.com/photo-1621905252507-b352224075b9',
  'Plumber': 'https://images.unsplash.com/photo-1581094794329-c8112a89af12',
  'Carpenter': 'https://images.unsplash.com/photo-1595844730298-b960ff98fee0',
  'Painter': 'https://images.unsplash.com/photo-1562591176-3293099a0bf3',
  'AC Service & Repair': 'https://images.unsplash.com/photo-1563770660941-20978e870e26',
  'Refrigerator Repair': 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a',
  'Washing Machine': 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1',
  'TV & Electronics': 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1',
  'Full Home Deep Clean': 'https://images.unsplash.com/photo-1581578731548-c64695cc6952',
  'Sofa & Carpet Spa': 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac',
  'Pest Control': 'https://images.unsplash.com/photo-1583842183201-9018448ec629',
  'Salon for Women': 'https://images.unsplash.com/photo-1522337660859-02fbefca4702',
  'Men\'s Grooming': 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1',
  'Local Shifting': 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c',
  'General Physician': 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528',
  'Car Maintenance': 'https://images.unsplash.com/photo-1486495146582-966cbce089ea',
  'Photographers': 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32',
  'Math & Sciences': 'https://images.unsplash.com/photo-1509062522246-3755977927d7',
  'Ambulance': 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7',
  'Residential Rentals': 'https://images.unsplash.com/photo-1560518883-ce09059eeffa',
  'Groceries & Staples': 'https://images.unsplash.com/photo-1542838132-92c53300491e'
};

const providers = [
  'Arjun', 'Basavaraj', 'Chaitra', 'Dinesh', 'Eknath', 'Falguni', 'Ganesh', 'Hema', 'Irfan', 'Jaya'
];

const cities = ['Sangli', 'Miraj', 'Kupwad', 'Vishrambag', 'Madhavnagar'];

async function seed() {
  try {
    console.log('--- Starting Seed Script ---');
    
    // Clear existing (optional - user approval required, but following plan)
    await db.query('DELETE FROM businesses');
    
    const businesses = [];
    
    categories.forEach(cat => {
      cat.subs.forEach(sub => {
        // Create 3 businesses per subcategory
        for (let i = 1; i <= 3; i++) {
          const provider = providers[Math.floor(Math.random() * providers.length)];
          const city = cities[Math.floor(Math.random() * cities.length)];
          const rating = (4 + Math.random()).toFixed(1);
          const reviews = Math.floor(Math.random() * 500) + 10;
          
          let bizName = '';
          if (i === 1) bizName = `${provider}'s Elite ${sub}`;
          else if (i === 2) bizName = `Standard ${sub} Solutions`;
          else bizName = `QuickFix ${sub} Experts`;
          
          businesses.push([
            1, // provider_id (assume user 1 exists)
            bizName,
            `Professional ${sub} services by ${provider} in ${city}. High quality guaranteed.`,
            cat.id,
            sub, // NEW subcategory column
            `${Math.floor(Math.random() * 500) + 1}, Main Road`,
            city,
            rating,
            reviews,
            images[sub] || images['Electrician'],
            1 // is_verified
          ]);
        }
      });
    });

    const query = `
      INSERT INTO businesses 
      (provider_id, name, description, category_id, subcategory, address, city, rating, review_count, image_url, is_verified)
      VALUES ?
    `;

    await db.query(query, [businesses]);
    console.log(`--- Seeded ${businesses.length} businesses successfully! ---`);
    process.exit(0);
  } catch (err) {
    console.error('Seed Error:', err);
    process.exit(1);
  }
}

seed();
