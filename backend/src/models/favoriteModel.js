const db = require('../config/db');

class Favorite {
    static async ensureTable() {
        await db.query(`
            CREATE TABLE IF NOT EXISTS favorites (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                business_id INT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE KEY uniq_user_business (user_id, business_id),
                INDEX idx_user_id (user_id),
                CONSTRAINT fk_favorites_user
                    FOREIGN KEY (user_id) REFERENCES users(id)
                    ON DELETE CASCADE,
                CONSTRAINT fk_favorites_business
                    FOREIGN KEY (business_id) REFERENCES businesses(id)
                    ON DELETE CASCADE
            )
        `);
    }

    static async listByUser(userId) {
        await this.ensureTable();
        const [rows] = await db.query(`
            SELECT f.id AS favorite_id, f.created_at, b.*, c.name AS category_name
            FROM favorites f
            JOIN businesses b ON b.id = f.business_id
            LEFT JOIN categories c ON c.id = b.category_id
            WHERE f.user_id = ?
            ORDER BY f.created_at DESC
        `, [userId]);
        return rows;
    }

    static async add(userId, businessId) {
        await this.ensureTable();
        await db.query(
            'INSERT IGNORE INTO favorites (user_id, business_id) VALUES (?, ?)',
            [userId, businessId]
        );
    }

    static async remove(userId, businessId) {
        await this.ensureTable();
        await db.query('DELETE FROM favorites WHERE user_id = ? AND business_id = ?', [userId, businessId]);
    }

    static async exists(userId, businessId) {
        await this.ensureTable();
        const [rows] = await db.query(
            'SELECT id FROM favorites WHERE user_id = ? AND business_id = ? LIMIT 1',
            [userId, businessId]
        );
        return Boolean(rows[0]);
    }
}

module.exports = Favorite;
