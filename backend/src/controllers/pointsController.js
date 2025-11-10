const PointsTransaction = require('../models/PointsTransaction');
const User = require('../models/User');

// Get user points balance
exports.getBalance = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('points');
    
    res.json({
      success: true,
      data: {
        points: user.points || 0
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get points transaction history
exports.getTransactions = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    
    const transactions = await PointsTransaction.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));
    
    const total = await PointsTransaction.countDocuments({ user: req.user.id });
    
    res.json({
      success: true,
      data: transactions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Exchange points for item
exports.exchangePoints = async (req, res) => {
  try {
    const { itemId, itemName, pointsCost } = req.body;
    const userId = req.user.id;
    
    const user = await User.findById(userId);
    
    if (user.points < pointsCost) {
      return res.status(400).json({
        success: false,
        message: '积分不足'
      });
    }
    
    // Deduct points
    user.points -= pointsCost;
    await user.save();
    
    // Create transaction record
    await PointsTransaction.create({
      user: userId,
      amount: pointsCost,
      type: 'spend',
      source: 'exchange',
      description: `兑换${itemName}`,
      relatedId: itemId
    });
    
    res.json({
      success: true,
      message: '兑换成功',
      data: {
        remainingPoints: user.points
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Award points (for system actions)
exports.awardPoints = async (userId, amount, source, description, relatedId = null) => {
  try {
    await User.findByIdAndUpdate(userId, { $inc: { points: amount } });
    
    await PointsTransaction.create({
      user: userId,
      amount,
      type: 'earn',
      source,
      description,
      relatedId
    });
    
    return true;
  } catch (error) {
    console.error('Error awarding points:', error);
    return false;
  }
};
