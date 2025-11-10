const express = require('express');
const router = express.Router();
const reminderController = require('../controllers/reminderController');
const { protect } = require('../middleware/auth');

// @route   GET /api/reminders
// @desc    Get all reminders for user
// @access  Private
router.get('/', protect, reminderController.getReminders);

// @route   GET /api/reminders/stats
// @desc    Get reminders statistics
// @access  Private
router.get('/stats', protect, reminderController.getStats);

// @route   POST /api/reminders
// @desc    Create a new reminder
// @access  Private
router.post('/', protect, reminderController.createReminder);

// @route   PUT /api/reminders/:id
// @desc    Update a reminder
// @access  Private
router.put('/:id', protect, reminderController.updateReminder);

// @route   PUT /api/reminders/:id/complete
// @desc    Mark reminder as completed
// @access  Private
router.put('/:id/complete', protect, reminderController.completeReminder);

// @route   DELETE /api/reminders/:id
// @desc    Delete a reminder
// @access  Private
router.delete('/:id', protect, reminderController.deleteReminder);

module.exports = router;
