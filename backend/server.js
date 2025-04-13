require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const { GridFSBucket } = require('mongodb');
const cors = require('cors');
const { Readable } = require('stream');
const path = require('path');
const axios = require('axios');
const transactionRoutes = require('./routes/transaction');
const userRoutes = require('./routes/user');

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {})
  .then(() => {
    console.log('MongoDB connected successfully');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });

const db = mongoose.connection;
let gridfsBucket;

db.once('open', async () => {
  console.log('MongoDB connected');
  gridfsBucket = new GridFSBucket(db.db, { bucketName: 'uploads' });
  console.log('GridFS initialized');
});
// Routes
app.use('/api/auth', userRoutes);
app.use('/api/transactions', transactionRoutes);

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
