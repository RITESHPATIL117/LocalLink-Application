const db = require('../config/db');

const Report = {
    getAll: async () => {
        const [rows] = await db.query(`
            SELECT 
                r.*, 
                u.name as reporterName,
                u.email as reporterEmail
            FROM reports r
            LEFT JOIN users u ON r.reporter_id = u.id
            ORDER BY r.created_at DESC
        `);
        return rows;
    },

    create: async ({ reporter_id, type, entity, description, severity }) => {
        const [result] = await db.query(
            'INSERT INTO reports (reporter_id, type, entity, description, severity) VALUES (?, ?, ?, ?, ?)',
            [reporter_id, type, entity, description, severity || 'Medium']
        );
        return result.insertId;
    },

    updateStatus: async (id, status) => {
        const [result] = await db.query(
            'UPDATE reports SET status = ? WHERE id = ?',
            [status, id]
        );
        return result.affectedRows > 0;
    }
};

module.exports = Report;
