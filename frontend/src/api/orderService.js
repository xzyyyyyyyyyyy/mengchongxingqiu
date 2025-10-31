import axios from './axios';

export const orderService = {
  // Get all orders
  getOrders: (params = {}) => {
    return axios.get('/orders', { params });
  },

  // Get single order
  getOrder: (id) => {
    return axios.get(`/orders/${id}`);
  },

  // Create order
  createOrder: (data) => {
    return axios.post('/orders', data);
  },

  // Update payment status
  updatePayment: (id, data) => {
    return axios.put(`/orders/${id}/payment`, data);
  },

  // Update order status (admin)
  updateOrderStatus: (id, data) => {
    return axios.put(`/orders/${id}/status`, data);
  },

  // Cancel order
  cancelOrder: (id, data) => {
    return axios.put(`/orders/${id}/cancel`, data);
  }
};
