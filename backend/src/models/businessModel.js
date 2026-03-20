const db = require('../config/db');

class Business {
    static async getAll() {
        const [rows] = await db.query(`
            SELECT b.*, c.name as category_name 
            FROM businesses b
            LEFT JOIN categories c ON b.category_id = c.id
        `);
        return rows;
    }

    static async getByCategory(categoryId) {
        const [rows] = await db.query(`
            SELECT b.*, c.name as category_name 
            FROM businesses b
            LEFT JOIN categories c ON b.category_id = c.id
            WHERE b.category_id = ?
        `, [categoryId]);
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
}

module.exports = Business;
