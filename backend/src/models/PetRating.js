const mongoose = require('mongoose');

const petRatingSchema = new mongoose.Schema({
  pet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pet',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Overall rating
  overall: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  // Detailed ratings
  stickiness: {
    type: Number,
    min: 1,
    max: 5
  },
  intelligence: {
    type: Number,
    min: 1,
    max: 5
  },
  activeness: {
    type: Number,
    min: 1,
    max: 5
  },
  shedding: {
    type: Number,
    min: 1,
    max: 5
  },
  // Review content
  title: {
    type: String,
    maxlength: 100
  },
  content: {
    type: String,
    maxlength: 1000
  },
  // Images for the review
  images: [{
    type: String
  }],
  // Helpful count
  helpfulCount: {
    type: Number,
    default: 0
  },
  helpfulBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

// Compound index to ensure a user can only rate a pet once
petRatingSchema.index({ pet: 1, user: 1 }, { unique: true });

// Index for querying pet ratings
petRatingSchema.index({ pet: 1, createdAt: -1 });
petRatingSchema.index({ pet: 1, overall: -1 });

module.exports = mongoose.model('PetRating', petRatingSchema);
