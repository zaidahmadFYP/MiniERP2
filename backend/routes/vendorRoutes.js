const express = require('express');
const router = express.Router();
const Vendor = require('../models/vendorModel');

// Generate unique IDs
const generateId = (prefix) => `${prefix}${Math.floor(Math.random() * 10000)}`;

// Get all vendors
router.get('/', async (req, res) => {
  try {
    const vendors = await Vendor.find();
    res.status(200).json(vendors);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch vendors', message: error.message });
  }
});

// Get vendor by ID
router.get('/:vendorId', async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ vendorId: req.params.vendorId });
    if (!vendor) {
      return res.status(404).json({ error: 'Vendor not found' });
    }
    res.status(200).json(vendor);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch vendor', message: error.message });
  }
});

// Create a new vendor
router.post('/', async (req, res) => {
  try {
    const vendorData = {
      ...req.body,
      vendorId: generateId('VEND'),
      productList: req.body.productList?.map(product => ({
        ...product,
        productId: generateId('PROD'),
        price: product.price || 0 // Ensure price exists with default value if missing
      })) || []
    };
    const vendor = new Vendor(vendorData);
    await vendor.save();
    res.status(201).json(vendor);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create vendor', message: error.message });
  }
});

// Update a vendor
router.put('/:vendorId', async (req, res) => {
  try {
    // If updating productList directly, ensure each product has a price
    if (req.body.productList) {
      req.body.productList = req.body.productList.map(product => ({
        ...product,
        price: product.price !== undefined ? product.price : 0 // Ensure price exists
      }));
    }
    
    const vendor = await Vendor.findOneAndUpdate(
      { vendorId: req.params.vendorId },
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!vendor) {
      return res.status(404).json({ error: 'Vendor not found' });
    }
    res.status(200).json(vendor);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update vendor', message: error.message });
  }
});

// Delete a vendor
router.delete('/:vendorId', async (req, res) => {
  try {
    const vendor = await Vendor.findOneAndDelete({ vendorId: req.params.vendorId });
    if (!vendor) {
      return res.status(404).json({ error: 'Vendor not found' });
    }
    res.status(200).json({ message: 'Vendor deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete vendor', message: error.message });
  }
});

// Add product to vendor
router.post('/:vendorId/products', async (req, res) => {
  try {
    const productData = {
      ...req.body,
      productId: generateId('PROD'),
      price: req.body.price || 0 // Ensure price exists with default value if missing
    };
    const vendor = await Vendor.findOneAndUpdate(
      { vendorId: req.params.vendorId },
      { $push: { productList: productData } },
      { new: true, runValidators: true }
    );
    if (!vendor) {
      return res.status(404).json({ error: 'Vendor not found' });
    }
    res.status(201).json(vendor);
  } catch (error) {
    res.status(400).json({ error: 'Failed to add product', message: error.message });
  }
});

// Update a product in a vendor's product list
router.put('/:vendorId/products/:productId', async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ vendorId: req.params.vendorId });
    if (!vendor) {
      return res.status(404).json({ error: 'Vendor not found' });
    }
    
    const productIndex = vendor.productList.findIndex(
      product => product.productId === req.params.productId
    );
    
    if (productIndex === -1) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    // Update product fields while maintaining productId
    const productId = vendor.productList[productIndex].productId;
    vendor.productList[productIndex] = {
      ...req.body,
      productId,
      price: req.body.price !== undefined ? req.body.price : vendor.productList[productIndex].price
    };
    
    await vendor.save();
    res.status(200).json(vendor);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update product', message: error.message });
  }
});

// Delete a product from a vendor
router.delete('/:vendorId/products/:productId', async (req, res) => {
  try {
    const vendor = await Vendor.findOneAndUpdate(
      { vendorId: req.params.vendorId },
      { $pull: { productList: { productId: req.params.productId } } },
      { new: true }
    );
    
    if (!vendor) {
      return res.status(404).json({ error: 'Vendor not found' });
    }
    
    res.status(200).json({ message: 'Product deleted successfully', vendor });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete product', message: error.message });
  }
});

module.exports = router;