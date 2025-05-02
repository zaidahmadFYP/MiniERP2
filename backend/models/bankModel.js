const mongoose = require('mongoose');

// Define the bank schema
const bankSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Bank name is required'],
    trim: true,
    unique: true
  },
  code: {
    type: String,
    required: [true, 'Bank code is required'],
    trim: true,
    unique: true
  },
  address: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
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
  timestamps: true,
  versionKey: false
});

// Pre-save middleware to update the 'updatedAt' field
bankSchema.pre('findOneAndUpdate', function(next) {
  this.set({ updatedAt: Date.now() });
  next();
});

// Create a model from the schema
const Bank = mongoose.model('Bank', bankSchema);

module.exports = Bank;