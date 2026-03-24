const mysql = require('mysql2/promise');
require('dotenv').config();

async function restoreIcons() {
    const pool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });

    try {
        await pool.query('UPDATE categories SET icon = "wrench", is_material = 0 WHERE slug = "plumbing"');
        await pool.query('UPDATE categories SET icon = "zap", is_material = 0 WHERE slug = "electrician"');
        await pool.query('UPDATE categories SET icon = "trash-2", is_material = 0 WHERE slug = "cleaning"');
        await pool.query('UPDATE categories SET icon = "flower", is_material = 1 WHERE slug = "landscaping"');
        await pool.query('UPDATE categories SET icon = "bug", is_material = 1 WHERE slug = "pest-control"');
        await pool.query('UPDATE categories SET icon = "hammer", is_material = 1 WHERE slug = "handyman"');
        console.log("Category icons restored to original seed values!");
    } catch(err) {
        console.error("Error restoring icons:", err);
    }
    process.exit(0);
}

restoreIcons();
