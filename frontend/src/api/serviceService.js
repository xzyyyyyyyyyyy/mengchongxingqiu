import axios from './axios';

export const serviceService = {
  // Get all services with optional filters
  getServices: (params = {}) => {
    return axios.get('/services', { params });
  },

  // Get single service
  getService: (id) => {
    return axios.get(`/services/${id}`);
  },

  // Create service
  createService: (data) => {
    return axios.post('/services', data);
  },

  // Update service
  updateService: (id, data) => {
    return axios.put(`/services/${id}`, data);
  },

  // Delete service
  deleteService: (id) => {
    return axios.delete(`/services/${id}`);
  },

  // Add review to service
  addReview: (id, data) => {
    return axios.post(`/services/${id}/reviews`, data);
  },

  // Get nearby services
  getNearbyServices: (params) => {
    return axios.get('/services/nearby', { params });
  }
};
