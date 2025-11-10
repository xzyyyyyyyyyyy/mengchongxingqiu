const mongoose = require('mongoose');

const petRankingSchema = new mongoose.Schema({
  pet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pet',
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['cute', 'wellBehaved', 'active', 'smart']
  },
  votes: {
    type: Number,
    default: 0
  },
  voters: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    votedAt: {
      type: Date,
      default: Date.now
    }
  }],
  weekStart: {
    type: Date,
    required: true
  }
}, {
  timestamps: true
});

// Index for efficient querying
petRankingSchema.index({ category: 1, weekStart: 1, votes: -1 });
petRankingSchema.index({ pet: 1, category: 1, weekStart: 1 });

module.exports = mongoose.model('PetRanking', petRankingSchema);
