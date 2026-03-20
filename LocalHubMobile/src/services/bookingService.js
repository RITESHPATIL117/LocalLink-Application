import api from './api';

const mockBookings = [
  {
    id: 'bk1',
    businessId: 'b1',
    businessName: 'Sparkle Home Cleaning',
    date: new Date().toISOString(),
    status: 'confirmed',
    price: 50
  }
];

const bookingService = {
  createBooking: async (data) => {
    try {
      const response = await api.post('/bookings', data);
      return { data: response || { ...data, id: 'bk_new', status: 'pending' } };
    } catch (e) {
      return { data: { ...data, id: 'bk_new', status: 'pending' } };
    }
  },
  getBookingsByUser: async (userId) => {
    try {
       const response = await api.get(`/bookings/user/${userId}`);
       return { data: response || mockBookings };
    } catch (e) {
       return { data: mockBookings };
    }
  },
  updateBookingStatus: async (id, status) => {
    try {
      const response = await api.patch(`/bookings/${id}/status`, { status });
      return { data: response || { id, status } };
    } catch (e) {
      return { data: { id, status } };
    }
  },
  cancelBooking: async (id) => {
    try {
      const response = await api.patch(`/bookings/${id}/cancel`);
      return { data: response || { id, status: 'cancelled' }};
    } catch (e) {
       return { data: { id, status: 'cancelled' }};
    }
  },
};

export default bookingService;
