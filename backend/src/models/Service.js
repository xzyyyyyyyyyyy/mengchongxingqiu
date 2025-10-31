const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  provider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, '请输入服务名称']
  },
  category: {
    type: String,
    required: true,
    enum: ['hospital', 'grooming', 'boarding', 'feeding', 'training', 'transport', 'funeral', 'photography', 'daycare']
  },
  description: {
    type: String,
    required: true,
    maxlength: 1000
  },
  images: [String],
  location: {
    address: String,
    city: String,
    province: String,
    coordinates: {
      type: [Number],
      index: '2dsphere',
      required: true
    }
  },
  contact: {
    phone: String,
    wechat: String,
    email: String
  },
  businessHours: [{
    day: {
      type: String,
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    },
    open: String,
    close: String,
    isClosed: Boolean
  }],
  pricing: {
    currency: {
      type: String,
      default: 'CNY'
    },
    priceRange: {
      min: Number,
      max: Number
    },
    services: [{
      name: String,
      price: Number,
      duration: Number,
      description: String
    }]
  },
  credentials: {
    businessLicense: String,
    certifications: [String],
    staffQualifications: [String]
  },
  features: [String],
  specialties: [String],
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    content: String,
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  starLevel: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes
serviceSchema.index({ category: 1, 'rating.average': -1 });
serviceSchema.index({ starLevel: -1 });

module.exports = mongoose.model('Service', serviceSchema);
