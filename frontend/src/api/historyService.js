import axios from './axios';

export const historyService = {
  // Add item to browsing history
  addToHistory: async (itemType, itemId) => {
    return await axios.post('/history', { itemType, itemId });
  },

  // Get browsing history
  getHistory: async (params = {}) => {
    return await axios.get('/history', { params });
  },

  // Clear all history
  clearHistory: async (itemType = null) => {
    const params = itemType ? { itemType } : {};
    return await axios.delete('/history', { params });
  },

  // Delete specific history item
  deleteHistoryItem: async (historyId) => {
    return await axios.delete(`/history/${historyId}`);
  }
};
