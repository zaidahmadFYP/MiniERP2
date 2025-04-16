const mongoose = require('mongoose');

const posconfigSchema = new mongoose.Schema({
  PosID: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  RegistrationNumber: {
    type: String,
    required: true,
    trim: true
  },
  AuthorityType: {
    type: String,
    required: true,
    enum: ['FBR', 'KPRA', 'PRA'],
    trim: true
  },
  POSStatus: {
    type: String,
    required: true,
    enum: ['Online', 'Offline'],
    trim: true
  },
  Username: {
    type: String,
    trim: true,
    default: null
  },
  Password: {
    type: String,
    trim: true,
    default: null
  },
  TimeBound: {
    Start: {
      type: Date,
      required: true
    },
    End: {
      type: Date,
      required: true
    }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Posconfig', posconfigSchema);