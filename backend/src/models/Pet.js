const mongoose = require('mongoose');

const petSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, '请输入宠物名字'],
    trim: true
  },
  species: {
    type: String,
    required: [true, '请选择宠物种类'],
    enum: ['cat', 'dog', 'rabbit', 'hamster', 'bird', 'fish', 'other']
  },
  breed: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'unknown'],
    default: 'unknown'
  },
  birthDate: {
    type: Date
  },
  avatar: {
    type: String,
    default: '/uploads/pets/default.png'
  },
  identityInfo: {
    chipNumber: String,
    registrationNumber: String,
    idPhotos: [String]
  },
  appearance: {
    color: String,
    weight: Number,
    height: Number,
    distinctiveFeatures: String
  },
  personality: {
    traits: [String],
    temperament: String,
    energy: {
      type: String,
      enum: ['low', 'medium', 'high']
    }
  },
  habits: {
    diet: {
      foodType: String,
      feedingSchedule: [String],
      allergies: [String],
      favorites: [String]
    },
    activity: {
      exerciseLevel: String,
      favoriteToys: [String],
      favoriteActivities: [String]
    },
    sleep: {
      schedule: String,
      preferredSpot: String
    }
  },
  health: {
    vaccinations: [{
      name: String,
      date: Date,
      nextDue: Date,
      document: String
    }],
    medicalHistory: [{
      date: Date,
      diagnosis: String,
      treatment: String,
      veterinarian: String,
      documents: [String]
    }],
    medications: [{
      name: String,
      dosage: String,
      frequency: String,
      startDate: Date,
      endDate: Date
    }],
    checkups: [{
      date: Date,
      type: String,
      findings: String,
      report: String
    }],
    conditions: [String]
  },
  documents: [{
    type: String,
    url: String,
    uploadDate: Date,
    category: {
      type: String,
      enum: ['vaccination', 'checkup', 'certificate', 'other']
    }
  }],
  reminders: [{
    type: {
      type: String,
      enum: ['vaccination', 'deworming', 'grooming', 'checkup', 'medication', 'other']
    },
    date: Date,
    frequency: String,
    note: String,
    completed: {
      type: Boolean,
      default: false
    }
  }],
  virtualAvatar: {
    style: {
      type: String,
      enum: ['cartoon', 'chibi', 'realistic', 'chinese']
    },
    imageUrl: String,
    accessories: [String]
  }
}, {
  timestamps: true
});

// Index for searching pets
petSchema.index({ name: 'text', breed: 'text' });
petSchema.index({ owner: 1, createdAt: -1 });

module.exports = mongoose.model('Pet', petSchema);
