const db = require('./src/config/db');

async function checkSchema() {
    try {
        const [rows] = await db.query('DESCRIBE businesses');
        console.log(JSON.stringify(rows, null, 2));
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

checkSchema();
