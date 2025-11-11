const express = require('express');
const router = express.Router();
const {
  getBookmarks,
  bookmarkPost,
  removeBookmark,
  checkBookmark
} = require('../controllers/bookmarkController');
const { protect } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

// @route   GET /api/bookmarks
// @desc    Get user's bookmarks
// @access  Private
router.get('/', getBookmarks);

// @route   GET /api/bookmarks/check/:postId
// @desc    Check if post is bookmarked
// @access  Private
router.get('/check/:postId', checkBookmark);

// @route   POST /api/bookmarks/:postId
// @desc    Bookmark a post
// @access  Private
router.post('/:postId', bookmarkPost);

// @route   DELETE /api/bookmarks/:postId
// @desc    Remove bookmark
// @access  Private
router.delete('/:postId', removeBookmark);

module.exports = router;
