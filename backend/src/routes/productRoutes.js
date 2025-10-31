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
const validateRequest = require('../middleware/validateRequest');
const { createProductValidation, updateProductValidation } = require('../validators/productValidators');

router.route('/featured').get(getFeaturedProducts);

router
  .route('/')
  .get(getProducts)
  .post(protect, createProductValidation, validateRequest, createProduct);

router
  .route('/:id')
  .get(getProduct)
  .put(protect, updateProductValidation, validateRequest, updateProduct)
  .delete(protect, deleteProduct);

router.route('/:id/reviews').post(protect, addReview);

module.exports = router;
