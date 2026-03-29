const db = require('./src/config/db');

const updates = [
    { name: 'Quick Fix Plumbing', url: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=400' },
    { name: 'Elite Pipes', url: 'https://images.unsplash.com/photo-1542013936693-884638332954?q=80&w=400' },
    { name: 'Sparky Pro', url: 'https://images.unsplash.com/photo-1621905252507-b352224075b9?q=80&w=400' },
    { name: 'Sparkle Squad', url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=400' },
    { name: 'Glow Salon', url: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=400' },
];

const fixImages = async () => {
    try {
        console.log('Starting image patch...');
        for (const update of updates) {
            const [result] = await db.query(
                'UPDATE businesses SET image_url = ? WHERE name = ?',
                [update.url, update.name]
            );
            console.log(`Updated ${update.name}: ${result.affectedRows} row(s) affected`);
        }
        console.log('Image patch complete!');
        process.exit(0);
    } catch (err) {
        console.error('Error patching images:', err.message);
        process.exit(1);
    }
};

fixImages();
