const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true, // Ensure that each name is unique for simplicity.
  },
});

const User = mongoose.model('User', UserSchema);
module.exports = User;
