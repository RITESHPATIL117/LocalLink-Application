const mysql = require('mysql2/promise');
require('dotenv').config();

async function fix() {
    const pool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });

    try {
        console.log("Altering table...");
        await pool.query("ALTER TABLE categories ADD COLUMN is_material TINYINT(1) DEFAULT 0");
        console.log("Added is_material");
    } catch(e) { console.log("Error adding is_material:", e.message); }

    try {
        await pool.query("ALTER TABLE categories ADD COLUMN color VARCHAR(20) DEFAULT '#3B82F6'");
        console.log("Added color");
    } catch(e) { console.log("Error adding color:", e.message); }

    process.exit(0);
}
fix();
