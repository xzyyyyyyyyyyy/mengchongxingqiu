const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settingsController');
const { protect } = require('../middleware/auth');

// @route   GET /api/settings
// @desc    Get user settings
// @access  Private
router.get('/', protect, settingsController.getSettings);

// @route   PUT /api/settings
// @desc    Update all settings
// @access  Private
router.put('/', protect, settingsController.updateSettings);

// @route   PUT /api/settings/appearance
// @desc    Update appearance settings
// @access  Private
router.put('/appearance', protect, settingsController.updateAppearance);

// @route   PUT /api/settings/notifications
// @desc    Update notification settings
// @access  Private
router.put('/notifications', protect, settingsController.updateNotifications);

// @route   PUT /api/settings/privacy
// @desc    Update privacy settings
// @access  Private
router.put('/privacy', protect, settingsController.updatePrivacy);

module.exports = router;
