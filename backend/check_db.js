const db = require('./src/config/db');
const fs = require('fs');

async function checkSchema() {
    try {
        const [rows] = await db.query('DESCRIBE leads');
        const schema = rows.map(r => `${r.Field}: ${r.Type} | ${r.Null} | ${r.Default}`).join('\n');
        fs.writeFileSync('schema_output.txt', schema);
        console.log('Schema written to schema_output.txt');
    } catch (err) {
        console.error('Database connection or query failed:', err.message);
    } finally {
        process.exit();
    }
}

checkSchema();
