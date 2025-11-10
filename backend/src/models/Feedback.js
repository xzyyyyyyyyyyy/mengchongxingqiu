const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['bug', 'suggestion', 'question', 'other'],
    required: true
  },
  content: {
    type: String,
    required: [true, '请输入反馈内容'],
    maxlength: [1000, '反馈内容最多1000个字符']
  },
  contact: {
    type: String,
    maxlength: [100, '联系方式最多100个字符']
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'resolved', 'closed'],
    default: 'pending'
  },
  response: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for searching
feedbackSchema.index({ user: 1, createdAt: -1 });
feedbackSchema.index({ status: 1 });

module.exports = mongoose.model('Feedback', feedbackSchema);
