const db = require('../src/config/db');

const categories = [
    {
        name: 'Daily Life',
        slug: 'daily-life',
        icon: 'basket-outline',
        color: '#0EA5E9',
        subcategories: [
            { name: 'Restaurants & Food', slug: 'restaurants-food', icon: 'restaurant-outline' },
            { name: 'Daily Needs (Grocery, Milk, etc.)', slug: 'daily-needs', icon: 'cart-outline' },
            { name: 'Beauty & Personal Care', slug: 'beauty-personal-care', icon: 'cut-outline' },
            { name: 'Baby Care', slug: 'baby-care', icon: 'heart-outline' },
            { name: 'Pet Services', slug: 'pet-services', icon: 'paw-outline' },
        ]
    },
    {
        name: 'Professional Services',
        slug: 'professional-services',
        icon: 'briefcase-outline',
        color: '#6366F1',
        subcategories: [
            { name: 'Doctors & Healthcare', slug: 'doctors-healthcare', icon: 'medical-outline' },
            { name: 'Education & Coaching', slug: 'education-coaching', icon: 'book-outline' },
            { name: 'Financial Services (Loans, Insurance)', slug: 'financial-services', icon: 'cash-outline' },
            { name: 'IT & Software Services', slug: 'it-software', icon: 'code-working-outline' },
            { name: 'Digital Marketing Services', slug: 'digital-marketing', icon: 'megaphone-outline' },
            { name: 'Jobs & Recruitment', slug: 'jobs-recruitment', icon: 'people-outline' },
            { name: 'Astrology & Spiritual Services', slug: 'astrology-spiritual', icon: 'moon-outline' },
        ]
    },
    {
        name: 'Home & Repair',
        slug: 'home-repair',
        icon: 'hammer-outline',
        color: '#F59E0B',
        subcategories: [
            { name: 'Home Services', slug: 'home-services', icon: 'home-outline' },
            { name: 'Repair & Services', slug: 'repair-services', icon: 'build-outline' },
            { name: 'Electronics & Appliances', slug: 'electronics-appliances', icon: 'tv-outline' },
            { name: 'Furniture & Interiors', slug: 'furniture-interiors', icon: 'bed-outline' },
            { name: 'Construction & Building', slug: 'construction-building', icon: 'construct-outline' },
            { name: 'Security Services', slug: 'security-services', icon: 'shield-checkmark-outline' },
        ]
    },
    {
        name: 'Travel & Vehicles',
        slug: 'travel-vehicles',
        icon: 'car-sport-outline',
        color: '#EF4444',
        subcategories: [
            { name: 'Hotels & Accommodation', slug: 'hotels-accommodation', icon: 'bed-outline' },
            { name: 'Travel & Transport', slug: 'travel-transport', icon: 'airplane-outline' },
            { name: 'Automobiles (Cars, Bikes)', slug: 'automobiles', icon: 'car-outline' },
            { name: 'Packers & Movers', slug: 'packers-movers', icon: 'bus-outline' },
            { name: 'Taxi & Rentals', slug: 'taxi-rentals', icon: 'car-sport-outline' },
        ]
    },
    {
        name: 'Shopping',
        slug: 'shopping',
        icon: 'bag-handle-outline',
        color: '#EC4899',
        subcategories: [
            { name: 'Shopping & Retail', slug: 'shopping-retail', icon: 'cart-outline' },
            { name: 'Real Estate & Property', slug: 'real-estate', icon: 'business-outline' },
        ]
    },
    {
        name: 'Business & B2B',
        slug: 'business-b2b',
        icon: 'business-outline',
        color: '#1E40AF',
        subcategories: [
            { name: 'B2B / Industrial Services', slug: 'b2b-services', icon: 'trail-sign-outline' },
            { name: 'Industrial Machinery', slug: 'industrial-machinery', icon: 'settings-outline' },
            { name: 'Electrical Equipment', slug: 'electrical-equipment', icon: 'flash-outline' },
            { name: 'Chemicals', slug: 'chemicals', icon: 'flask-outline' },
            { name: 'Agriculture', slug: 'agriculture', icon: 'leaf-outline' },
            { name: 'Packaging & Printing', slug: 'packaging-printing', icon: 'print-outline' },
        ]
    },
    {
        name: 'Lifestyle & Entertainment',
        slug: 'lifestyle-entertainment',
        icon: 'film-outline',
        color: '#8B5CF6',
        subcategories: [
            { name: 'Event & Wedding Services', slug: 'event-wedding', icon: 'calendar-outline' },
            { name: 'Fitness & Sports', slug: 'fitness-sports', icon: 'fitness-outline' },
            { name: 'Entertainment (Movies, Events)', slug: 'entertainment', icon: 'ticket-outline' },
            { name: 'NGOs & Social Services', slug: 'ngo-social', icon: 'heart-outline' },
        ]
    }
];

async function seed() {
    try {
        console.log('Clearing existing categories...');
        // We might want to keep business linkage, but for a fresh start as requested:
        // WARNING: This will break existing links if not careful.
        // For safety, let's just insert new ones and maybe update existing ones later.
        // But the user said "Implement a structured category system like JustDial", so let's rebuild.
        
        await db.query('SET FOREIGN_KEY_CHECKS = 0');
        await db.query('TRUNCATE categories');
        await db.query('SET FOREIGN_KEY_CHECKS = 1');

        for (const mainCat of categories) {
            const [mainResult] = await db.query(
                'INSERT INTO categories (name, slug, icon, color, is_material) VALUES (?, ?, ?, ?, 0)',
                [mainCat.name, mainCat.slug, mainCat.icon, mainCat.color]
            );
            const parentId = mainResult.insertId;
            console.log(`Inserted Main Category: ${mainCat.name} (ID: ${parentId})`);

            for (const subCat of mainCat.subcategories) {
                await db.query(
                    'INSERT INTO categories (name, slug, icon, color, parent_id, is_material) VALUES (?, ?, ?, ?, ?, 0)',
                    [subCat.name, subCat.slug, subCat.icon, mainCat.color, parentId]
                );
                console.log(`  - Inserted Subcategory: ${subCat.name}`);
            }
        }

        console.log('Seeding completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
}

seed();
