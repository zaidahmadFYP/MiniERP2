const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  itemId: {
    type: String,
    required: true,
  },
  itemName: {
    type: String,
    required: true,
  },
  itemQuantity: {
    type: Number,
    required: true,
  }
}, { _id: false });

const transactionSchema = new mongoose.Schema({
  items: {
    type: [itemSchema],
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
  paymentMethod: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  }
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
