const db = require('../config/db');

class Chat {
    static async ensureTables() {
        await db.query(`
            CREATE TABLE IF NOT EXISTS chats (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                business_id INT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                UNIQUE KEY uniq_user_business (user_id, business_id),
                INDEX idx_user_id (user_id),
                INDEX idx_business_id (business_id),
                CONSTRAINT fk_chats_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                CONSTRAINT fk_chats_business FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE
            )
        `);

        await db.query(`
            CREATE TABLE IF NOT EXISTS chat_messages (
                id INT AUTO_INCREMENT PRIMARY KEY,
                chat_id INT NOT NULL,
                sender_id INT NOT NULL,
                message TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                INDEX idx_chat_id (chat_id),
                INDEX idx_sender_id (sender_id),
                CONSTRAINT fk_chat_messages_chat FOREIGN KEY (chat_id) REFERENCES chats(id) ON DELETE CASCADE,
                CONSTRAINT fk_chat_messages_sender FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);
    }

    static async getOrCreateChat(userId, businessId) {
        await this.ensureTables();
        await db.query(
            'INSERT IGNORE INTO chats (user_id, business_id) VALUES (?, ?)',
            [userId, businessId]
        );
        const [rows] = await db.query(
            'SELECT * FROM chats WHERE user_id = ? AND business_id = ? LIMIT 1',
            [userId, businessId]
        );
        return rows[0];
    }

    static async listChatsForUser(userId) {
        await this.ensureTables();
        const [rows] = await db.query(`
            SELECT 
                c.id,
                b.name,
                b.image_url,
                MAX(cm.created_at) AS last_message_time,
                SUBSTRING_INDEX(GROUP_CONCAT(cm.message ORDER BY cm.created_at DESC SEPARATOR '||'), '||', 1) AS last_message
            FROM chats c
            JOIN businesses b ON b.id = c.business_id
            LEFT JOIN chat_messages cm ON cm.chat_id = c.id
            WHERE c.user_id = ?
            GROUP BY c.id, b.name, b.image_url
            ORDER BY COALESCE(last_message_time, c.updated_at) DESC
        `, [userId]);
        return rows;
    }

    static async getMessages(chatId, userId) {
        await this.ensureTables();
        const [chatRows] = await db.query('SELECT id FROM chats WHERE id = ? AND user_id = ? LIMIT 1', [chatId, userId]);
        if (!chatRows[0]) return null;

        const [rows] = await db.query(`
            SELECT cm.id, cm.message, cm.sender_id, cm.created_at
            FROM chat_messages cm
            WHERE cm.chat_id = ?
            ORDER BY cm.created_at ASC
        `, [chatId]);
        return rows;
    }

    static async sendMessage(chatId, senderId, message) {
        await this.ensureTables();
        const [result] = await db.query(
            'INSERT INTO chat_messages (chat_id, sender_id, message) VALUES (?, ?, ?)',
            [chatId, senderId, message]
        );
        await db.query('UPDATE chats SET updated_at = NOW() WHERE id = ?', [chatId]);
        return result.insertId;
    }
}

module.exports = Chat;
