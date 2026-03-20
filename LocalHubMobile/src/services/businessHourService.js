import api from './api';

const mockHours = [
  { day: 'Monday', _id: 'h1', isClosed: false, openTime: '09:00 AM', closeTime: '06:00 PM' },
  { day: 'Tuesday', _id: 'h2', isClosed: false, openTime: '09:00 AM', closeTime: '06:00 PM' },
  { day: 'Wednesday', _id: 'h3', isClosed: false, openTime: '09:00 AM', closeTime: '06:00 PM' },
  { day: 'Thursday', _id: 'h4', isClosed: false, openTime: '09:00 AM', closeTime: '06:00 PM' },
  { day: 'Friday', _id: 'h5', isClosed: false, openTime: '09:00 AM', closeTime: '06:00 PM' },
  { day: 'Saturday', _id: 'h6', isClosed: false, openTime: '10:00 AM', closeTime: '04:00 PM' },
  { day: 'Sunday', _id: 'h7', isClosed: true, openTime: '', closeTime: '' },
];

const businessHourService = {
  addBusinessHours: async (data) => {
    try {
      const response = await api.post('/business-hours', data);
      return { data: response || { ...data, _id: 'h_new' } };
    } catch (e) {
      return { data: { ...data, _id: 'h_new' } };
    }
  },
  updateBusinessHours: async (id, data) => {
    try {
      const response = await api.put(`/business-hours/${id}`, data);
      return { data: response || { ...data, _id: id } };
    } catch (e) {
       return { data: { ...data, _id: id } };
    }
  },
  getBusinessHours: async (businessId) => {
    try {
      const response = await api.get(`/business-hours/${businessId}`);
      return { data: response || mockHours };
    } catch (e) {
      return { data: mockHours };
    }
  },
};

export default businessHourService;
