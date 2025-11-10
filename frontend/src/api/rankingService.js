import axios from './axios';

export const rankingService = {
  // Get rankings by category
  getRankings: (params = {}) => {
    return axios.get('/rankings', { params });
  },

  // Get all categories rankings
  getAllRankings: () => {
    return axios.get('/rankings/all');
  },

  // Vote for a pet
  voteForPet: (data) => {
    return axios.post('/rankings/vote', data);
  }
};
