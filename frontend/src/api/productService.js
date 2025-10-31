import axios from './axios';

export const productService = {
  // Get all products with optional filters
  getProducts: (params = {}) => {
    return axios.get('/products', { params });
  },

  // Get single product
  getProduct: (id) => {
    return axios.get(`/products/${id}`);
  },

  // Get featured products
  getFeaturedProducts: () => {
    return axios.get('/products/featured');
  },

  // Create product
  createProduct: (data) => {
    return axios.post('/products', data);
  },

  // Update product
  updateProduct: (id, data) => {
    return axios.put(`/products/${id}`, data);
  },

  // Delete product
  deleteProduct: (id) => {
    return axios.delete(`/products/${id}`);
  },

  // Add review to product
  addReview: (id, data) => {
    return axios.post(`/products/${id}/reviews`, data);
  }
};
