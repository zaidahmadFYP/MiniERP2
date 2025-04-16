const express = require('express');
const router = express.Router();
const Posconfig = require('../models/posconfigModel');

// POST: Create a new POS configuration
router.post('/', async (req, res) => {
  try {
    const posconfigData = req.body;
    
    // Validate required fields (Username and Password are optional)
    const requiredFields = ['PosID', 'RegistrationNumber', 'AuthorityType', 'POSStatus', 'TimeBound'];
    for (const field of requiredFields) {
      if (!posconfigData[field]) {
        return res.status(400).json({ error: `Missing required field: ${field}` });
      }
    }

    // Validate TimeBound
    if (!posconfigData.TimeBound.Start || !posconfigData.TimeBound.End) {
      return res.status(400).json({ error: 'TimeBound must include Start and End dates' });
    }

    const posconfig = new Posconfig(posconfigData);
    const savedPosconfig = await posconfig.save();
    res.status(201).json(savedPosconfig);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'PosID must be unique' });
    }
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

// GET: Fetch all POS configurations
router.get('/', async (req, res) => {
  try {
    const posconfigs = await Posconfig.find();
    res.status(200).json(posconfigs);
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

// PATCH: Edit a specific POS configuration by PosID
router.patch('/:posID', async (req, res) => {
  try {
    const posID = req.params.posID;
    const updates = req.body;

    // Prevent updating PosID
    if (updates.PosID) {
      return res.status(400).json({ error: 'Cannot update PosID' });
    }

    // Validate TimeBound if provided
    if (updates.TimeBound && (!updates.TimeBound.Start || !updates.TimeBound.End)) {
      return res.status(400).json({ error: 'TimeBound must include Start and End dates' });
    }

    const posconfig = await Posconfig.findOneAndUpdate(
      { PosID: posID },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!posconfig) {
      return res.status(404).json({ error: 'POS configuration not found' });
    }

    res.status(200).json(posconfig);
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

module.exports = router;