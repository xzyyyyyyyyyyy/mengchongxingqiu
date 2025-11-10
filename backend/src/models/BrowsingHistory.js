const mongoose = require('mongoose');

const browsingHistorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  itemType: {
    type: String,
    enum: ['post', 'pet', 'product', 'service'],
    required: true
  },
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  // Store reference to the actual item
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  },
  pet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pet'
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  },
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service'
  },
  viewedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for efficient querying
browsingHistorySchema.index({ user: 1, viewedAt: -1 });
browsingHistorySchema.index({ user: 1, itemType: 1, viewedAt: -1 });

// TTL index to automatically delete old history after 90 days
browsingHistorySchema.index({ viewedAt: 1 }, { expireAfterSeconds: 7776000 });

module.exports = mongoose.model('BrowsingHistory', browsingHistorySchema);
