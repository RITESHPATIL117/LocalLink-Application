const db = require('../config/db');

class Business {
    static async getByCategory(categoryId, subcategory) {
        let query = `
            SELECT b.*, c.name as category_name 
            FROM businesses b
            LEFT JOIN categories c ON b.category_id = c.id
            WHERE b.category_id = ?
        `;
        const params = [categoryId];

        if (subcategory) {
            query += ' AND b.subcategory = ?';
            params.push(subcategory);
        }

        const [rows] = await db.query(query, params);
        return rows;
    }

    static async getAll(params) {
        let query = `
            SELECT b.*, c.name as category_name 
            FROM businesses b
            LEFT JOIN categories c ON b.category_id = c.id
            WHERE 1=1
        `;
        const queryParams = [];

        if (params?.categoryId) {
            query += ' AND b.category_id = ?';
            queryParams.push(params.categoryId);
        }

        if (params?.subcategory) {
            query += ' AND b.subcategory = ?';
            queryParams.push(params.subcategory);
        }
        
        if (params?.featured) {
            query += ' AND b.rating >= 4.5'; // Simulate featured
        }

        const [rows] = await db.query(query, queryParams);
        return rows;
    }

    static async getById(id) {
        const [rows] = await db.query(`
            SELECT b.*, c.name as category_name 
            FROM businesses b
            LEFT JOIN categories c ON b.category_id = c.id
            WHERE b.id = ?
        `, [id]);
        return rows[0];
    }

    static async getByProviderId(providerId) {
        const [rows] = await db.query(`
            SELECT b.*, c.name as category_name 
            FROM businesses b
            LEFT JOIN categories c ON b.category_id = c.id
            WHERE b.provider_id = ?
        `, [providerId]);
        return rows;
    }

    static async getPending() {
        const [rows] = await db.query(`
            SELECT b.*, c.name as category_name, u.name as owner_name
            FROM businesses b
            LEFT JOIN categories c ON b.category_id = c.id
            LEFT JOIN users u ON b.provider_id = u.id
            WHERE b.is_verified = 0
        `);
        return rows;
    }

    static async verify(id) {
        await db.query('UPDATE businesses SET is_verified = 1 WHERE id = ?', [id]);
        return true;
    }

    static async getStats() {
        const [users] = await db.query('SELECT COUNT(*) as count FROM users');
        const [businesses] = await db.query('SELECT COUNT(*) as count FROM businesses');
        const [pending] = await db.query('SELECT COUNT(*) as count FROM businesses WHERE is_verified = 0');
        return {
            totalUsers: users[0].count,
            totalBusinesses: businesses[0].count,
            pendingApprovals: pending[0].count,
            revenue: 0 // Placeholder for now
        };
    }
}

module.exports = Business;
