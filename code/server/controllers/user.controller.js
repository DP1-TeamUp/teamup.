const User = require('../models/user.model');
const transporter = require('../helper/nodemailer');
const crypto = require('crypto');

const create = async (req, res, next) => {
  const user = new User(req.body);
  if (
    !req.body.password ||
    !req.body.name ||
    !req.body.email ||
    !req.body.username
  ) {
    return res
      .status(400)
      .json({ success: false, message: 'Please fill in your form' });
  }
  if (req.body.password.length < 6) {
    return res.status(404).json({
      success: false,
      message: 'Password has to be of 6 charcters or more',
    });
  }
  try {
    await user.save();
    return res
      .status(201)
      .json({ success: true, message: 'Successfully signed up' });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res
        .status(400)
        .json({ success: false, message: 'Email already in use' });
    }
    return res
      .status(400)
      .json({ success: false, message: 'Unable to create an user' });
  }
};

const list = async (req, res) => {
  try {
    let users = await User.find().select('name email update created');
    res.status(200).json({ success: true, users });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: 'Unable to retrieve data',
    });
  }
};
const userByID = async (req, res, next, id) => {
  try {
    let user = await User.findById(id);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: 'User not found' });
    req.profile = user;
    next();
  } catch (err) {
    console.log(err);
    return res
      .status(400)
      .json({ success: false, message: 'Could not retrieve user' });
  }
};
const read = (req, res) => {
  req.profile.hashed_password = undefined;
  req.profile.salt = undefined;
  return res.json({ success: true, profile: req.profile });
};
const update = async (req, res, next) => {
  console.log(req.profile._id);
  try {
    let user = req.profile;
    console.log(req.file.path);
    //user = extend(user, req.body);
    user.image = req.file.path;
    user.updated = Date.now();
    await user.save();
    user.hashed_password = undefined;
    user.salt = undefined;
    res.json({ success: true, user: user });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: 'Unable to update user.',
    });
  }
};
const remove = async (req, res, next) => {
  try {
    let user = req.profile;
    let deletedUser = await user.remove();
    deletedUser.hashed_password = undefined;
    deletedUser.salt = undefined;
    res.json({
      success: true,
      deletedUser: deletedUser,
      message: 'User Deleted',
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: 'Unable to delete user',
    });
  }
};

// @ forget password
const forgetPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User doesn't exist" });
    }

    const resetToken = user.getPasswordResetToken();
    if (!resetToken) {
      return res.status(200).json({
        success: false,
        message: 'Error sending retrieving reset token',
      });
    }
    await user.save();

    const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;
    const message = `Verification code: ${resetToken}`;

    const mailOptions = {
      from: 'teamupp89@gmail.com',
      to: user.email,
      subject: 'Forgot password request',
      text: message,
    };
    // sending mail
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        return res
          .status(200)
          .json({ success: false, message: 'Error sending mail' });
      } else {
        console.log('Email sent: ' + info.response);
        return res.status(200).json({ success: true, message: 'Check mail' });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: 'Forget password failed' });
  }
};

const resetPassword = async (req, res) => {
  try {
    const resetPasswordToken = crypto
      .createHash('sha1')
      .update(req.params.resetToken)
      .digest('hex');
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid Reset Token' });
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({ success: true, data: 'Password reset success' });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: 'Failed to reset password' });
  }
};

module.exports = {
  create,
  userByID,
  list,
  read,
  remove,
  update,
  forgetPassword,
  resetPassword,
};
