const express = require('express');
const router = express.Router();
const {
  submitFeedback,
  getUserFeedback,
  getAllFeedback,
  updateFeedback
} = require('../controllers/feedbackController');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
  .post(protect, submitFeedback)
  .get(protect, getUserFeedback);

router.get('/all', protect, authorize('admin'), getAllFeedback);
router.put('/:id', protect, authorize('admin'), updateFeedback);

module.exports = router;
