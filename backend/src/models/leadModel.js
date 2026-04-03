const db = require('../config/db');

const Lead = {
    create: async ({ business_id, category_id, user_id, customer_name, customer_email, customer_phone, message, address, booking_date, booking_time, payment_method, payment_status, amount }) => {
        try {
            // Normalize Date to YYYY-MM-DD
            let formattedDate = booking_date;
            if (booking_date && booking_date.includes('T')) {
                formattedDate = booking_date.split('T')[0];
            }

            const [result] = await db.query(
                `INSERT INTO leads 
                (business_id, category_id, user_id, customer_name, customer_email, customer_phone, message, 
                 address, booking_date, booking_time, payment_method, payment_status, amount, status) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending')`,
                [
                    business_id || null,
                    category_id || null, 
                    user_id || null, 
                    customer_name || null, 
                    customer_email || null, 
                    customer_phone || null, 
                    message || null,
                    address || null,
                    formattedDate || null,
                    booking_time || null,
                    payment_method || 'Pay After Service',
                    payment_status || 'Pending',
                    amount || 0.00
                ]
            );
            return result.insertId;
        } catch (err) {
            console.error(`[SQL ERROR] Lead Creation Failed:`, err.message);
            throw err;
        }
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
            SELECT 
              l.*, 
              b.name as businessName, 
              b.image_url as businessImage,
              COALESCE(c.name, c2.name) as categoryName
            FROM leads l
            LEFT JOIN businesses b ON l.business_id = b.id
            LEFT JOIN categories c ON b.category_id = c.id
            LEFT JOIN categories c2 ON l.category_id = c2.id
            WHERE l.user_id = ?
            ORDER BY l.created_at DESC
        `, [userId]);
        return rows;
    },

    updateStatus: async (id, status) => {
        const [result] = await db.query(
            'UPDATE leads SET status = ? WHERE id = ?',
            [status, id]
        );
        return result.affectedRows > 0;
    },

    countByProviderId: async (providerId) => {
        const [rows] = await db.query(`
            SELECT COUNT(*) as count 
            FROM leads l
            JOIN businesses b ON l.business_id = b.id
            WHERE b.provider_id = ?
        `, [providerId]);
        return rows[0].count;
    },
};

module.exports = Lead;
