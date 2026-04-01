const db = require('./src/config/db');

async function migrate() {
    try {
        console.log('Starting migration...');
        
        // Add subcategory column if it doesn't exist
        await db.query(`
            ALTER TABLE businesses 
            ADD COLUMN IF NOT EXISTS subcategory VARCHAR(255) AFTER image_url
        `).catch(err => {
            if (err.code === 'ER_CANT_DROP_FIELD_OR_KEY') {
               console.log('Subcategory column already exists or IF NOT EXISTS not supported, skipping...');
            } else {
               // Try without IF NOT EXISTS if server version is old
               return db.query('ALTER TABLE businesses ADD COLUMN subcategory VARCHAR(255) AFTER image_url');
            }
        });

        console.log('Migration completed successfully!');
        process.exit(0);
    } catch (err) {
        console.error('Migration failed:', err.message);
        process.exit(1);
    }
}

migrate();
