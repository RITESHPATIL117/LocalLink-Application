const mysql = require('mysql2/promise');
require('dotenv').config();

async function updateIcons() {
    const pool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });

    try {
        await pool.query('UPDATE categories SET icon = "water-outline" WHERE slug = "plumbing"');
        await pool.query('UPDATE categories SET icon = "flash-outline" WHERE slug = "electrician"');
        await pool.query('UPDATE categories SET icon = "sparkles-outline" WHERE slug = "cleaning"');
        await pool.query('UPDATE categories SET icon = "leaf-outline" WHERE slug = "landscaping"');
        await pool.query('UPDATE categories SET icon = "bug-outline" WHERE slug = "pest-control"');
        await pool.query('UPDATE categories SET icon = "hammer-outline" WHERE slug = "handyman"');
        console.log("Category icons updated successfully to valid Ionicons names!");
    } catch(err) {
        console.error("Error updating icons:", err);
    }
    process.exit(0);
}

updateIcons();
