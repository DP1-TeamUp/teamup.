const Board = require('../models/board.model');
const ObjectId = require('mongodb').ObjectID;
const mongoose = require('mongoose');
const Task = require('../models/task.model');

const create = async (req, res) => {
  let board = new Board(req.body);
  if (!req.body.name || !req.body.color || !req.body.project) {
    return res.status(401).json({
      success: false,
      message: 'The required information is not given',
    });
  }
  try {
    await board.save();
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong please try again',
    });
  }
  res
    .status(201)
    .json({ success: true, message: 'Successfully created board', board });
};

const findAllBoardsByProject = async (req, res) => {
  const projectId = req.params.projectId;
  let boards;
  try {
    boards = await Board.find({ project: ObjectId(projectId) });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong getting task boards',
    });
  }
  if (!boards) {
    return res.status(404).json({
      success: false,
      message: 'There is no boards for this project',
    });
  }
  return res.status(200).json({
    success: true,
    message: 'Successfully retrieved the boards',
    boards,
  });
};

const deleteBoard = async (req, res) => {
  boardId = req.params.boardId;

  let board;
  try {
    board = await Board.findById(boardId).populate({
      path: 'task',
      populate: { path: 'sprintId' },
    });
  } catch (error) {
    console.log(error);
    return res.status(504).json({
      success: false,
      message: 'Something went wrong while finding the Epic to delete',
    });
  }

  if (!board) {
    return res.status(404).json({
      success: false,
      message: 'The Epic is not found in the database',
    });
  }

  let completedTaskFound = 0;
  board.task.forEach((task) => {
    if (task.status === 'completed') {
      completedTaskFound = 1;
    }
    completedTaskFound = completedTaskFound;
  });

  if (completedTaskFound === 1) {
    return res.status(504).json({
      success: false,
      message: 'Unable to delete Epic with one or more completed tasks in it.',
    });
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    board.task.forEach(async (task) => {
      if (task.status === 'planned') {
        task.sprintId.pending.pull(task._id);
        task.sprintId.velocity = task.sprintId.velocity - task.points;
        await task.sprintId.save({ session: sess });
      }
      if (task.status === 'ongoing') {
        task.sprintId.ongoing.pull(task._id);
        task.sprintId.velocity = task.sprintId.velocity - task.points;
        await task.sprintId.save({ session: sess });
      }
      if (task.status === 'pending') {
        task.sprintId.pending.pull(task._id);
        task.sprintId.velocity = task.sprintId.velocity - task.points;
        await task.sprintId.save({ session: sess });
      }
      await Task.findByIdAndDelete(task._id);
    });
    await board.remove({ session: sess });
    await sess.commitTransaction();
  } catch (error) {
    console.log(error);
    return res.status(504).json({
      success: false,
      message: 'Something went wrong while removing the Epic',
    });
  }
  return res.status(200).json({
    success: true,
    message: 'Successfully deleted the Epic',
  });
};

module.exports = { create, findAllBoardsByProject, deleteBoard };
