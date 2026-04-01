const db = require('./src/config/db');
require('dotenv').config();

async function migrate() {
    try {
        console.log('Running migration...');
        
        // 1. Add category_id
        try {
            await db.query('ALTER TABLE leads ADD COLUMN category_id INT NULL AFTER user_id');
            console.log('Added category_id column');
        } catch (e) {
            console.log('category_id already exists or error:', e.message);
        }

        // 2. Modify business_id to be nullable
        try {
            await db.query('ALTER TABLE leads MODIFY COLUMN business_id INT NULL');
            console.log('Modified business_id to be nullable');
        } catch (e) {
            console.log('Error modifying business_id:', e.message);
        }

        // 3. Add Foreign Key
        try {
            await db.query('ALTER TABLE leads ADD CONSTRAINT fk_leads_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL');
            console.log('Added foreign key constraint');
        } catch (e) {
            console.log('Foreign key already exists or error:', e.message);
        }

        console.log('Migration completed successfully!');
        process.exit(0);
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    }
}

migrate();
