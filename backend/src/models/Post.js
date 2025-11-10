const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  pet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pet'
  },
  content: {
    type: String,
    required: [true, '请输入内容'],
    maxlength: [2000, '内容最多2000个字符']
  },
  mediaType: {
    type: String,
    enum: ['image', 'video', 'text'],
    default: 'text'
  },
  media: [{
    type: {
      type: String,
      enum: ['image', 'video']
    },
    url: String,
    thumbnail: String,
    duration: Number
  }],
  tags: [{
    type: String,
    trim: true
  }],
  hashtags: [{
    type: String,
    trim: true
  }],
  category: {
    type: String,
    enum: ['daily', 'medical', 'training', 'food', 'travel', 'funny', 'other'],
    default: 'daily'
  },
  location: {
    name: String,
    coordinates: {
      type: [Number]
    }
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  likesCount: {
    type: Number,
    default: 0
  },
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    content: String,
    createdAt: {
      type: Date,
      default: Date.now
    },
    likes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }]
  }],
  commentsCount: {
    type: Number,
    default: 0
  },
  shares: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  sharesCount: {
    type: Number,
    default: 0
  },
  views: {
    type: Number,
    default: 0
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  isPinned: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexes for feed queries
postSchema.index({ author: 1, createdAt: -1 });
postSchema.index({ tags: 1, createdAt: -1 });
postSchema.index({ hashtags: 1, createdAt: -1 });
postSchema.index({ category: 1, createdAt: -1 });
postSchema.index({ likesCount: -1, createdAt: -1 });
postSchema.index({ 'location.coordinates': '2dsphere' });
postSchema.index({ isPublic: 1, createdAt: -1 }); // For trending hashtags query

module.exports = mongoose.model('Post', postSchema);
