const mongoose = require('mongoose');

const pointsTransactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['earn', 'spend']
  },
  source: {
    type: String,
    required: true,
    enum: ['post', 'like', 'health_checkin', 'invite', 'purchase', 'ranking', 'exchange', 'admin']
  },
  description: {
    type: String,
    required: true
  },
  relatedId: {
    type: mongoose.Schema.Types.ObjectId
  }
}, {
  timestamps: true
});

// Index for user queries
pointsTransactionSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('PointsTransaction', pointsTransactionSchema);
