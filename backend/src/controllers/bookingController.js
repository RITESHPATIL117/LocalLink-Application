const Booking = require('../models/bookingModel');

const createBooking = async (req, res, next) => {
    try {
        const { business_id, booking_date, booking_time } = req.body;
        const user_id = req.user.id;

        const bookingId = await Booking.create({ user_id, business_id, booking_date, booking_time });

        res.status(201).json({
            success: true,
            message: 'Booking created successfully',
            data: { id: bookingId }
        });
    } catch (err) {
        next(err);
    }
};

const getMyBookings = async (req, res, next) => {
    try {
        const user_id = req.user.id;
        const bookings = await Booking.getByUser(user_id);

        res.json(bookings);
    } catch (err) {
        next(err);
    }
};

module.exports = {
    createBooking,
    getMyBookings
};
