const db = require('../config/db');

const Lead = {
    create: async ({ business_id, customer_name, customer_email, customer_phone, message }) => {
        const [result] = await db.query(
            'INSERT INTO leads (business_id, customer_name, customer_email, customer_phone, message) VALUES (?, ?, ?, ?, ?)',
            [business_id, customer_name, customer_email, customer_phone, message]
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

    updateStatus: async (leadId, status) => {
        await db.query(
            'UPDATE leads SET status = ? WHERE id = ?',
            [status, leadId]
        );
        return true;
    }
};

module.exports = Lead;
