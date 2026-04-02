const db = require('../config/db');

class Category {
    static async getAll() {
        const [rows] = await db.query(`
            SELECT c.*, COUNT(b.id) as business_count 
            FROM categories c
            LEFT JOIN businesses b ON c.id = b.category_id
            GROUP BY c.id
        `);
        return rows;
    }

    static async getBySlug(slug) {
        const [rows] = await db.query('SELECT id, name, icon, is_material as isMaterial, color, slug, image FROM categories WHERE slug = ?', [slug]);
        return rows[0];
    }

    static async getByName(name) {
        const [rows] = await db.query('SELECT id FROM categories WHERE name = ?', [name]);
        return rows[0];
    }

    static async createRequest(providerId, name) {
        const [result] = await db.query(
            'INSERT INTO category_requests (provider_id, name, status) VALUES (?, ?, \'pending\')',
            [providerId, name]
        );
        return result.insertId;
    }
}

module.exports = Category;
