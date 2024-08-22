const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // Ensure that each email is unique
    trim: true,
  },
  age: {
    type: Number,
    required: true,
  },
});

const User = mongoose.model('User', UserSchema);
module.exports = User;
