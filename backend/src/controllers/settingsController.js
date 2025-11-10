const UserSettings = require('../models/UserSettings');

// Get user settings
exports.getSettings = async (req, res) => {
  try {
    let settings = await UserSettings.findOne({ user: req.user.id });
    
    if (!settings) {
      // Create default settings
      settings = await UserSettings.create({ user: req.user.id });
    }
    
    res.json({
      success: true,
      data: settings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update appearance settings
exports.updateAppearance = async (req, res) => {
  try {
    const { theme, customLayout } = req.body;
    
    let settings = await UserSettings.findOne({ user: req.user.id });
    
    if (!settings) {
      settings = await UserSettings.create({ user: req.user.id });
    }
    
    if (theme) {
      settings.appearance.theme = theme;
    }
    
    if (customLayout) {
      settings.appearance.customLayout = customLayout;
    }
    
    await settings.save();
    
    res.json({
      success: true,
      data: settings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update notification settings
exports.updateNotifications = async (req, res) => {
  try {
    const { push, email, sms, doNotDisturb } = req.body;
    
    let settings = await UserSettings.findOne({ user: req.user.id });
    
    if (!settings) {
      settings = await UserSettings.create({ user: req.user.id });
    }
    
    if (push !== undefined) {
      settings.notifications.push = push;
    }
    
    if (email !== undefined) {
      settings.notifications.email = email;
    }
    
    if (sms !== undefined) {
      settings.notifications.sms = sms;
    }
    
    if (doNotDisturb) {
      settings.notifications.doNotDisturb = {
        ...settings.notifications.doNotDisturb,
        ...doNotDisturb
      };
    }
    
    await settings.save();
    
    res.json({
      success: true,
      data: settings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update privacy settings
exports.updatePrivacy = async (req, res) => {
  try {
    const { contentVisibility, showLocation, hidePersonalInfo } = req.body;
    
    let settings = await UserSettings.findOne({ user: req.user.id });
    
    if (!settings) {
      settings = await UserSettings.create({ user: req.user.id });
    }
    
    if (contentVisibility) {
      settings.privacy.contentVisibility = contentVisibility;
    }
    
    if (showLocation !== undefined) {
      settings.privacy.showLocation = showLocation;
    }
    
    if (hidePersonalInfo !== undefined) {
      settings.privacy.hidePersonalInfo = hidePersonalInfo;
    }
    
    await settings.save();
    
    res.json({
      success: true,
      data: settings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update all settings
exports.updateSettings = async (req, res) => {
  try {
    let settings = await UserSettings.findOne({ user: req.user.id });
    
    if (!settings) {
      settings = await UserSettings.create({
        user: req.user.id,
        ...req.body
      });
    } else {
      Object.assign(settings, req.body);
      await settings.save();
    }
    
    res.json({
      success: true,
      data: settings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
