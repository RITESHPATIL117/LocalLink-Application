const db = require('./src/config/db');

async function checkLeadsSchema() {
    try {
        const [rows] = await db.query('DESCRIBE leads');
        console.log('Leads Table Schema:');
        console.table(rows);
        process.exit(0);
    } catch (e) {
        console.error('Error checking leads schema:', e.message);
        process.exit(1);
    }
}

checkLeadsSchema();
