const db = require('../config/db');

class Category {
    static async getAll() {
        const [rows] = await db.query('SELECT id, name, icon, is_material as isMaterial, color, slug, image FROM categories');
        return rows;
    }

    static async getBySlug(slug) {
        const [rows] = await db.query('SELECT id, name, icon, is_material as isMaterial, color, slug, image FROM categories WHERE slug = ?', [slug]);
        return rows[0];
    }
}

module.exports = Category;
