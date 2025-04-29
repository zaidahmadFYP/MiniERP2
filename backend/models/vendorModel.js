const mongoose = require('mongoose');

// Product Schema (embedded in Vendor)
const productSchema = new mongoose.Schema({
  productId: { type: String, required: true, unique: true },
  productName: { type: String, required: true },
  measure: { type: String, required: true },
  quantity: { type: Number, required: true, min: 0 },
  price: { type: Number, required: true, min: 0 } // Added price field
}, { _id: false });

// Vendor Schema
const vendorSchema = new mongoose.Schema({
  vendorId: { type: String, required: true, unique: true },
  vendorName: { type: String, required: true },
  searchName: { type: String, required: true },
  phone: { type: String, default: '' },
  city: { type: String, default: '' },
  productList: [productSchema]
}, {
  timestamps: true,
  collection: 'vendors'
});

// Create Vendor model
const Vendor = mongoose.model('Vendor', vendorSchema);

module.exports = Vendor;