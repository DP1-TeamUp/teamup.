const User = require('../models/user.model');
const Project = require('../models/project.model');
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
        skills: user.skills,
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

const isAMember = async (req, res, next) => {
  let project;
  let projectId = req.params.projectId || req.body.projectId;
  try {
    project = await Project.findById(projectId);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong please try again',
    });
  }
  let member;

  project.members.forEach((employee) => {
    if (employee == req.auth._id) {
      member = req.auth._id;
    }
  });

  if (member) {
    next();
  } else {
    return res.status(500).json({
      success: false,
      message: 'Your are not authorized in this project',
    });
  }
};

const isTeamLead = async (req, res, next) => {
  let project;
  let projectId = req.params.projectId || req.body.projectId;
  try {
    project = await Project.findById(projectId);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong please try again',
    });
  }

  if (project.admin == req.auth._id) {
    next();
  } else if (req.body.memberId == req.auth._id) {
    next();
  } else {
    return res.status(500).json({
      success: false,
      message: 'Your are not authorized for this action',
    });
  }
};

module.exports = {
  signin,
  signout,
  requireSignin,
  hasAuthorization,
  isAMember,
  isTeamLead,
};
