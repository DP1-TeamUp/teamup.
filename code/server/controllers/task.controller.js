const Task = require('../models/task.model');
const User = require('../models/user.model');
const Sprint = require('../models/sprint.model');
const Project = require('../models/project.model');
const ObjectId = require('mongodb').ObjectID;
const transporter = require('../helper/nodemailer');
const mongoose = require('mongoose');

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

const updateTaskFromEpic = async (req, res) => {
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

  let task;
  try {
    task = await Task.findById(taskId);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong with the task Id please try again',
    });
  }

  if (sprint) {
    task.status = 'planned';
    task.sprintId = req.body.sprintId;
  }
  task.assignedTo = req.body.assignedTo;
  task.story = req.body.story;
  task.points = req.body.points;

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();

    await task.save({ session: sess });
    sprint.pending.push(taskId);
    sprint.velocity = sprint.velocity + task.points;
    await sprint.save({ session: sess });
    await sess.commitTransaction();

    return res.status(500).json({
      success: true,
      message: 'Updated',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong with the task Id please try again',
    });
  }
};

const updateTaskFromKanban = async (req, res) => {
  taskId = req.params.taskId;

  let task;
  try {
    task = await Task.findById(taskId);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong with the task Id please try again',
    });
  }

  if (!task) {
    return res.status(500).json({
      success: false,
      message: 'Task does not exist in the database',
    });
  }

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
    return res.status(500).json({
      success: false,
      message: 'Assigned Sprint doesnot existin the database',
    });
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();

    if (req.body.destName === 'Pending') {
      task.status = 'pending';
      sprint.pending.push(taskId);
    } else if (req.body.destName === 'Ongoing') {
      task.status = 'ongoing';
      sprint.ongoing.push(taskId);
    } else if (req.body.destName === 'Completed') {
      task.status = 'completed';
      sprint.completed.push(taskId);
    }

    if (req.body.sourceName === 'Pending') {
      sprint.pending.pull(taskId);
    } else if (req.body.sourceName === 'Ongoing') {
      sprint.ongoing.pull(taskId);
    } else if (req.body.sourceName === 'Completed') {
      sprint.completed.pull(taskId);
    }

    await task.save({ session: sess });
    await sprint.save({ session: sess });
    await sess.commitTransaction();

    return res.status(500).json({
      success: true,
      message: 'Updated',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong with the updating please try again',
    });
  }
};

module.exports = {
  create,
  listAllTasksByProjectId,
  listMyTasks,
  updateTaskFromEpic,
  updateTaskFromKanban,
};
