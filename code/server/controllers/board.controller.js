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

module.exports = { create, findAllBoardsByProject };
