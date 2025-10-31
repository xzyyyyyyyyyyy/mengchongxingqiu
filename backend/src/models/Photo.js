const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  pet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pet',
    required: true
  },
  url: {
    type: String,
    required: true
  },
  thumbnail: String,
  caption: {
    type: String,
    maxlength: 500
  },
  aiAnalysis: {
    tags: [{
      name: String,
      confidence: Number
    }],
    scene: String,
    behavior: String,
    emotion: String,
    quality: {
      score: Number,
      isWellComposed: Boolean,
      isGoodExpression: Boolean
    }
  },
  milestones: [{
    type: String,
    enum: ['first_bath', 'first_walk', 'first_friend', 'birthday', 'adoption_day', 'teething', 'custom']
  }],
  customMilestone: String,
  albumCategory: {
    type: String,
    enum: ['daily', 'milestone', 'weekly', 'growth', 'special'],
    default: 'daily'
  },
  storyTimeline: {
    chapter: String,
    order: Number,
    storyText: String
  },
  styles: [{
    type: {
      type: String,
      enum: ['cartoon', 'painting', 'holiday', 'sketch']
    },
    url: String
  }],
  location: {
    name: String,
    coordinates: {
      type: [Number],
      index: '2dsphere'
    }
  },
  takenAt: {
    type: Date
  },
  isPrivate: {
    type: Boolean,
    default: false
  },
  isFeatured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexes
photoSchema.index({ pet: 1, createdAt: -1 });
photoSchema.index({ owner: 1, createdAt: -1 });
photoSchema.index({ 'aiAnalysis.tags.name': 1 });
photoSchema.index({ milestones: 1 });
photoSchema.index({ albumCategory: 1, pet: 1 });

module.exports = mongoose.model('Photo', photoSchema);
