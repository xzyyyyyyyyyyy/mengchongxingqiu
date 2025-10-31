const express = require('express');
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  addReview,
  getFeaturedProducts
} = require('../controllers/productController');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.route('/featured').get(getFeaturedProducts);

router
  .route('/')
  .get(getProducts)
  .post(protect, createProduct);

router
  .route('/:id')
  .get(getProduct)
  .put(protect, updateProduct)
  .delete(protect, deleteProduct);

router.route('/:id/reviews').post(protect, addReview);

module.exports = router;
