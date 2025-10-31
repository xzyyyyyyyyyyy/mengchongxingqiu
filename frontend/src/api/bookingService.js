import axios from './axios';

export const bookingService = {
  // Get all bookings
  getBookings: (params = {}) => {
    return axios.get('/bookings', { params });
  },

  // Get single booking
  getBooking: (id) => {
    return axios.get(`/bookings/${id}`);
  },

  // Create booking
  createBooking: (data) => {
    return axios.post('/bookings', data);
  },

  // Update booking
  updateBooking: (id, data) => {
    return axios.put(`/bookings/${id}`, data);
  },

  // Cancel booking
  cancelBooking: (id) => {
    return axios.put(`/bookings/${id}/cancel`);
  },

  // Delete booking
  deleteBooking: (id) => {
    return axios.delete(`/bookings/${id}`);
  }
};
