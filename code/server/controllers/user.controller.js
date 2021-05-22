const User = require('../models/user.model');
const extend = require('lodash/extend');

const create = async (req, res, next) => {
  const user = new User(req.body);
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
  try {
    let user = req.profile;
    user = extend(user, req.body);
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

module.exports = { create, userByID, list, read, remove, update };
