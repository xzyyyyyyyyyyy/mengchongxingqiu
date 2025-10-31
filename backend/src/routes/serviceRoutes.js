const express = require('express');
const {
  getServices,
  getService,
  createService,
  updateService,
  deleteService,
  addReview,
  getNearbyServices
} = require('../controllers/serviceController');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.route('/nearby').get(getNearbyServices);

router
  .route('/')
  .get(getServices)
  .post(protect, createService);

router
  .route('/:id')
  .get(getService)
  .put(protect, updateService)
  .delete(protect, deleteService);

router.route('/:id/reviews').post(protect, addReview);

module.exports = router;
