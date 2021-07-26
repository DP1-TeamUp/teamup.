const Task = require('../models/task.model');
const User = require('../models/user.model');
const Project = require('../models/project.model');
const ObjectId = require('mongodb').ObjectID;
const transporter = require('../helper/nodemailer');

const create = async (req, res) => {
  let task = new Task(req.body);
  if (!req.body.story || !req.body.assignedTo || !req.body.points) {
    return res.status(401).json({
      success: false,
      message: 'The required information is not given',
    });
  }
  if (
    !req.body.boardId ||
    !req.body.color ||
    !req.body.status ||
    !req.body.projectId
  ) {
    return res.status(501).json({
      success: false,
      message: 'Information not provided by the service provider',
    });
  }

  let user;
  try {
    user = await User.findById(req.body.assignedTo);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong please try again',
    });
  }
  if (!user) {
    return res.status(500).json({
      success: false,
      message: 'Assigned user does not exist',
    });
  }

  let project;
  try {
    project = await Project.findById(req.body.projectId);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong please try again',
    });
  }
  if (!project) {
    return res.status(500).json({
      success: false,
      message: 'Related Project does not exist',
    });
  }

  const mailOptions = {
    from: 'teamupp89@gmail.com',
    to: user.email,
    subject: 'New Task on ' + project.name,
    text: req.body.story,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });

  try {
    await task.save();
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong please try again',
    });
  }

  return res.status(201).json({
    success: true,
    message: 'Story Added successfully',
    task,
  });
};

const listAllTasksByProjectId = async (req, res) => {
  const projectId = req.params.projectId;
  let tasks;
  try {
    tasks = await Task.find({ projectId: ObjectId(projectId) }).populate(
      'assignedTo',
      'image'
    );
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong getting tasks',
    });
  }
  return res.status(201).json({
    success: true,
    message: 'Story retrieved',
    tasks,
  });
};

const listMyTasks = async (req, res) => {
  userId = req.params.userId;
  let tasks;
  try {
    tasks = await Task.find({ assignedTo: ObjectId(userId) });
  } catch (error) {
    console.log(error);
    return res.status(504).json({
      success: false,
      message: 'Something went wrong getting tasks',
    });
  }
  return res.status(201).json({
    success: true,
    message: 'Story retrieved',
    tasks,
  });
};

const updateTask = async (req, res) => {
  const taskId = req.params.taskId;

  let sprint;
  try {
    sprint = await Sprint.findById(req.body.sprintId);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong with the sprint Id please try again',
    });
  }

  if (!sprint) {
    return res.status(400).json({
      success: false,
      message: 'No such sprint exits in out database',
    });
  }

  try {
  } catch (error) {}
};

module.exports = { create, listAllTasksByProjectId, listMyTasks, updateTask };
