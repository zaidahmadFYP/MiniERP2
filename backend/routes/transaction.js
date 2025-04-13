const express = require('express');
const router = express.Router();
const Transaction = require('../models/transaction'); // Adjust path if needed

// GET all transactions
router.get('/', async (req, res) => {
  try {
    const transactions = await Transaction.find();

    res.status(200).json(transactions);
  } catch (err) {
    console.error('Error fetching transactions:', err.message);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
