const Board = require('../models/board.model');

const create = async (req, res) => {
  let board = new Board(req.body);
  if (!req.body.name || !req.body.color) {
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

module.exports = { create };
