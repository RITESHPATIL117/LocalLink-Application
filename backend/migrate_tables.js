const db = require('./src/config/db');

async function migrate() {
    try {
        console.log('Verifying tables...');
        
        await db.query(`
            CREATE TABLE IF NOT EXISTS business_images (
                id INT AUTO_INCREMENT PRIMARY KEY,
                business_id INT,
                image_url VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE
            )
        `);

        await db.query(`
            CREATE TABLE IF NOT EXISTS category_requests (
                id INT AUTO_INCREMENT PRIMARY KEY,
                provider_id INT,
                name VARCHAR(100) NOT NULL,
                status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (provider_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);

        console.log('Tables verified successfully!');
        process.exit(0);
    } catch (err) {
        console.error('Migration failed:', err.message);
        process.exit(1);
    }
}

migrate();
