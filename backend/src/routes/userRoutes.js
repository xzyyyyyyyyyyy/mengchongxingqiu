const express = require('express');
const router = express.Router();
const {
  getUserProfile,
  followUser,
  unfollowUser,
  uploadAvatar,
  avatarUpload,
  getFollowers,
  getFollowing
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');

// @route   GET /api/users/:id
// @desc    Get user profile
// @access  Public
router.get('/:id', getUserProfile);

// @route   GET /api/users/:id/followers
// @desc    Get user followers
// @access  Public
router.get('/:id/followers', getFollowers);

// @route   GET /api/users/:id/following
// @desc    Get user following
// @access  Public
router.get('/:id/following', getFollowing);

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
