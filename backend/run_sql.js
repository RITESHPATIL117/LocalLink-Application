require('dotenv').config();
const fs = require('fs');
const path = require('path');
const db = require('./src/config/db'); // Inherits connection from environment

async function run() {
    try {
        const sqlPath = path.join(__dirname, 'scripts', 'sync_categories.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');
        
        // Remove comments and split by semi-colon
        const statements = sql
            .replace(/--.*$/gm, '')
            .split(';')
            .map(stmt => stmt.trim())
            .filter(stmt => stmt.length > 0);
            
        for (let stmt of statements) {
            console.log("Executing:", stmt.substring(0, 50).replace(/\n/g, ' ') + '...');
            await db.query(stmt);
        }
        
        console.log("Smart Categories synced successfully!");
        process.exit(0);
    } catch(err) {
        console.error("Migration Failed:", err);
        process.exit(1);
    }
}
run();
