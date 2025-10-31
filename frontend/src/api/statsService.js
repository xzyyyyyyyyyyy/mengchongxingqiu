import axios from './axios';

export const statsService = {
  getStats: async () => {
    return await axios.get('/stats');
  }
};
