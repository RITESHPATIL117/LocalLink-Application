const db = require('./src/config/db');

async function migrate() {
    try {
        console.log('--- STARTING DB MIGRATION ---');
        
        // 1. Align Status Enum to match Frontend Labels
        console.log('Updating "status" enum...');
        await db.query(`
            ALTER TABLE leads 
            MODIFY COLUMN status ENUM('Pending', 'Accepted', 'Completed', 'Cancelled', 'new', 'contacted', 'converted', 'closed') 
            DEFAULT 'Pending'
        `);
        console.log('Status enum updated successfully.');

        // 2. Ensure payment_method is robust
        console.log('Ensuring payment_method consistency...');
        // Already looks good but let's be explicit
        await db.query(`
            ALTER TABLE leads 
            MODIFY COLUMN payment_method ENUM('UPI', 'Card', 'Cash on Delivery', 'Pay After Service') 
            DEFAULT 'Pay After Service'
        `);
        console.log('Payment method enum verified.');

        console.log('--- MIGRATION COMPLETED SUCCESSFULLY ---');
    } catch (err) {
        console.error('Migration failed:', err.message);
    } finally {
        process.exit();
    }
}

migrate();
