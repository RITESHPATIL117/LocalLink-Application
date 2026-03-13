import api from './api';

const bookingService = {
  createBooking: async (data) => {
    return api.post('/bookings', data);
  },
  getBookingsByUser: async () => {
    return api.get('/bookings/user');
  },
  updateBookingStatus: async (id, status) => {
    return api.patch(`/bookings/${id}/status`, { status });
  },
  cancelBooking: async (id) => {
    return api.patch(`/bookings/${id}/cancel`);
  },
};

export default bookingService;
