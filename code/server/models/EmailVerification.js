const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//created->ready->running->completed

const EmailVerificationSchema = new mongoose.Schema({
  email: {
    type: String,
    trim: true,
    unique: 'Email already exists',
    match: [/.+\@.+\..+/, 'Please fill a valid email address'],
    required: 'Email is required',
  },
  username: { type: String },
  name: {
    type: String,
    trim: true,
    required: 'Name is required',
  },
  password: {
    type: String,
    trim: true,
    required: 'Password is required',
  },
  verificationCode: { type: String, required: true, unique: true },
});

module.exports = mongoose.model('EmailVerification', EmailVerificationSchema);
