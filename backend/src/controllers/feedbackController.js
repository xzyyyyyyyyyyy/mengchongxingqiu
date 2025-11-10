const Feedback = require('../models/Feedback');

// @desc    Submit feedback
// @route   POST /api/feedback
// @access  Private
exports.submitFeedback = async (req, res) => {
  try {
    const { type, content, contact } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: '请输入反馈内容'
      });
    }

    const feedback = await Feedback.create({
      user: req.user.id,
      type: type || 'other',
      content: content.trim(),
      contact: contact || ''
    });

    res.status(201).json({
      success: true,
      message: '感谢您的反馈！我们会认真处理。',
      data: feedback
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get user's feedback
// @route   GET /api/feedback
// @access  Private
exports.getUserFeedback = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const feedback = await Feedback.find({ user: req.user.id })
      .sort('-createdAt')
      .limit(limit)
      .skip(skip);

    const total = await Feedback.countDocuments({ user: req.user.id });

    res.json({
      success: true,
      count: feedback.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: feedback
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all feedback (Admin only)
// @route   GET /api/feedback/all
// @access  Private/Admin
exports.getAllFeedback = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const { status } = req.query;

    // Validate status parameter against allowed values
    const validStatuses = ['pending', 'processing', 'resolved', 'closed'];
    
    let query = {};
    if (status) {
      // Only allow valid status values to prevent injection
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid status parameter'
        });
      }
      query.status = status;
    }

    const feedback = await Feedback.find(query)
      .populate('user', 'username email avatar')
      .sort('-createdAt')
      .limit(limit)
      .skip(skip);

    const total = await Feedback.countDocuments(query);

    res.json({
      success: true,
      count: feedback.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: feedback
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update feedback status (Admin only)
// @route   PUT /api/feedback/:id
// @access  Private/Admin
exports.updateFeedback = async (req, res) => {
  try {
    const { status, response } = req.body;

    // Validate status parameter if provided
    const validStatuses = ['pending', 'processing', 'resolved', 'closed'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }

    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: '反馈未找到'
      });
    }

    if (status) {
      feedback.status = status;
    }
    if (response) {
      feedback.response = response;
    }

    await feedback.save();

    res.json({
      success: true,
      data: feedback
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
