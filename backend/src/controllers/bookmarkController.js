const Bookmark = require('../models/Bookmark');
const Post = require('../models/Post');

// @desc    Get user's bookmarks
// @route   GET /api/bookmarks
// @access  Private
exports.getBookmarks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const bookmarks = await Bookmark.find({ user: req.user.id })
      .populate({
        path: 'post',
        populate: [
          { path: 'author', select: 'username avatar' },
          { path: 'pet', select: 'name avatar species' }
        ]
      })
      .sort('-createdAt')
      .limit(limit)
      .skip(skip);

    const total = await Bookmark.countDocuments({ user: req.user.id });

    // Filter out bookmarks where post has been deleted
    const validBookmarks = bookmarks.filter(bookmark => bookmark.post);

    res.json({
      success: true,
      count: validBookmarks.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: validBookmarks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Bookmark a post
// @route   POST /api/bookmarks/:postId
// @access  Private
exports.bookmarkPost = async (req, res) => {
  try {
    const postId = req.params.postId;

    // Check if post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: '帖子未找到'
      });
    }

    // Check if already bookmarked
    const existingBookmark = await Bookmark.findOne({
      user: req.user.id,
      post: postId
    });

    if (existingBookmark) {
      return res.status(400).json({
        success: false,
        message: '已经收藏过该帖子'
      });
    }

    // Create bookmark
    const bookmark = await Bookmark.create({
      user: req.user.id,
      post: postId
    });

    res.status(201).json({
      success: true,
      message: '收藏成功',
      data: bookmark
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Remove bookmark
// @route   DELETE /api/bookmarks/:postId
// @access  Private
exports.removeBookmark = async (req, res) => {
  try {
    const postId = req.params.postId;

    const bookmark = await Bookmark.findOneAndDelete({
      user: req.user.id,
      post: postId
    });

    if (!bookmark) {
      return res.status(404).json({
        success: false,
        message: '收藏未找到'
      });
    }

    res.json({
      success: true,
      message: '取消收藏成功'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Check if post is bookmarked
// @route   GET /api/bookmarks/check/:postId
// @access  Private
exports.checkBookmark = async (req, res) => {
  try {
    const postId = req.params.postId;

    const bookmark = await Bookmark.findOne({
      user: req.user.id,
      post: postId
    });

    res.json({
      success: true,
      isBookmarked: !!bookmark
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
