const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true
  },
  pet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pet',
    required: true
  },
  serviceType: {
    type: String,
    required: true
  },
  scheduledDate: {
    type: Date,
    required: true
  },
  scheduledTime: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    default: 60
  },
  notes: {
    specialNeeds: String,
    petHabits: String,
    allergies: String
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  payment: {
    amount: Number,
    deposit: Number,
    status: {
      type: String,
      enum: ['unpaid', 'deposit-paid', 'paid', 'refunded'],
      default: 'unpaid'
    },
    method: String,
    transactionId: String
  },
  progress: [{
    status: String,
    description: String,
    images: [String],
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  rating: {
    score: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: String,
    createdAt: Date
  },
  cancellation: {
    reason: String,
    cancelledBy: {
      type: String,
      enum: ['user', 'provider', 'system']
    },
    cancelledAt: Date
  }
}, {
  timestamps: true
});

// Indexes
bookingSchema.index({ user: 1, scheduledDate: -1 });
bookingSchema.index({ service: 1, scheduledDate: 1 });
bookingSchema.index({ status: 1, scheduledDate: 1 });

module.exports = mongoose.model('Booking', bookingSchema);
