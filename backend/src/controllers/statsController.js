const User = require('../models/User');
const Pet = require('../models/Pet');
const Post = require('../models/Post');
const Product = require('../models/Product');
const Service = require('../models/Service');
const Order = require('../models/Order');
const Booking = require('../models/Booking');

// @desc    Get platform statistics
// @route   GET /api/stats
// @access  Private/Admin
exports.getStats = async (req, res) => {
  try {
    // Get counts
    const [
      usersCount,
      petsCount,
      postsCount,
      productsCount,
      servicesCount,
      ordersCount,
      bookingsCount
    ] = await Promise.all([
      User.countDocuments(),
      Pet.countDocuments(),
      Post.countDocuments(),
      Product.countDocuments(),
      Service.countDocuments(),
      Order.countDocuments(),
      Booking.countDocuments()
    ]);

    // Get recent data
    const recentPosts = await Post.find()
      .sort('-createdAt')
      .limit(5)
      .populate('author', 'username avatar')
      .select('content createdAt likesCount commentsCount');

    const recentOrders = await Order.find()
      .sort('-createdAt')
      .limit(5)
      .populate('user', 'username')
      .select('orderNumber totalAmount status createdAt');

    // Get top posts
    const topPosts = await Post.find()
      .sort('-likesCount')
      .limit(5)
      .populate('author', 'username avatar')
      .select('content likesCount commentsCount views');

    res.json({
      success: true,
      data: {
        counts: {
          users: usersCount,
          pets: petsCount,
          posts: postsCount,
          products: productsCount,
          services: servicesCount,
          orders: ordersCount,
          bookings: bookingsCount
        },
        recent: {
          posts: recentPosts,
          orders: recentOrders
        },
        top: {
          posts: topPosts
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
