const db = require('../src/config/db');

async function migrate() {
    try {
        console.log("Checking leads table schema...");
        const [columns] = await db.query("SHOW COLUMNS FROM leads LIKE 'category_id'");
        
        if (columns.length > 0) {
            console.log("Column 'category_id' already exists in 'leads' table.");
        } else {
            console.log("Adding 'category_id' to 'leads' table...");
            await db.query("ALTER TABLE leads ADD COLUMN category_id INT AFTER business_id;");
            console.log("Successfully added 'category_id' column.");
        }
        
        process.exit(0);
    } catch (err) {
        console.error("Error during migration:", err.message);
        process.exit(1);
    }
}

migrate();
