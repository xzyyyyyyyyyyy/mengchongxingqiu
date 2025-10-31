const mongoose = require('mongoose');

const healthLogSchema = new mongoose.Schema({
  pet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pet',
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  weight: {
    type: Number,
    min: 0
  },
  temperature: {
    type: Number,
    min: 0
  },
  diet: {
    foodAmount: Number,
    waterAmount: Number,
    appetite: {
      type: String,
      enum: ['excellent', 'good', 'fair', 'poor']
    },
    meals: [{
      time: String,
      food: String,
      amount: String
    }]
  },
  bowelMovement: {
    frequency: Number,
    consistency: {
      type: String,
      enum: ['normal', 'soft', 'hard', 'diarrhea']
    },
    notes: String
  },
  energy: {
    level: {
      type: String,
      enum: ['very-low', 'low', 'normal', 'high', 'very-high']
    },
    playfulness: Number,
    notes: String
  },
  mood: {
    type: String,
    enum: ['happy', 'normal', 'anxious', 'sad', 'irritable']
  },
  symptoms: [{
    type: String
  }],
  medications: [{
    name: String,
    dosage: String,
    time: String,
    taken: Boolean
  }],
  activities: [{
    type: String,
    duration: Number,
    intensity: String
  }],
  notes: {
    type: String,
    maxlength: 500
  },
  alerts: [{
    type: {
      type: String,
      enum: ['warning', 'attention', 'critical']
    },
    message: String,
    suggestion: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Index for querying logs by pet and date
healthLogSchema.index({ pet: 1, date: -1 });
healthLogSchema.index({ pet: 1, createdAt: -1 });

module.exports = mongoose.model('HealthLog', healthLogSchema);
