const express = require('express');
const router = express.Router();
const pointsController = require('../controllers/pointsController');
const { protect } = require('../middleware/auth');

// @route   GET /api/points/balance
// @desc    Get user points balance
// @access  Private
router.get('/balance', protect, pointsController.getBalance);

// @route   GET /api/points/transactions
// @desc    Get points transaction history
// @access  Private
router.get('/transactions', protect, pointsController.getTransactions);

// @route   POST /api/points/exchange
// @desc    Exchange points for item
// @access  Private
router.post('/exchange', protect, pointsController.exchangePoints);

module.exports = router;
