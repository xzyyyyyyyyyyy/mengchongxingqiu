const express = require('express');
const {
  getOrders,
  getOrder,
  createOrder,
  updatePayment,
  updateOrderStatus,
  cancelOrder
} = require('../controllers/orderController');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

router
  .route('/')
  .get(getOrders)
  .post(createOrder);

router
  .route('/:id')
  .get(getOrder);

router.route('/:id/payment').put(updatePayment);
router.route('/:id/status').put(authorize('admin'), updateOrderStatus);
router.route('/:id/cancel').put(cancelOrder);

module.exports = router;
