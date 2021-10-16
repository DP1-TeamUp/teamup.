const mongoose = require('mongoose');
const Project = require('../models/project.model');
const User = require('../models/user.model');
const Task = require('../models/task.model');
const Sprint = require('../models/sprint.model');
const { contentSecurityPolicy } = require('helmet');

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

  let existingMember;
  try {
    existingMember = await Project.findOne({
      members: { $in: user._id },
    });
  } catch (error) {
    console.log(error);
    return res.status(501).json({
      success: false,
      message:
        'Something went wrong in finding existing member please try again',
    });
  }

  if (existingMember) {
    return res.status(501).json({
      success: false,
      message: 'Member is present in the project',
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

  let tasks;
  try {
    tasks = await Task.find({ projectId: projectId });
  } catch (error) {
    console.log(error);
    return res.status(504).json({
      success: false,
      message: 'Something went wrong finding information related to members',
    });
  }

  project.members.forEach((x, i) => {
    x.hashed_password = undefined;
    x.salt = undefined;
  });

  project.admin.hashed_password = undefined;
  project.admin.salt = undefined;

  res.status(200).json({
    success: true,
    members: project.members,
    admin: project.admin,
    description: project.description,
    tasks: tasks,
    srDev: project.srDev,
    jrDev: project.jrDev,
    intern: project.intern,
  });
};

const removeMemberFromProject = async (req, res) => {
  const projectId = req.params.projectId;

  let project;
  try {
    project = await Project.findById(projectId).populate('admin');
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

  if (project.admin._id === req.body.memberId) {
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

  let tasks;
  try {
    tasks = await Task.find({
      projectId: projectId,
      assignedTo: req.body.memberId,
      status: { $ne: 'completed' },
    }).populate('sprintId');
  } catch (error) {
    console.log(error);
    return res
      .status(504)
      .json({ success: false, message: 'Failed to remove the member' });
  }

  let notification = {
    project: project.name,
    content: 'You were removed from this project',
  };

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    project.members.pull(req.body.memberId);
    await project.save({ session: sess });
    tasks.forEach(async (task) => {
      task.assignedTo = undefined;
      await task.save({ session: sess });
      if (task.sprintId) {
        let sprint = await Sprint.findById(task.sprintId._id);
        if (sprint) {
          project.admin.notifications.push({
            project: project.name,
            subject:
              'Your action created an unassigned story on sprint ' +
              sprint.sprintNo,
            content: task.story,
          });

          project.admin.save();
        }
      }
    });
    user.notifications.push(notification);
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

const listSprintsByProjectId = async (req, res) => {
  const projectId = req.params.projectId;
  let project;
  try {
    project = await Project.findById(projectId).populate('sprints');
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong please try again',
    });
  }
  if (!project) {
    return res.status(400).json({
      success: false,
      message: 'Something is wrong with your project',
    });
  }
  return res.status(500).json({
    success: true,
    sprints: project.sprints,
  });
};

const changeDesignation = async (req, res) => {
  if (!req.body.newDesignation || req.body.memberId || req.body.projectId) {
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

  const projectId = req.body.projectId;
  let project;
  try {
    project = await Project.findById(projectId);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong please try again',
    });
  }
  if (!project) {
    return res.status(400).json({
      success: false,
      message: 'Something is wrong with your project',
    });
  }

  //search current designations
  let currentDesignation;
  project.jrDev.forEach((dev) => {
    if (dev == req.body.memberId) {
      currentDesignation = 'jr';
    }
  });
  project.srDev.forEach((dev) => {
    if (dev == req.body.memberId) {
      currentDesignation = 'sr';
    }
  });
  project.intern.forEach((dev) => {
    if (dev == req.body.memberId) {
      currentDesignation = 'intern';
    }
  });

  if (project.admin === req.body.memberId) {
    return res
      .status(504)
      .json({ success: false, message: 'Tech lead role cannot be changed' });
  }

  let newDesignation = req.body.newDesignation;
  let notification;
  try {
    //pull out fro previous designation
    if (currentDesignation === 'intern') {
      project.intern.pull(req.body.memberId);
    }
    if (currentDesignation === 'sr') {
      project.srDev.pull(req.body.memberId);
    }
    if (currentDesignation === 'jr') {
      project.jrDev.pull(req.body.memberId);
    }

    //push into new designation
    if (newDesignation === 'intern') {
      project.intern.push(req.body.memberId);
      notification = {
        project: project.name,
        subject: 'Your role has been changed to intern for this project.',
      };
    }
    if (newDesignation === 'sr') {
      project.srDev.push(req.body.memberId);
      notification = {
        project: project.name,
        subject:
          'Your role has been changed to Software Developer for this project.',
      };
    }
    if (newDesignation === 'jr') {
      project.jrDev.push(req.body.memberId);
      notification = {
        project: project.name,
        subject:
          'Your role has been changed to Junior Developer for this project.',
      };
    }
    user.notifications.push(notification);

    const sess = await mongoose.startSession();
    sess.startTransaction();
    await project.save({ session: sess });
    await user.save({ session: sess });
    await sess.commitTransaction();
    return res.status(200).json({
      success: true,
      message: 'Designation changed successfully',
    });
  } catch (error) {
    console.log(error);
    return res.status(504).json({
      success: false,
      message: 'Something went wrong changing the designation',
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
  listSprintsByProjectId,
  changeDesignation,
};
