const User = require('../models/user.model');
const mongoose = require('mongoose');  // Ensure mongoose is required if used

// Create a new user
exports.createUser = async (req, res) => {
  try {
    const { name, email, age } = req.body;

    // Basic validation for required fields
    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    if (!age && age !== 0) {
      return res.status(400).json({ message: 'Age is required' });
    }

    // Validate the format of the email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Validate the type of age
    if (typeof age !== 'number' || age < 0) {
      return res.status(400).json({ message: 'Age must be a non-negative number' });
    }

    // Additional validation (e.g., length of name)
    if (name.length < 3 || name.length > 50) {
      return res.status(400).json({ message: 'Name must be between 3 and 50 characters' });
    }

    // Create and save the user
    const user = new User({ name, email, age });
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a user by ID
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate the ID format if needed (e.g., check if it's a valid ObjectId)
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a user by name
exports.getUserByName = async (req, res) => {
  try {
    const { name } = req.params;

    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }

    const user = await User.findOne({ name: req.params.name });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a user by ID
exports.updateUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Validate the ID format
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    if (!Object.keys(updates).length) {
      return res.status(400).json({ message: 'No updates provided' });
    }

    const user = await User.findByIdAndUpdate(id, updates, { new: true });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Update a user by name
exports.updateUserByName = async (req, res) => {
  try {
    const { name } = req.params;
    const updates = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }

    if (!Object.keys(updates).length) {
      return res.status(400).json({ message: 'No updates provided' });
    }

    const user = await User.findOneAndUpdate({ name }, updates, { new: true });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a user by name
exports.deleteUserByName = async (req, res) => {
  try {
    const { name } = req.params;

    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }

    const user = await User.findOneAndDelete({ name });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a user by ID
exports.deleteUserById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate the ID format
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


