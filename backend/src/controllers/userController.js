const User = require('../models/User');
const multer = require('multer');
const path = require('path');

// Configure multer for avatar upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/avatars/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'avatar-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('只支持 JPG、PNG 和 GIF 格式的图片'));
  }
});

// @desc    Get user profile
// @route   GET /api/users/:id
// @access  Public
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('followers', 'username avatar')
      .populate('following', 'username avatar');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }
    
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Follow a user
// @route   POST /api/users/:id/follow
// @access  Private
exports.followUser = async (req, res) => {
  try {
    const userToFollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user.id);
    
    if (!userToFollow) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }
    
    // Can't follow yourself
    if (req.params.id === req.user.id) {
      return res.status(400).json({
        success: false,
        message: '不能关注自己'
      });
    }
    
    // Check if already following
    if (currentUser.following.includes(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: '已经关注过该用户'
      });
    }
    
    // Add to following and followers
    currentUser.following.push(req.params.id);
    userToFollow.followers.push(req.user.id);
    
    await currentUser.save();
    await userToFollow.save();
    
    res.json({
      success: true,
      message: '关注成功',
      data: {
        following: currentUser.following,
        followers: userToFollow.followers
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Unfollow a user
// @route   DELETE /api/users/:id/follow
// @access  Private
exports.unfollowUser = async (req, res) => {
  try {
    const userToUnfollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user.id);
    
    if (!userToUnfollow) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }
    
    // Check if not following
    if (!currentUser.following.includes(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: '未关注该用户'
      });
    }
    
    // Remove from following and followers
    currentUser.following = currentUser.following.filter(
      id => id.toString() !== req.params.id
    );
    userToUnfollow.followers = userToUnfollow.followers.filter(
      id => id.toString() !== req.user.id
    );
    
    await currentUser.save();
    await userToUnfollow.save();
    
    res.json({
      success: true,
      message: '取消关注成功',
      data: {
        following: currentUser.following,
        followers: userToUnfollow.followers
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Upload avatar
// @route   POST /api/users/avatar
// @access  Private
exports.uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: '请上传头像图片'
      });
    }
    
    const user = await User.findById(req.user.id);
    
    // Update avatar path
    user.avatar = `/uploads/avatars/${req.file.filename}`;
    await user.save();
    
    res.json({
      success: true,
      message: '头像上传成功',
      data: {
        avatar: user.avatar
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get user followers
// @route   GET /api/users/:id/followers
// @access  Public
exports.getFollowers = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('followers', 'username avatar bio');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }
    
    res.json({
      success: true,
      data: user.followers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get user following
// @route   GET /api/users/:id/following
// @access  Public
exports.getFollowing = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('following', 'username avatar bio');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }
    
    res.json({
      success: true,
      data: user.following
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get user statistics
// @route   GET /api/users/:id/stats
// @access  Public
exports.getUserStats = async (req, res) => {
  try {
    const Post = require('../models/Post');
    const Pet = require('../models/Pet');
    const Order = require('../models/Order');
    const Booking = require('../models/Booking');
    
    const userId = req.params.id;
    
    // Get user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }
    
    // Get counts
    const [posts, pets, orders, bookings] = await Promise.all([
      Post.find({ author: userId }),
      Pet.find({ owner: userId }),
      Order.find({ user: userId }),
      Booking.find({ user: userId })
    ]);
    
    // Calculate total likes received on all posts
    const totalLikes = posts.reduce((sum, post) => sum + (post.likesCount || 0), 0);
    
    // Calculate order statistics
    const orderStats = {
      pending: orders.filter(o => o.paymentStatus === 'pending').length,
      shipping: orders.filter(o => o.status === 'processing' || o.status === 'shipped').length,
      delivered: orders.filter(o => o.status === 'delivered').length,
      completed: orders.filter(o => o.status === 'completed').length,
      total: orders.length
    };
    
    // Calculate booking statistics
    const bookingStats = {
      pending: bookings.filter(b => b.status === 'pending').length,
      ongoing: bookings.filter(b => b.status === 'confirmed').length,
      completed: bookings.filter(b => b.status === 'completed').length,
      total: bookings.length
    };
    
    // Calculate user level based on activity
    const activityScore = (posts.length * 10) + (totalLikes * 2) + (user.followers.length * 5);
    let level = 1;
    let levelName = '新手铲屎官';
    
    if (activityScore >= 10000) {
      level = 10;
      levelName = '传奇铲屎官';
    } else if (activityScore >= 5000) {
      level = 9;
      levelName = '大师级铲屎官';
    } else if (activityScore >= 2000) {
      level = 8;
      levelName = '专家级铲屎官';
    } else if (activityScore >= 1000) {
      level = 7;
      levelName = '高级铲屎官';
    } else if (activityScore >= 500) {
      level = 6;
      levelName = '进阶铲屎官';
    } else if (activityScore >= 200) {
      level = 5;
      levelName = '资深铲屎官';
    } else if (activityScore >= 100) {
      level = 4;
      levelName = '熟练铲屎官';
    } else if (activityScore >= 50) {
      level = 3;
      levelName = '初级铲屎官';
    } else if (activityScore >= 20) {
      level = 2;
      levelName = '见习铲屎官';
    }
    
    res.json({
      success: true,
      data: {
        followers: user.followers.length,
        following: user.following.length,
        posts: posts.length,
        likes: totalLikes,
        pets: pets.length,
        orders: orderStats,
        bookings: bookingStats,
        level: {
          number: level,
          name: levelName,
          score: activityScore
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Export multer upload middleware
exports.avatarUpload = upload.single('avatar');
