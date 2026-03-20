const db = require('../config/db');

class Booking {
    static async create({ user_id, business_id, booking_date, booking_time, status = 'pending' }) {
        const [result] = await db.query(
            'INSERT INTO bookings (user_id, business_id, booking_date, booking_time, status) VALUES (?, ?, ?, ?, ?)',
            [user_id, business_id, booking_date, booking_time, status]
        );
        return result.insertId;
    }

    static async getByUser(userId) {
        const [rows] = await db.query(`
            SELECT b.*, bus.name as business_name, bus.address, bus.image_url 
            FROM bookings b
            JOIN businesses bus ON b.business_id = bus.id
            WHERE b.user_id = ?
            ORDER BY b.booking_date DESC, b.booking_time DESC
        `, [userId]);
        return rows;
    }

    static async updateStatus(id, status) {
        await db.query('UPDATE bookings SET status = ? WHERE id = ?', [status, id]);
    }
}

module.exports = Booking;
