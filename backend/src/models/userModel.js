const db = require('../config/db');
const bcrypt = require('bcryptjs');

class User {
    static async create({ name, email, password, role = 'user', phone }) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await db.query(
            'INSERT INTO users (name, email, password, role, phone) VALUES (?, ?, ?, ?, ?)',
            [name, email, hashedPassword, role, phone]
        );
        return result.insertId;
    }

    static async findByEmail(email) {
        const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        return rows[0];
    }

    static async findById(id) {
        const [rows] = await db.query('SELECT id, name, email, role, phone, created_at FROM users WHERE id = ?', [id]);
        return rows[0];
    }
}

module.exports = User;
