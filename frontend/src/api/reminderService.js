import axios from './axios';

export const reminderService = {
  // Get all reminders
  getReminders: (params = {}) => {
    return axios.get('/reminders', { params });
  },

  // Get reminders statistics
  getStats: () => {
    return axios.get('/reminders/stats');
  },

  // Create a new reminder
  createReminder: (data) => {
    return axios.post('/reminders', data);
  },

  // Update a reminder
  updateReminder: (id, data) => {
    return axios.put(`/reminders/${id}`, data);
  },

  // Mark reminder as completed
  completeReminder: (id) => {
    return axios.put(`/reminders/${id}/complete`);
  },

  // Delete a reminder
  deleteReminder: (id) => {
    return axios.delete(`/reminders/${id}`);
  }
};
