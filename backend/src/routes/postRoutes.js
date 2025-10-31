const express = require('express');
const router = express.Router();
const {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  likePost,
  addComment,
  getUserPosts
} = require('../controllers/postController');
const { protect } = require('../middleware/auth');

router.route('/')
  .get(getPosts)
  .post(protect, createPost);

router.get('/user/:userId', getUserPosts);

router.route('/:id')
  .get(getPost)
  .put(protect, updatePost)
  .delete(protect, deletePost);

router.put('/:id/like', protect, likePost);
router.post('/:id/comments', protect, addComment);

module.exports = router;
