const mongoose = require('mongoose');

const petDocumentSchema = new mongoose.Schema({
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
    enum: ['vaccine', 'quarantine', 'chip', 'insurance', 'license']
  },
  title: {
    type: String,
    required: true
  },
  issueDate: {
    type: Date,
    required: true
  },
  expiryDate: {
    type: Date
  },
  fileUrl: {
    type: String,
    required: true
  },
  fileType: {
    type: String,
    required: true
  },
  thumbnail: {
    type: String
  },
  metadata: {
    issuer: String,
    certificateNumber: String,
    notes: String
  }
}, {
  timestamps: true
});

// Indexes
petDocumentSchema.index({ user: 1, type: 1 });
petDocumentSchema.index({ pet: 1 });
petDocumentSchema.index({ expiryDate: 1 });

module.exports = mongoose.model('PetDocument', petDocumentSchema);
