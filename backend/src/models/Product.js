const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, '请输入商品名称']
  },
  description: {
    type: String,
    required: true
  },
  category: {
    main: {
      type: String,
      required: true,
      enum: ['food', 'supplies', 'health', 'grooming', 'toys', 'clothing', 'other']
    },
    sub: String
  },
  brand: String,
  images: [{
    url: String,
    isMain: Boolean
  }],
  specifications: [{
    name: String,
    value: String
  }],
  variants: [{
    name: String,
    options: [String],
    priceModifier: Number
  }],
  pricing: {
    originalPrice: {
      type: Number,
      required: true
    },
    currentPrice: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: 'CNY'
    }
  },
  inventory: {
    stock: {
      type: Number,
      required: true,
      min: 0
    },
    lowStockThreshold: {
      type: Number,
      default: 10
    }
  },
  petTypes: [{
    type: String,
    enum: ['cat', 'dog', 'rabbit', 'hamster', 'bird', 'fish', 'all']
  }],
  ageGroups: [{
    type: String,
    enum: ['puppy', 'kitten', 'adult', 'senior', 'all']
  }],
  certifications: {
    brandAuthorization: String,
    qualityReport: String,
    traceability: {
      enabled: Boolean,
      qrCode: String,
      origin: String,
      productionProcess: [String]
    }
  },
  shipping: {
    isFreeShipping: Boolean,
    weight: Number,
    dimensions: {
      length: Number,
      width: Number,
      height: Number
    }
  },
  policies: {
    returnDays: {
      type: Number,
      default: 7
    },
    allergyReturn: {
      type: Boolean,
      default: true
    }
  },
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
    isVerified: Boolean,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  salesCount: {
    type: Number,
    default: 0
  },
  viewCount: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexes
productSchema.index({ 'category.main': 1, 'pricing.currentPrice': 1 });
productSchema.index({ petTypes: 1, salesCount: -1 });
productSchema.index({ 'rating.average': -1 });
productSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Product', productSchema);
