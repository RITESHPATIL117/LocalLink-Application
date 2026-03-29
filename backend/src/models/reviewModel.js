const db = require('../config/db');

class Review {
    static async create({ user_id, business_id, rating, comment }) {
        const [result] = await db.query(
            'INSERT INTO reviews (user_id, business_id, rating, comment) VALUES (?, ?, ?, ?)',
            [user_id, business_id, rating, comment]
        );
        
        // Update business rating
        await this.updateBusinessRating(business_id);
        
        return result.insertId;
    }

    static async getByBusiness(businessId) {
        const [rows] = await db.query(`
            SELECT r.*, u.name as user_name 
            FROM reviews r
            JOIN users u ON r.user_id = u.id
            WHERE r.business_id = ?
            ORDER BY r.created_at DESC
        `, [businessId]);
        return rows;
    }

    static async updateBusinessRating(businessId) {
        const [rows] = await db.query(
            'SELECT AVG(rating) as avg_rating, COUNT(*) as review_count FROM reviews WHERE business_id = ?',
            [businessId]
        );
        
        const { avg_rating, review_count } = rows[0];
        
        await db.query(
            'UPDATE businesses SET rating = ?, review_count = ? WHERE id = ?',
            [avg_rating || 0, review_count, businessId]
        );
    }

    static async getTopReviews(limit = 6) {
        const [rows] = await db.query(`
            SELECT r.*, u.name as user_name, u.role as user_role, b.name as business_name, b.image_url as business_image
            FROM reviews r
            JOIN users u ON r.user_id = u.id
            JOIN businesses b ON r.business_id = b.id
            WHERE r.rating >= 4
            ORDER BY r.created_at DESC
            LIMIT ?
        `, [limit]);
        return rows;
    }
}

module.exports = Review;
