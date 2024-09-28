// models/user.js
const mongoose = require('mongoose');

// Схема пользователя
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  uid: { type: String, required: true, unique: true }
});

module.exports = mongoose.model('User', userSchema);
