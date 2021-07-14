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
      project: project,
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
    user = await User.findById(userId).populate('projects', 'name');
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

  if (!req.body.email) {
    res
      .status(401)
      .json({ success: false, message: 'Email need to be provided' });
  }

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

  try {
    user = await User.findOne({ email: req.body.email });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong please try again',
    });
  }

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'No user found with the provided e-mail',
    });
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    project.members.push(user._id);
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
    return res.status(501).json({
      success: false,
      message: 'Something went wrong please try again',
    });
  }
};

const listOfAllMembersByProjectId = async (req, res) => {
  const projectId = req.params.projectId;
  let project;

  try {
    project = await Project.findById(projectId)
      .populate('members')
      .populate('admin');
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: 'Something went wrong finding the members for this project',
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

  project.admin.hashed_password = undefined;
  project.admin.salt = undefined;

  res
    .status(200)
    .json({
      success: true,
      members: project.members,
      admin: project.admin,
      description: project.description,
    });
};

const removeMemberFromProject = async (req, res) => {
  const projectId = req.params.projectId;

  let project;
  try {
    project = await Project.findById(projectId);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: 'Project not found' });
  }

  if (!project) {
    return res
      .status(404)
      .json({ success: false, message: 'Project not found' });
  }

  if (project.admin === req.body.memberId) {
    return res
      .status(404)
      .json({ success: false, message: 'Admin cannot be removed' });
  }

  let user;
  try {
    user = await User.findById(req.body.memberId);
  } catch (error) {
    return res
      .status(504)
      .json({ success: false, message: 'Error Retriving User' });
  }

  if (!user) {
    return res
      .status(404)
      .json({ success: false, message: 'User do not exist' });
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    project.members.pull(req.body.memberId);
    await project.save({ session: sess });
    user.projects.pull(project);
    await user.save({ session: sess });
    await sess.commitTransaction();
    res.status(201).json({
      success: true,
      message: 'Member Deleted',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong please try again',
    });
  }
};

module.exports = {
  create,
  findProjectsByUserId,
  selectProjectById,
  addMemberToProject,
  listOfAllMembersByProjectId,
  removeMemberFromProject,
};
