const BrowsingHistory = require('../models/BrowsingHistory');

// @desc    Add item to browsing history
// @route   POST /api/history
// @access  Private
exports.addToHistory = async (req, res) => {
  try {
    const { itemType, itemId } = req.body;
    const userId = req.user.id;

    if (!itemType || !itemId) {
      return res.status(400).json({
        success: false,
        message: '缺少必要参数'
      });
    }

    // Check if this item was recently viewed (within last 5 minutes)
    const recentView = await BrowsingHistory.findOne({
      user: userId,
      itemType,
      itemId,
      viewedAt: { $gte: new Date(Date.now() - 5 * 60 * 1000) }
    });

    if (recentView) {
      // Update the viewedAt timestamp
      recentView.viewedAt = new Date();
      await recentView.save();
      
      return res.json({
        success: true,
        message: '浏览记录已更新',
        data: recentView
      });
    }

    // Create new history entry
    const historyData = {
      user: userId,
      itemType,
      itemId,
      viewedAt: new Date()
    };

    // Set the appropriate reference field
    historyData[itemType] = itemId;

    const history = await BrowsingHistory.create(historyData);

    res.status(201).json({
      success: true,
      message: '已添加到浏览记录',
      data: history
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get user's browsing history
// @route   GET /api/history
// @access  Private
exports.getHistory = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const itemType = req.query.itemType; // Optional filter by type

    const query = { user: req.user.id };
    if (itemType) {
      query.itemType = itemType;
    }

    const history = await BrowsingHistory.find(query)
      .populate('post', 'content media author')
      .populate('pet', 'name avatar species')
      .populate('product', 'name images pricing')
      .populate('service', 'name images location')
      .sort('-viewedAt')
      .limit(limit)
      .skip(skip);

    const total = await BrowsingHistory.countDocuments(query);

    // Filter out items where the referenced document was deleted
    const validHistory = history.filter(item => {
      switch (item.itemType) {
        case 'post':
          return item.post;
        case 'pet':
          return item.pet;
        case 'product':
          return item.product;
        case 'service':
          return item.service;
        default:
          return false;
      }
    });

    res.json({
      success: true,
      count: validHistory.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: validHistory
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Clear browsing history
// @route   DELETE /api/history
// @access  Private
exports.clearHistory = async (req, res) => {
  try {
    const itemType = req.query.itemType; // Optional: clear only specific type

    const query = { user: req.user.id };
    if (itemType) {
      query.itemType = itemType;
    }

    const result = await BrowsingHistory.deleteMany(query);

    res.json({
      success: true,
      message: `已清除${result.deletedCount}条浏览记录`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete specific history item
// @route   DELETE /api/history/:id
// @access  Private
exports.deleteHistoryItem = async (req, res) => {
  try {
    const history = await BrowsingHistory.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!history) {
      return res.status(404).json({
        success: false,
        message: '记录未找到'
      });
    }

    await history.deleteOne();

    res.json({
      success: true,
      message: '记录已删除'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
