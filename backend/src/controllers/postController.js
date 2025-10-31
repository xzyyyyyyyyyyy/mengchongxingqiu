const Post = require('../models/Post');

// @desc    Get all posts (feed)
// @route   GET /api/posts
// @access  Public
exports.getPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const { category, tag, hashtag } = req.query;
    
    let query = { isPublic: true };

    if (category) query.category = category;
    if (tag) query.tags = tag;
    if (hashtag) query.hashtags = hashtag;

    const posts = await Post.find(query)
      .populate('author', 'username avatar')
      .populate('pet', 'name avatar species')
      .sort('-createdAt')
      .limit(limit)
      .skip(skip);

    const total = await Post.countDocuments(query);

    res.json({
      success: true,
      count: posts.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: posts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single post
// @route   GET /api/posts/:id
// @access  Public
exports.getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'username avatar bio')
      .populate('pet', 'name avatar species breed')
      .populate('comments.user', 'username avatar');

    if (!post) {
      return res.status(404).json({
        success: false,
        message: '帖子未找到'
      });
    }

    // Increment view count
    post.views += 1;
    await post.save();

    res.json({
      success: true,
      data: post
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create new post
// @route   POST /api/posts
// @access  Private
exports.createPost = async (req, res) => {
  try {
    req.body.author = req.user.id;

    const post = await Post.create(req.body);

    res.status(201).json({
      success: true,
      data: post
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update post
// @route   PUT /api/posts/:id
// @access  Private
exports.updatePost = async (req, res) => {
  try {
    let post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: '帖子未找到'
      });
    }

    // Make sure user owns the post
    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: '无权修改此帖子'
      });
    }

    post = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({
      success: true,
      data: post
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete post
// @route   DELETE /api/posts/:id
// @access  Private
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: '帖子未找到'
      });
    }

    // Make sure user owns the post
    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: '无权删除此帖子'
      });
    }

    await post.deleteOne();

    res.json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Like post
// @route   PUT /api/posts/:id/like
// @access  Private
exports.likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: '帖子未找到'
      });
    }

    // Check if already liked
    const index = post.likes.indexOf(req.user.id);

    if (index > -1) {
      // Unlike
      post.likes.splice(index, 1);
      post.likesCount -= 1;
    } else {
      // Like
      post.likes.push(req.user.id);
      post.likesCount += 1;
    }

    await post.save();

    res.json({
      success: true,
      data: {
        likesCount: post.likesCount,
        isLiked: index === -1
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Add comment to post
// @route   POST /api/posts/:id/comments
// @access  Private
exports.addComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: '帖子未找到'
      });
    }

    const comment = {
      user: req.user.id,
      content: req.body.content
    };

    post.comments.push(comment);
    post.commentsCount += 1;

    await post.save();

    const updatedPost = await Post.findById(req.params.id)
      .populate('comments.user', 'username avatar');

    res.json({
      success: true,
      data: updatedPost.comments[updatedPost.comments.length - 1]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get user's posts
// @route   GET /api/posts/user/:userId
// @access  Public
exports.getUserPosts = async (req, res) => {
  try {
    const posts = await Post.find({ author: req.params.userId, isPublic: true })
      .populate('author', 'username avatar')
      .populate('pet', 'name avatar species')
      .sort('-createdAt');

    res.json({
      success: true,
      count: posts.length,
      data: posts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
