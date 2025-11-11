const express = require('express');
const router = express.Router();
const {
  getUserProfile,
  followUser,
  unfollowUser,
  uploadAvatar,
  avatarUpload,
  getFollowers,
  getFollowing,
  getUserStats
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const { userPublicLimiter } = require('../middleware/rateLimiter');

// @route   GET /api/users/:id
// @desc    Get user profile
// @access  Public
router.get('/:id', userPublicLimiter, getUserProfile);

// @route   GET /api/users/:id/stats
// @desc    Get user statistics
// @access  Public
router.get('/:id/stats', userPublicLimiter, getUserStats);

// @route   GET /api/users/:id/followers
// @desc    Get user followers
// @access  Public
router.get('/:id/followers', userPublicLimiter, getFollowers);

// @route   GET /api/users/:id/following
// @desc    Get user following
// @access  Public
router.get('/:id/following', userPublicLimiter, getFollowing);

// @route   POST /api/users/:id/follow
// @desc    Follow a user
// @access  Private
router.post('/:id/follow', protect, followUser);

// @route   DELETE /api/users/:id/follow
// @desc    Unfollow a user
// @access  Private
router.delete('/:id/follow', protect, unfollowUser);

// @route   POST /api/users/avatar
// @desc    Upload avatar
// @access  Private
router.post('/avatar', protect, avatarUpload, uploadAvatar);

module.exports = router;
