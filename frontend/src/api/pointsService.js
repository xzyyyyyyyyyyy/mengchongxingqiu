import axios from './axios';

export const pointsService = {
  // Get user points balance
  getBalance: () => {
    return axios.get('/points/balance');
  },

  // Get points transaction history
  getTransactions: (params = {}) => {
    return axios.get('/points/transactions', { params });
  },

  // Exchange points for item
  exchangePoints: (data) => {
    return axios.post('/points/exchange', data);
  }
};
