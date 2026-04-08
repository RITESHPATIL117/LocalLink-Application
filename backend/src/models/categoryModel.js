const db = require('../config/db');

class Category {
    static async getAll(includeSubcategories = false) {
        if (!includeSubcategories) {
            const [rows] = await db.query(`
                SELECT c.*, COUNT(b.id) as business_count 
                FROM categories c
                LEFT JOIN businesses b ON (c.id = b.category_id OR b.subcategory = c.slug)
                GROUP BY c.id
            `);
            return rows;
        }

        // Fetch all and build tree
        const [rows] = await db.query(`
            SELECT c.*, COUNT(b.id) as business_count 
            FROM categories c
            LEFT JOIN businesses b ON (c.id = b.category_id OR b.subcategory = c.slug)
            GROUP BY c.id
        `);

        const mainCategories = rows.filter(cat => !cat.parent_id);
        const subcategories = rows.filter(cat => cat.parent_id);

        return mainCategories.map(main => ({
            ...main,
            subcategories: subcategories.filter(sub => sub.parent_id === main.id)
        }));
    }

    static async getMainCategories() {
        const [rows] = await db.query(`
            SELECT c.*, COUNT(b.id) as business_count 
            FROM categories c
            LEFT JOIN businesses b ON c.id = b.category_id
            WHERE c.parent_id IS NULL
            GROUP BY c.id
        `);
        return rows;
    }

    static async getSubcategories(parentId) {
        const [rows] = await db.query(`
            SELECT c.*, COUNT(b.id) as business_count 
            FROM categories c
            LEFT JOIN businesses b ON (c.id = b.category_id OR b.subcategory = c.slug)
            WHERE c.parent_id = ?
            GROUP BY c.id
        `, [parentId]);
        return rows;
    }

    static async getTrending() {
        const [rows] = await db.query('SELECT * FROM categories WHERE trending = 1');
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
