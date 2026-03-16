import api from './api';

const mockCities = [
  { id: 'c1', name: 'New York', state: 'NY' },
  { id: 'c2', name: 'Los Angeles', state: 'CA' },
  { id: 'c3', name: 'Chicago', state: 'IL' },
];

const cityService = {
  getCities: async () => {
    try {
      const response = await api.get('/cities');
      return { data: response || mockCities };
    } catch (e) {
      return { data: mockCities };
    }
  },
};

export default cityService;
