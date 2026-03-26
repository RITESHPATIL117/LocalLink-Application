const db = require('./src/config/db');

async function checkIcons() {
    try {
        const [rows] = await db.query('SELECT DISTINCT icon FROM categories');
        console.log('Unique icons found:', rows.map(r => r.icon));
        process.exit(0);
    } catch (e) {
        process.exit(1);
    }
}

checkIcons();
