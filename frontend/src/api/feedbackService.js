import axios from './axios';

export const feedbackService = {
  submitFeedback: async (feedbackData) => {
    return await axios.post('/feedback', feedbackData);
  },

  getUserFeedback: async (params = {}) => {
    return await axios.get('/feedback', { params });
  },

  getAllFeedback: async (params = {}) => {
    return await axios.get('/feedback/all', { params });
  },

  updateFeedback: async (feedbackId, updateData) => {
    return await axios.put(`/feedback/${feedbackId}`, updateData);
  },
};
