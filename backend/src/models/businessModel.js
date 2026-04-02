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

        if (params?.q) {
            query += ` AND (b.name LIKE ? OR b.description LIKE ? OR b.subcategory LIKE ? OR c.name LIKE ?)`;
            const searchVal = `%${params.q}%`;
            queryParams.push(searchVal, searchVal, searchVal, searchVal);
        }
        
        if (params?.featured) {
            query += ' AND b.rating >= 4.0'; // Simulate featured
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

    static async create(data) {
        const { provider_id, name, description, category_id, address, city, image_url, subcategory } = data;
        const [result] = await db.query(
            `INSERT INTO businesses (provider_id, name, description, category_id, address, city, image_url, is_verified, subcategory) 
             VALUES (?, ?, ?, ?, ?, ?, ?, 0, ?)`,
            [provider_id, name, description, category_id, address, city, image_url, subcategory || null]
        );
        return result.insertId;
    }

    static async addImages(businessId, images) {
        if (!images || images.length === 0) return;
        const values = images.map(url => [businessId, url]);
        await db.query('INSERT INTO business_images (business_id, image_url) VALUES ?', [values]);
    }

    static async getImages(businessId) {
        const [rows] = await db.query('SELECT image_url FROM business_images WHERE business_id = ?', [businessId]);
        return rows.map(r => r.image_url);
    }
    static async updateStatus(id, is_verified) {
        // is_verified: 0 (Pending), 1 (Verified/Active), 2 (Suspended)
        await db.query('UPDATE businesses SET is_verified = ? WHERE id = ?', [is_verified, id]);
        return true;
    }
}

module.exports = Business;
