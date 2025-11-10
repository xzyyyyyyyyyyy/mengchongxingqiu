const express = require('express');
const router = express.Router({ mergeParams: true });
const {
  getPetRatings,
  addPetRating,
  deleteRating,
  markRatingHelpful,
  getMyRating
} = require('../controllers/petRatingController');
const { protect } = require('../middleware/auth');

// Public routes
router.get('/', getPetRatings);

// Protected routes
router.post('/', protect, addPetRating);
router.get('/me', protect, getMyRating);
router.delete('/:ratingId', protect, deleteRating);
router.put('/:ratingId/helpful', protect, markRatingHelpful);

module.exports = router;
