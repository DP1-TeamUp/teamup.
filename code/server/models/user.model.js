const mongoose = require('mongoose');
const crypto = require('crypto');

const UserSchema = new mongoose.Schema({
  username: { type: String },
  name: {
    type: String,
    trim: true,
    required: 'Name is required',
  },
  email: {
    type: String,
    trim: true,
    unique: 'Email already exists',
    match: [/.+\@.+\..+/, 'Please fill a valid email address'],
    required: 'Email is required',
  },
  created: {
    type: Date,
    default: Date.now,
  },
  updated: Date,
  hashed_password: {
    type: String,
    required: 'Password is required',
  },
  salt: String,
  projects: [{ type: mongoose.Types.ObjectId, required: true, ref: 'Project' }],
  image: { type: String },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  tags: [],
  skills: [],
  lda: [],
  notifications: [],
});

UserSchema.virtual('password')
  .set(function (password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashed_password = this.encryptPassword(password);
  })
  .get(() => {
    return this._password;
  });

UserSchema.path('hashed_password').validate(function (v) {
  if (this._password && this._password.length < 6) {
    this.invalidate('password', 'Password must be of at least 6 characters');
  }
  if (this.isNew && !this._password) {
    this.invalidate('password', 'Password is required');
  }
}, null);

UserSchema.methods = {
  authenticate: function (plainText) {
    return this.encryptPassword(plainText) === this.hashed_password;
  },
  encryptPassword: function (password) {
    if (!password) return '';
    try {
      return crypto
        .createHmac('sha1', this.salt)
        .update(password)
        .digest('hex');
    } catch (err) {
      console.log(err);
      return '';
    }
  },
  makeSalt: function () {
    return Math.round(new Date().valueOf() * Math.random()) + '';
  },
  getPasswordResetToken: function () {
    const resetToken = crypto.randomBytes(4).toString('hex');

    // setting a field in user model
    this.resetPasswordToken = crypto
      .createHash('sha1')
      .update(resetToken)
      .digest('hex');
    this.resetPasswordExpire = Date.now() + 100 * (60 * 1000);

    return resetToken;
  },
};

module.exports = mongoose.model('User', UserSchema);
