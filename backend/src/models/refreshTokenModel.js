const db = require('../config/db');

class RefreshToken {
    static async ensureTable() {
        await db.query(`
            CREATE TABLE IF NOT EXISTS refresh_tokens (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                token_hash VARCHAR(255) NOT NULL,
                expires_at DATETIME NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                INDEX idx_user_id (user_id),
                INDEX idx_expires_at (expires_at),
                CONSTRAINT fk_refresh_tokens_user
                    FOREIGN KEY (user_id) REFERENCES users(id)
                    ON DELETE CASCADE
            )
        `);
    }

    static async save({ userId, tokenHash, expiresAt }) {
        await this.ensureTable();
        await db.query(
            'INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES (?, ?, ?)',
            [userId, tokenHash, expiresAt]
        );
    }

    static async find(tokenHash) {
        await this.ensureTable();
        const [rows] = await db.query(
            'SELECT * FROM refresh_tokens WHERE token_hash = ? LIMIT 1',
            [tokenHash]
        );
        return rows[0];
    }

    static async deleteByHash(tokenHash) {
        await this.ensureTable();
        await db.query('DELETE FROM refresh_tokens WHERE token_hash = ?', [tokenHash]);
    }

    static async deleteByUserId(userId) {
        await this.ensureTable();
        await db.query('DELETE FROM refresh_tokens WHERE user_id = ?', [userId]);
    }

    static async cleanupExpired() {
        await this.ensureTable();
        await db.query('DELETE FROM refresh_tokens WHERE expires_at < NOW()');
    }
}

module.exports = RefreshToken;
