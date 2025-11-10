import axios from './axios';

export const settingsService = {
  // Get user settings
  getSettings: () => {
    return axios.get('/settings');
  },

  // Update all settings
  updateSettings: (data) => {
    return axios.put('/settings', data);
  },

  // Update appearance settings
  updateAppearance: (data) => {
    return axios.put('/settings/appearance', data);
  },

  // Update notification settings
  updateNotifications: (data) => {
    return axios.put('/settings/notifications', data);
  },

  // Update privacy settings
  updatePrivacy: (data) => {
    return axios.put('/settings/privacy', data);
  }
};
