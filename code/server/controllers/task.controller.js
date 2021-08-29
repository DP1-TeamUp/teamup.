const Task = require('../models/task.model');
const User = require('../models/user.model');
const Sprint = require('../models/sprint.model');
const Project = require('../models/project.model');
const ObjectId = require('mongodb').ObjectID;
const transporter = require('../helper/nodemailer');
const mongoose = require('mongoose');
const Board = require('../models/board.model');
const { setup } = require('../helper/createTag');

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
    return res.status(404).json({
      success: false,
      message: 'Related Project does not exist',
    });
  }

  let board;
  try {
    board = await Board.findById(req.body.boardId);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Something went wrong with the Epic',
    });
  }

  if (!board) {
    return res.status(404).json({
      success: false,
      message: 'Epic not found',
    });
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await task.save({ session: sess });
    board.task.push(task._id);
    await board.save({ session: sess });
    await sess.commitTransaction();
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong please try again',
    });
  }

  /*const mailOptions = {
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
  });*/

  let tasks;
  try {
    tasks = await Task.find({ assignedTo: req.body.assignedTo });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong please try again',
    });
  }

  if (tasks.length <= 5) {
    return res.status(201).json({
      success: true,
      message: 'Story Added successfully',
      task,
    });
  }

  let myTasks = [];
  tasks.forEach((task) => {
    myTasks.push(task.story);
  });

  let willSendThis = [myTasks];

  try {
    tasks = await Task.find({
      projectId: req.body.projectId,
      assignedTo: { $ne: req.body.assignedTo },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong please try again',
    });
  }

  /*tasks.forEach((task) => {
    let oneTask = [];
    oneTask.push(task.story);
    willSendThis.push(oneTask);
  });*/

  project.members.forEach((member) => {
    let oneTask = [];
    tasks.forEach((task) => {
      if (String(member) === String(task.assignedTo)) {
        oneTask.push(task.story);
      }
    });
    if (oneTask.length > 0) {
      willSendThis.push(oneTask);
    }
  });
  let final_tags = setup(willSendThis);

  try {
    user.tags = final_tags;
    await user.save();
  } catch (error) {
    return res.status(201).json({
      success: false,
      message: 'Something went wrong updating tags',
      task,
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
    tasks = await Task.find({ projectId: ObjectId(projectId) })
      .populate('assignedTo', 'image')
      .populate('sprintId', 'sprintNo');
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

  let alreadyAssignedSprint;
  try {
    alreadyAssignedSprint = await Sprint.findById(task.sprintId);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Unexpected Error with previously assigned sprint',
    });
  }

  let sprint;
  if (req.body.sprintId) {
    try {
      sprint = await Sprint.findById(req.body.sprintId);
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: 'Something went wrong with the sprint Id please try again',
      });
    }
  }

  if (sprint) {
    const currentTime = new Date();
    if (sprint.endTime < currentTime) {
      return res.status(500).json({
        success: false,
        message: 'Selected sprint is completed',
      });
    }
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    if (sprint) {
      if (alreadyAssignedSprint) {
        if (task.status === 'completed') {
          alreadyAssignedSprint.completed.pull(taskId);
        } else if (task.status === 'ongoing') {
          alreadyAssignedSprint.ongoing.pull(taskId);
        } else {
          alreadyAssignedSprint.pending.pull(taskId);
        }
        alreadyAssignedSprint.velocity =
          alreadyAssignedSprint.velocity - task.points;
        await alreadyAssignedSprint.save({ session: sess });
      }
      sprint.pending.push(taskId);
      task.sprintId = req.body.sprintId;
      task.status = 'planned';
      sprint.velocity = sprint.velocity + req.body.points;
      await sprint.save({ session: sess });
    }
    if (!sprint) {
      if (alreadyAssignedSprint) {
        alreadyAssignedSprint.velocity =
          alreadyAssignedSprint.velocity - task.points + req.body.points;
        await alreadyAssignedSprint.save({ session: sess });
      }
    }
    task.assignedTo = req.body.assignedTo;
    task.story = req.body.story;
    task.points = req.body.points;
    await task.save({ session: sess });
    await sess.commitTransaction();

    return res.status(404).json({
      success: true,
      message: 'Updated',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong updating',
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
    return res.status(404).json({
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

  const currentTime = new Date();
  if (sprint.endTime < currentTime) {
    return res.status(500).json({
      success: false,
      message: 'This Sprint is completed',
    });
  }

  if (sprint.startTime > currentTime) {
    return res.status(500).json({
      success: false,
      message: 'The Sprint has not started yet',
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

    return res.status(200).json({
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

const deleteTask = async (req, res) => {
  const taskId = req.params.taskId;

  let task;
  try {
    task = await Task.findById(taskId);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong with finding the task to delete',
    });
  }

  if (!task) {
    return res.status(404).json({
      success: false,
      message: 'Task not does not exist',
    });
  }

  if (task.status === 'completed') {
    return res.status(404).json({
      success: false,
      message: 'Something finished is not allowed to remove',
    });
  }

  let sprint;
  if (task.sprintId) {
    try {
      sprint = await Sprint.findById(task.sprintId);
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: 'Something went wrong with the related sprint ',
      });
    }
  }

  let board;
  try {
    board = await Board.findById(task.boardId);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong with the related epic ',
    });
  }

  if (!board) {
    return res.status(404).json({
      success: false,
      message: 'Related epic not found',
    });
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    if (sprint) {
      if (task.status === 'completed') {
        sprint.completed.pull(taskId);
      } else if (task.status === 'ongoing') {
        sprint.ongoing.pull(taskId);
      } else {
        sprint.pending.pull(taskId);
      }
      sprint.velocity = sprint.velocity - task.points;
      await sprint.save({ session: sess });
    }
    board.task.pull(taskId);
    await board.save({ session: sess });
    await task.remove({ session: sess });
    await sess.commitTransaction();
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong deleting the task',
    });
  }
  return res.status(200).json({
    success: true,
    message: 'Successfully Deleted the task',
  });
};

module.exports = {
  create,
  listAllTasksByProjectId,
  listMyTasks,
  updateTaskFromEpic,
  updateTaskFromKanban,
  deleteTask,
};
