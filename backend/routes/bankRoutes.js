const express = require('express');
const router = express.Router();
const Bank = require('../models/bankModel');

/**
 * @route   GET /api/banks
 * @desc    Get all banks
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const banks = await Bank.find().sort({ createdAt: -1 });
    res.json(banks);
  } catch (error) {
    console.error('Error fetching banks:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

/**
 * @route   GET /api/banks/:id
 * @desc    Get a single bank by ID
 * @access  Public
 */
router.get('/:id', async (req, res) => {
  try {
    const bank = await Bank.findById(req.params.id);
    
    if (!bank) {
      return res.status(404).json({ message: 'Bank not found' });
    }
    
    res.json(bank);
  } catch (error) {
    console.error('Error fetching bank:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Bank not found - Invalid ID' });
    }
    
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

/**
 * @route   POST /api/banks
 * @desc    Create a new bank
 * @access  Public
 */
router.post('/', async (req, res) => {
  try {
    const { name, code, address, isActive } = req.body;
    
    // Check if bank with same name or code already exists
    const existingBank = await Bank.findOne({
      $or: [{ name }, { code }]
    });
    
    if (existingBank) {
      if (existingBank.name === name) {
        return res.status(400).json({ message: 'A bank with this name already exists' });
      }
      if (existingBank.code === code) {
        return res.status(400).json({ message: 'A bank with this code already exists' });
      }
    }
    
    // Create new bank
    const newBank = new Bank({
      name,
      code,
      address,
      isActive: isActive !== undefined ? isActive : true
    });
    
    const savedBank = await newBank.save();
    res.status(201).json(savedBank);
  } catch (error) {
    console.error('Error creating bank:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

/**
 * @route   PUT /api/banks/:id
 * @desc    Update a bank
 * @access  Public
 */
router.put('/:id', async (req, res) => {
  try {
    const { name, code, address, isActive } = req.body;
    
    // Check if another bank with the same name or code exists (excluding the current bank)
    if (name || code) {
      const query = {
        _id: { $ne: req.params.id },
        $or: []
      };
      
      if (name) query.$or.push({ name });
      if (code) query.$or.push({ code });
      
      if (query.$or.length > 0) {
        const existingBank = await Bank.findOne(query);
        
        if (existingBank) {
          if (name && existingBank.name === name) {
            return res.status(400).json({ message: 'A bank with this name already exists' });
          }
          if (code && existingBank.code === code) {
            return res.status(400).json({ message: 'A bank with this code already exists' });
          }
        }
      }
    }
    
    // Update the bank
    const updatedBank = await Bank.findByIdAndUpdate(
      req.params.id,
      { 
        $set: {
          name,
          code,
          address,
          isActive
        } 
      },
      { new: true, runValidators: true }
    );
    
    if (!updatedBank) {
      return res.status(404).json({ message: 'Bank not found' });
    }
    
    res.json(updatedBank);
  } catch (error) {
    console.error('Error updating bank:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Bank not found - Invalid ID' });
    }
    
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

/**
 * @route   DELETE /api/banks/:id
 * @desc    Delete a bank
 * @access  Public
 */
router.delete('/:id', async (req, res) => {
  try {
    const deletedBank = await Bank.findByIdAndDelete(req.params.id);
    
    if (!deletedBank) {
      return res.status(404).json({ message: 'Bank not found' });
    }
    
    res.json({ message: 'Bank removed successfully', bank: deletedBank });
  } catch (error) {
    console.error('Error deleting bank:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Bank not found - Invalid ID' });
    }
    
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

/**
 * @route   GET /api/banks/active
 * @desc    Get all active banks
 * @access  Public
 */
router.get('/status/active', async (req, res) => {
  try {
    const activeBanks = await Bank.find({ isActive: true }).sort({ name: 1 });
    res.json(activeBanks);
  } catch (error) {
    console.error('Error fetching active banks:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;