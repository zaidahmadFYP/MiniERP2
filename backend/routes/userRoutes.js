const express = require('express');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const router = express.Router();
const User = require('../models/user');

/**
 * Create a new user
 * POST /api/auth
 */
router.post('/', async (req, res) => {
  try {
    const { 
      firstName, 
      lastName, 
      displayName, 
      username, 
      password, 
      role, 
      modules 
    } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !displayName || !username || !password || !role) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }

    const email = `${username.trim()}@loop.com`;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'A user with this email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      name: `${firstName} ${lastName}`,
      displayName,
      username: username.trim(),
      email,
      password: hashedPassword,
      plainPassword: password, // Note: Storing plain passwords is a security risk
      role,
      registeredModules: modules || []
    });

    await newUser.save();
    
    // Return success with user object (excluding password)
    const userResponse = newUser.toObject();
    delete userResponse.password;
    
    res.status(201).json({ 
      message: 'User created successfully', 
      user: userResponse 
    });
  } catch (error) {
    console.error('Error creating user:', error.stack);
    res.status(500).json({ 
      message: 'Internal Server Error', 
      error: error.message 
    });
  }
});

/**
 * User sign in
 * POST /api/auth/signin
 */
router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Validate password
    if (!user.password) {
      return res.status(500).json({ message: 'Server error: Missing password data' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Return user data (excluding sensitive information)
    res.status(200).json({
      id: user._id,
      name: user.name,
      displayName: user.displayName,
      email: user.email,
      role: user.role,
      registeredModules: user.registeredModules
    });
  } catch (error) {
    console.error('Error during sign-in:', error.stack);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
});

/**
 * Get all users
 * GET /api/auth/users
 */
router.get('/users', async (req, res) => {
  try {
    // Find all users but make sure plainPassword is included
    const users = await User.find().select('-password');
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
/**
 * Get a specific user by ID
 * GET /api/auth/:id
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }
    
    // Find user by ID but exclude passwords
    const user = await User.findById(id).select('-password -plainPassword');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * Update user
 * PUT /api/auth/:id
 */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, displayName, username, role } = req.body;
    
    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }
    
    // Create update object with only the fields that were provided
    const updateData = {};
    
    if (firstName && lastName) {
      updateData.name = `${firstName} ${lastName}`;
    }
    
    if (displayName) updateData.displayName = displayName;
    
    if (username) {
      updateData.username = username.trim();
      updateData.email = `${username.trim()}@loop.com`;
      
      // Check if email already exists for another user
      if (updateData.email) {
        const existingUser = await User.findOne({ 
          email: updateData.email,
          _id: { $ne: id } // Exclude current user from check
        });
        
        if (existingUser) {
          return res.status(409).json({ message: 'Email already in use by another user' });
        }
      }
    }
    
    if (role) updateData.role = role;
    
    const updatedUser = await User.findByIdAndUpdate(
      id, 
      updateData,
      { new: true, runValidators: true }
    ).select('-password -plainPassword');
    
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json({ 
      message: 'User updated successfully',
      user: updatedUser 
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * Update user modules
 * PUT /api/auth/:id/modules
 */
router.put('/:id/modules', async (req, res) => {
  try {
    const { id } = req.params;
    const { modules } = req.body;
    
    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }
    
    // Validate modules data
    if (!modules || !Array.isArray(modules)) {
      return res.status(400).json({ message: 'Valid modules array is required' });
    }
    
    const updatedUser = await User.findByIdAndUpdate(
      id, 
      { registeredModules: modules },
      { new: true, runValidators: true }
    ).select('-password -plainPassword');
    
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json({ 
      message: 'Modules updated successfully', 
      user: updatedUser 
    });
  } catch (error) {
    console.error('Error updating modules:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

/**
 * Reset password
 * PUT /api/auth/:id/resetPassword
 */
router.put('/:id/resetPassword', async (req, res) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;
    
    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }
    
    // Validate password
    if (!newPassword) {
      return res.status(400).json({ message: 'New password is required' });
    }
    
    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    const updatedUser = await User.findByIdAndUpdate(
      id, 
      { 
        password: hashedPassword, 
        plainPassword: newPassword // Note: Storing plain passwords is a security risk
      },
      { new: true }
    ).select('-password -plainPassword');
    
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json({ 
      message: 'Password reset successfully', 
      user: updatedUser 
    });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
});

/**
 * Delete user
 * DELETE /api/auth/:id
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }
    
    const deletedUser = await User.findByIdAndDelete(id);
    
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;