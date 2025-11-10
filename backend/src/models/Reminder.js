const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  pet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pet',
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['vaccine', 'deworming', 'grooming', 'checkup', 'feeding', 'training', 'seasonal']
  },
  title: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String
  },
  repeat: {
    type: String,
    enum: ['once', 'daily', 'weekly', 'monthly'],
    default: 'once'
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'cancelled'],
    default: 'pending'
  },
  notes: {
    type: String
  },
  notificationSettings: {
    app: {
      type: Boolean,
      default: true
    },
    sms: {
      type: Boolean,
      default: false
    },
    email: {
      type: Boolean,
      default: true
    },
    calendar: {
      type: Boolean,
      default: true
    },
    advanceDays: {
      type: Number,
      default: 3
    }
  },
  completedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Indexes
reminderSchema.index({ user: 1, date: 1 });
reminderSchema.index({ pet: 1, status: 1 });
reminderSchema.index({ status: 1, date: 1 });

module.exports = mongoose.model('Reminder', reminderSchema);
