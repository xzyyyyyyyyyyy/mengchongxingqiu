import axios from './axios';

export const bookmarkService = {
  // Get user's bookmarks
  getBookmarks: async (params = {}) => {
    return await axios.get('/bookmarks', { params });
  },

  // Bookmark a post
  bookmarkPost: async (postId) => {
    return await axios.post(`/bookmarks/${postId}`);
  },

  // Remove bookmark
  removeBookmark: async (postId) => {
    return await axios.delete(`/bookmarks/${postId}`);
  },

  // Check if post is bookmarked
  checkBookmark: async (postId) => {
    return await axios.get(`/bookmarks/check/${postId}`);
  },

  // Toggle bookmark (convenience method)
  toggleBookmark: async (postId, isBookmarked) => {
    if (isBookmarked) {
      return await axios.delete(`/bookmarks/${postId}`);
    } else {
      return await axios.post(`/bookmarks/${postId}`);
    }
  }
};
