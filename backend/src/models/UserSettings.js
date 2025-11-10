const mongoose = require('mongoose');

const userSettingsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  appearance: {
    theme: {
      type: String,
      enum: ['default', 'cute', 'simple', 'dark'],
      default: 'default'
    },
    customLayout: {
      type: [String],
      default: ['feed', 'community', 'services']
    }
  },
  notifications: {
    push: {
      type: Boolean,
      default: true
    },
    email: {
      type: Boolean,
      default: true
    },
    sms: {
      type: Boolean,
      default: false
    },
    doNotDisturb: {
      enabled: {
        type: Boolean,
        default: false
      },
      startTime: {
        type: String,
        default: '22:00'
      },
      endTime: {
        type: String,
        default: '08:00'
      }
    }
  },
  privacy: {
    contentVisibility: {
      type: String,
      enum: ['public', 'friends', 'private'],
      default: 'public'
    },
    showLocation: {
      type: Boolean,
      default: true
    },
    hidePersonalInfo: {
      type: Boolean,
      default: false
    }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('UserSettings', userSettingsSchema);
