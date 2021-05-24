const mongoose = require('mongoose');
const Project = require('../models/project.model');
const User = require('../models/user.model');

const create = async (req, res) => {
  let project = new Project(req.body);
  if (!req.body.name || !req.body.description) {
    return res.status(401).json({
      success: false,
      message: 'Project Name and Description Required.',
    });
  }
  let user;
  try {
    user = await User.findById(req.body.admin);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong please try again',
    });
  }

  if (!user) {
    return res
      .status(404)
      .json({ success: false, message: 'Cannot find match to the userId' });
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    project.members.push(req.body.admin);
    await project.save({ session: sess });
    user.projects.push(project);
    await user.save({ session: sess });
    await sess.commitTransaction();
    res.status(201).json({
      success: true,
      message: 'New Project Created',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong please try again',
    });
  }
};

const findProjectsByUserId = async (req, res) => {
  const userId = req.params.userId;
  let projects;
  let user;
  try {
    user = await User.findById(userId);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong could not find Projects',
    });
  }
  if (!user || !user.projects) {
    return res.status(404).json({
      success: false,
      message: 'No projects for this user',
    });
  }
  projects = user.projects;
  res.status(200).json({ success: true, projects });
};

const selectProjectById = async (req, res) => {
  const projectId = req.params.projectId;
  let project;
  try {
    project = await Project.findById(projectId);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: 'Could not retrieve data of this project',
    });
  }
  if (!project) {
    return res.status(404).json({
      success: false,
      message: 'No project found',
    });
  }
  res.status(200).json({ success: true, project });
};

const addMemberToProject = async (req, res) => {
  const projectId = req.params.projectId;

  let project;
  try {
    project = await Project.findById(projectId);
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Could not find project' });
  }
  if (!project) {
    return res
      .status(404)
      .json({ success: false, message: 'No project found' });
  }

  let user;
  try {
    user = await User.findById(req.body.memberId);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong please try again',
    });
  }

  if (!user) {
    return res
      .status(404)
      .json({ success: false, message: 'Cannot find match to the userId' });
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    project.members.push(req.body.memberId);
    await project.save({ session: sess });
    user.projects.push(project);
    await user.save({ session: sess });
    await sess.commitTransaction();
    res.status(201).json({
      success: true,
      message: 'New Member Added',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong please try again',
    });
  }
};

const listOfAllMembersByProjectId = async (req, res) => {
  const projectId = req.params.projectId;
  let project;

  try {
    project = await Project.findById(projectId).populate('members');
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: 'Something went wrong finding the project',
    });
  }

  if (!project) {
    return res
      .status(404)
      .json({ success: false, message: 'Project does not exist' });
  }

  project.members.forEach((x, i) => {
    x.hashed_password = undefined;
    x.salt = undefined;
  });

  res.status(200).json({ success: true, members: project.members });
};

module.exports = {
  create,
  findProjectsByUserId,
  selectProjectById,
  addMemberToProject,
  listOfAllMembersByProjectId,
};
