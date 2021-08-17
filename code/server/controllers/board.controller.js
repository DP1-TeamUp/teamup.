const Board = require('../models/board.model');
const ObjectId = require('mongodb').ObjectID;

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
    board = await Board.findById(boardId);
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

  if (board.task.length > 0) {
    console.log(board.task);
    return res.status(504).json({
      success: false,
      message: 'not deleting with task for now',
    });
  }

  try {
    await board.remove();
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
