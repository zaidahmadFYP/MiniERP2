const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const User = require('../models/user');

// Create a new user
exports.createUser = async (req, res) => {
  try {
    const { firstName, lastName, displayName, username, password, role, zone, branch, modules } = req.body;
    if (!firstName || !lastName || !displayName || !username || !password || !role || !zone || !branch) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const email = `${username}@cheezious.com`;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(409).json({ message: 'Email already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name: `${firstName} ${lastName}`,
      displayName,
      username,
      email,
      password: hashedPassword,
      plainPassword: password,
      role,
      zone,
      branch,
      registeredModules: modules
    });

    await newUser.save();
    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    console.error('Error creating user:', error.stack);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

// Sign in
exports.signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (!user.password) return res.status(500).json({ message: 'Server error: Missing password data' });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ message: 'Invalid credentials' });

    res.status(200).json({
      name: user.name,
      email: user.email,
      branch: user.branch,
      role: user.role,
      zone: user.zone,
      registeredModules: user.registeredModules
    });
  } catch (error) {
    console.error('Error during sign-in:', error.stack);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Fetch all users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update user
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, displayName, username, branch, role, password, zone } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(id, { name, displayName, username, branch, role, password, zone }, { new: true });
    if (!updatedUser) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update user modules
exports.updateUserModules = async (req, res) => {
  const { id } = req.params;
  const { modules } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(id, { registeredModules: modules }, { new: true, runValidators: true });
    if (!updatedUser) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ message: 'Modules updated successfully', updatedUser });
  } catch (error) {
    console.error('Error updating modules:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Reset password
exports.resetPassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    if (!newPassword) return res.status(400).json({ message: 'New password is required' });

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const updatedUser = await User.findByIdAndUpdate(req.params.id, { password: hashedPassword, plainPassword: newPassword }, { new: true });
    if (!updatedUser) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ message: 'Password reset successfully', user: updatedUser });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid user ID' });

    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Add multiple users
exports.addMultipleUsers = async (req, res) => {
  try {
    const { users } = req.body;
    if (!users || !Array.isArray(users)) return res.status(400).json({ message: 'Invalid user data' });

    for (const user of users) {
      if (!user.username || !user.email || !user.password || !user.role || !user.zone || !user.branch) {
        return res.status(400).json({ message: 'Missing required fields for one or more users' });
      }
    }

    const existingEmails = await User.find({ email: { $in: users.map((user) => user.email) } }).select('email');
    if (existingEmails.length > 0) {
      const existingEmailsList = existingEmails.map((user) => user.email);
      return res.status(409).json({ message: 'Some emails already exist', existingEmails: existingEmailsList });
    }

    const usersToInsert = await Promise.all(users.map(async (user) => {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      return { ...user, password: hashedPassword };
    }));

    await User.insertMany(usersToInsert);
    res.status(201).json({ message: 'Users added successfully' });
  } catch (error) {
    console.error('Error adding users:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
