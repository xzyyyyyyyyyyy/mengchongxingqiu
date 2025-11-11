import axios from './axios';

export const userService = {
  // Get user profile
  getUserProfile: (userId) => {
    return axios.get(`/users/${userId}`);
  },

  // Get user statistics
  getUserStats: (userId) => {
    return axios.get(`/users/${userId}/stats`);
  },

  // Get user followers
  getFollowers: (userId) => {
    return axios.get(`/users/${userId}/followers`);
  },

  // Get user following
  getFollowing: (userId) => {
    return axios.get(`/users/${userId}/following`);
  },

  // Follow a user
  followUser: (userId) => {
    return axios.post(`/users/${userId}/follow`);
  },

  // Unfollow a user
  unfollowUser: (userId) => {
    return axios.delete(`/users/${userId}/follow`);
  },

  // Upload avatar
  uploadAvatar: (formData) => {
    return axios.post('/users/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }
};
