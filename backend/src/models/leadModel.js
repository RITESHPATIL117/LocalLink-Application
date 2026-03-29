const db = require('../config/db');

const Lead = {
    create: async ({ business_id, user_id, customer_name, customer_email, customer_phone, message }) => {
        const [result] = await db.query(
            'INSERT INTO leads (business_id, user_id, customer_name, customer_email, customer_phone, message) VALUES (?, ?, ?, ?, ?, ?)',
            [business_id, user_id || null, customer_name, customer_email, customer_phone, message]
        );
        return result.insertId;
    },

    getByBusiness: async (businessId) => {
        const [rows] = await db.query(
            'SELECT * FROM leads WHERE business_id = ? ORDER BY created_at DESC',
            [businessId]
        );
        return rows;
    },

    getByUser: async (userId) => {
        const [rows] = await db.query(`
            SELECT l.*, b.name as businessName, b.image_url as image, c.name as category
            FROM leads l
            JOIN businesses b ON l.business_id = b.id
            LEFT JOIN categories c ON b.category_id = c.id
            WHERE l.user_id = ?
            ORDER BY l.created_at DESC
        `, [userId]);
        return rows;
    },
};

module.exports = Lead;
