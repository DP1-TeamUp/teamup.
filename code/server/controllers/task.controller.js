const Task = require('../models/task.model');
const User = require('../models/user.model');
const Sprint = require('../models/sprint.model');
const Project = require('../models/project.model');
const ObjectId = require('mongodb').ObjectID;
const transporter = require('../helper/nodemailer');
const mongoose = require('mongoose');
const Board = require('../models/board.model');
const { setup } = require('../helper/createTag');
const { ldaTagCreation, ldaTagSummarizer } = require('../helper/ldaTag');
const { matchWithoutSuffix, checkStopWords } = require('../helper/StringMatch');

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

  let notification = {
    project: project.name,
    subject: 'New Task Assigned on Epic ' + board.name,
    content: req.body.story,
  };

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await task.save({ session: sess });
    board.task.push(task._id);
    await board.save({ session: sess });
    user.notifications.push(notification);
    await user.save({ session: sess });
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

  //let ldaTags = ldaTagCreation(willSendThis);
  let final_tags = setup(willSendThis);

  try {
    // user.lda = ldaTags;
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

  let total = tasks.length;
  let completed = 0;
  tasks.forEach((task) => {
    if (task.status === 'completed') {
      completed = completed + 1;
    }
  });
  let pending;
  pending = total - completed;
  let percentage = (completed / total) * 100;
  return res.status(201).json({
    success: true,
    message: 'Story retrieved',
    tasks,
    pending: pending,
    completed: completed,
    percentage,
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

  let user1;
  try {
    user1 = await User.findById(task.assignedTo);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong please try again',
    });
  }

  let user2;
  try {
    user2 = await User.findById(req.body.assignedTo);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong please try again',
    });
  }

  let project;
  try {
    project = await Project.findById(task.projectId);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong please try again',
    });
  }

  //=========Auth here===========

  let authMember;

  project.members.forEach((employee) => {
    if (employee == req.auth._id) {
      authMember = req.auth._id;
    }
  });

  if (authMember) {
    console.log('auth successfull');
  } else {
    return res.status(500).json({
      success: false,
      message: 'Your are not authorized in this project',
    });
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

  let notification = {
    project: project.name,
    subject: 'Your Task from Epic "' + board.name + '" is updated.',
    content: task.story,
  };

  let notification1 = {
    project: project.name,
    subject:
      'Your Task from Epic "' +
      board.name +
      '" is reassigned to your colleague.',
    content: task.story,
  };

  let notification2 = {
    project: project.name,
    subject: 'A Task from Epic "' + board.name + '" is assigned to you.',
    content: task.story,
  };

  if (req.body.assignedTo == task.assignedTo) {
    user1.notifications.push(notification);
    await user1.save();
  } else {
    if (user1) {
      user1.notifications.push(notification1);
      await user1.save();
    }
    if (user2) {
      user2.notifications.push(notification2);
      await user2.save();
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
    /*if (user1._id) {
      await user1.save();
    }*/
    /*if (user1._id !== user2._id) {
      if (user2._id) {
        await user2.save();
      }
    }*/
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

  let user;
  try {
    user = await User.findById(task.assignedTo);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong please try again',
    });
  }

  let project;
  try {
    project = await Project.findById(task.projectId);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong please try again',
    });
  }

  //=====Auth here=====

  let authMember;

  project.members.forEach((employee) => {
    if (employee == req.auth._id) {
      authMember = req.auth._id;
    }
  });

  if (authMember) {
  } else {
    return res.status(500).json({
      success: false,
      message: 'Your are not authorized in this project',
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

  let notification = {
    project: project.name,
    subject: 'Your task has been removed from ' + board.name,
    content: task.story,
  };

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
    if (user) {
      user.notifications.push(notification);
      await user.save();
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

const taskSuggester = async (req, res) => {
  const { task, projectId } = req.body;

  let project;
  try {
    project = await Project.findById(projectId).populate('members');
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong getting suggestions',
    });
  }
  let allUsers = project.members;
  let finalNicknames = [];

  const arrayOfTheTask = (task) => {
    return task.trim().split(' ');
  };

  let unfilteredTask = arrayOfTheTask(task);
  /*console.log(taskInArray);
  console.log(' ');

  taskInArray.forEach((task) => {
    console.log(task);
  });*/
  /*allUsers.forEach((user) => {
    ldaTagSummarizer(user.lda, taskInArray, user.username);
  });*/

  //console.log('Task to be assigned: ' + task);

  let taskInArray = checkStopWords(unfilteredTask);

  allUsers.forEach((user) => {
    let score = 0;
    let nickname = user.name;
    let id = user._id;
    let email = user.email;
    let image = user.image;
    //console.log(' ');
    user.tags.forEach((tag) => {
      taskInArray.forEach((word) => {
        if (word === tag.word) {
          score = score + tag.score;
          /*console.log(
            nickname +
              ' has knows the word "' +
              tag.word +
              '" with score ' +
              tag.score
          );*/
        } else if (matchWithoutSuffix(tag.word, word)) {
          score = score + tag.score * 0.6;
          /*console.log(
            nickname +
              ' has knows the word "' +
              tag.word +
              '" with score ' +
              tag.score +
              ' after suffix work done to "' +
              word +
              '" scored changed to: ' +
              tag.score * 0.6
          );*/
        }
      });
    });
    if (score > 0) {
      finalNicknames.push({
        name: nickname,
        score: score.toString().substring(0, 5),
        _id: id,
        email: email,
        image: image,
      });
    }
  });

  finalNicknames.sort((a, b) => b.score - a.score);
  //console.log('Suggestions ', finalNicknames);

  return res.status(200).json({
    success: true,
    finalNicknames: finalNicknames,
  });
};

module.exports = {
  create,
  listAllTasksByProjectId,
  listMyTasks,
  updateTaskFromEpic,
  updateTaskFromKanban,
  deleteTask,
  taskSuggester,
};
