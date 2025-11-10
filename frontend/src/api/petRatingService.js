import axios from './axios';

export const petRatingService = {
  // Get ratings for a pet
  getPetRatings: async (petId, params = {}) => {
    return await axios.get(`/pets/${petId}/ratings`, { params });
  },

  // Add or update rating
  addRating: async (petId, ratingData) => {
    return await axios.post(`/pets/${petId}/ratings`, ratingData);
  },

  // Get user's own rating for a pet
  getMyRating: async (petId) => {
    return await axios.get(`/pets/${petId}/ratings/me`);
  },

  // Delete rating
  deleteRating: async (petId, ratingId) => {
    return await axios.delete(`/pets/${petId}/ratings/${ratingId}`);
  },

  // Mark rating as helpful
  markHelpful: async (petId, ratingId) => {
    return await axios.put(`/pets/${petId}/ratings/${ratingId}/helpful`);
  }
};
