const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const config = require('../../config/config');

const signin = async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.email }).populate({
      path: 'projects',
    });
    if (!user)
      return res
        .status(401)
        .json({ success: false, message: 'User not found' });
    if (!user.authenticate(req.body.password)) {
      return res.status(401).send({
        success: false,
        message: 'Incorrect Password. Please try again.',
      });
    }

    const token = jwt.sign({ _id: user._id }, config.jwtSecret);
    res.cookie('t', token, { expire: new Date() + 9999 });
    return res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        image: user.image,
        username: user.username,
        projects: user.projects,
        tags: user.tags,
      },
    });
  } catch (err) {
    return res
      .status('401')
      .json({ success: false, message: 'Could not sign in' });
  }
};

const signout = (req, res) => {
  res.clearCookie('t');
  return res.status('200').json({
    success: true,
    message: 'signed out',
  });
};

const requireSignin = expressJwt({
  secret: config.jwtSecret,
  userProperty: 'auth',
  algorithms: ['HS256'],
});

const hasAuthorization = (req, res, next) => {
  const authorized = req.profile && req.auth && req.profile._id == req.auth._id;
  if (!authorized) {
    return res.status('403').json({
      success: false,
      message: 'User is not authorized',
    });
  }
  next();
};

module.exports = { signin, signout, requireSignin, hasAuthorization };
