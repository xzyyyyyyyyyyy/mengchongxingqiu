const Reminder = require('../models/Reminder');

// Get all reminders for user
exports.getReminders = async (req, res) => {
  try {
    const { status, petId } = req.query;
    const query = { user: req.user.id };
    
    if (status) {
      query.status = status;
    }
    
    if (petId) {
      query.pet = petId;
    }
    
    const reminders = await Reminder.find(query)
      .sort({ date: 1 })
      .populate('pet', 'name avatar');
    
    res.json({
      success: true,
      data: reminders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Create a new reminder
exports.createReminder = async (req, res) => {
  try {
    const reminderData = {
      ...req.body,
      user: req.user.id
    };
    
    const reminder = await Reminder.create(reminderData);
    
    res.status(201).json({
      success: true,
      data: reminder
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update a reminder
exports.updateReminder = async (req, res) => {
  try {
    const { id } = req.params;
    
    const reminder = await Reminder.findOne({ _id: id, user: req.user.id });
    
    if (!reminder) {
      return res.status(404).json({
        success: false,
        message: '提醒不存在'
      });
    }
    
    Object.assign(reminder, req.body);
    await reminder.save();
    
    res.json({
      success: true,
      data: reminder
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Mark reminder as completed
exports.completeReminder = async (req, res) => {
  try {
    const { id } = req.params;
    
    const reminder = await Reminder.findOneAndUpdate(
      { _id: id, user: req.user.id },
      { status: 'completed', completedAt: new Date() },
      { new: true }
    );
    
    if (!reminder) {
      return res.status(404).json({
        success: false,
        message: '提醒不存在'
      });
    }
    
    res.json({
      success: true,
      data: reminder
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Delete a reminder
exports.deleteReminder = async (req, res) => {
  try {
    const { id } = req.params;
    
    const reminder = await Reminder.findOneAndDelete({ _id: id, user: req.user.id });
    
    if (!reminder) {
      return res.status(404).json({
        success: false,
        message: '提醒不存在'
      });
    }
    
    res.json({
      success: true,
      message: '删除成功'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get reminders statistics
exports.getStats = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const total = await Reminder.countDocuments({ user: userId });
    const pending = await Reminder.countDocuments({ user: userId, status: 'pending' });
    const completed = await Reminder.countDocuments({ user: userId, status: 'completed' });
    
    // Get upcoming reminders (within 3 days)
    const threeDaysLater = new Date();
    threeDaysLater.setDate(threeDaysLater.getDate() + 3);
    
    const upcoming = await Reminder.countDocuments({
      user: userId,
      status: 'pending',
      date: { $lte: threeDaysLater }
    });
    
    const recurring = await Reminder.countDocuments({
      user: userId,
      repeat: { $ne: 'once' }
    });
    
    res.json({
      success: true,
      data: {
        total,
        pending,
        completed,
        upcoming,
        recurring
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
