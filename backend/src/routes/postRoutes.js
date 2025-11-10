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
  getUserPosts,
  getTrendingHashtags,
  getPostsByHashtag
} = require('../controllers/postController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.route('/')
  .get(getPosts)
  .post(protect, upload.array('images', 9), createPost);

router.get('/user/:userId', getUserPosts);
router.get('/trending/hashtags', getTrendingHashtags);
router.get('/hashtag/:hashtag', getPostsByHashtag);

router.route('/:id')
  .get(getPost)
  .put(protect, upload.array('images', 9), updatePost)
  .delete(protect, deletePost);

router.put('/:id/like', protect, likePost);
router.post('/:id/comments', protect, addComment);

module.exports = router;
