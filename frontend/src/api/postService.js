import axios from './axios';

export const postService = {
  getPosts: async (params = {}) => {
    return await axios.get('/posts', { params });
  },

  getPost: async (postId) => {
    return await axios.get(`/posts/${postId}`);
  },

  createPost: async (postData) => {
    return await axios.post('/posts', postData);
  },

  updatePost: async (postId, postData) => {
    return await axios.put(`/posts/${postId}`, postData);
  },

  deletePost: async (postId) => {
    return await axios.delete(`/posts/${postId}`);
  },

  likePost: async (postId) => {
    return await axios.put(`/posts/${postId}/like`);
  },

  addComment: async (postId, content) => {
    return await axios.post(`/posts/${postId}/comments`, { content });
  },

  getUserPosts: async (userId) => {
    return await axios.get(`/posts/user/${userId}`);
  },

  getTrendingHashtags: async (limit = 10) => {
    return await axios.get('/posts/trending/hashtags', { params: { limit } });
  },

  getPostsByHashtag: async (hashtag, params = {}) => {
    return await axios.get(`/posts/hashtag/${hashtag}`, { params });
  },
};
