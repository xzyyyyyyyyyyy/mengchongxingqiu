const express = require('express');
const router = express.Router();
const {
  addToHistory,
  getHistory,
  clearHistory,
  deleteHistoryItem
} = require('../controllers/historyController');
const { protect } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

// @route   POST /api/history
// @desc    Add item to browsing history
// @access  Private
router.post('/', addToHistory);

// @route   GET /api/history
// @desc    Get user's browsing history
// @access  Private
router.get('/', getHistory);

// @route   DELETE /api/history
// @desc    Clear all browsing history
// @access  Private
router.delete('/', clearHistory);

// @route   DELETE /api/history/:id
// @desc    Delete specific history item
// @access  Private
router.delete('/:id', deleteHistoryItem);

module.exports = router;
