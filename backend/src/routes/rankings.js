const express = require('express');
const router = express.Router();
const rankingController = require('../controllers/rankingController');
const { protect } = require('../middleware/auth');

// @route   GET /api/rankings
// @desc    Get rankings by category
// @access  Public
router.get('/', rankingController.getRankings);

// @route   GET /api/rankings/all
// @desc    Get all categories rankings
// @access  Public
router.get('/all', rankingController.getAllRankings);

// @route   POST /api/rankings/vote
// @desc    Vote for a pet
// @access  Private
router.post('/vote', protect, rankingController.voteForPet);

module.exports = router;
