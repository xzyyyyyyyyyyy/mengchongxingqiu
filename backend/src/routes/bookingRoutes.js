const express = require('express');
const {
  getBookings,
  getBooking,
  createBooking,
  updateBooking,
  cancelBooking,
  deleteBooking
} = require('../controllers/bookingController');

const router = express.Router();

const { protect } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

router
  .route('/')
  .get(getBookings)
  .post(createBooking);

router
  .route('/:id')
  .get(getBooking)
  .put(updateBooking)
  .delete(deleteBooking);

router.route('/:id/cancel').put(cancelBooking);

module.exports = router;
