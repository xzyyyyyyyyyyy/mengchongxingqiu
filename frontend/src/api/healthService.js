import axios from './axios';

export const healthService = {
  getHealthLogs: async (petId, params = {}) => {
    return await axios.get(`/health/${petId}`, { params });
  },

  createHealthLog: async (petId, logData) => {
    return await axios.post(`/health/${petId}`, logData);
  },

  getHealthAnalytics: async (petId, days = 30) => {
    return await axios.get(`/health/${petId}/analytics`, { params: { days } });
  },
};
