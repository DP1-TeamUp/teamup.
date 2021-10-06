const mongoose = require('mongoose');
const Pitcher = require('../models/pitcher.model');
const ObjectId = require('mongodb').ObjectID;

const createTextPitcher = async (req, res) => {
  const pitcher = new Pitcher(req.body);
  try {
    await pitcher.save();
    return res.status(201).json({
      success: true,
      message: 'Successfully created pitcher',
    });
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ success: false, message: 'Failed to create the pitcher' });
  }
};

const getPitchers = async (req, res) => {
  let pitchers;
  try {
    pitchers = await Pitcher.find({
      projectId: ObjectId(req.params.projectId),
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Error retrieving pitchers',
    });
  }
  return res.status(200).json({
    success: true,
    message: 'Successfully retrieved pitchers',
    pitchers,
  });
};

const updatePitchers = async (req, res) => {
  let pitcher;
  try {
    pitcher = await Pitcher.findOne({ _id: req.body._id });
  } catch (err) {
    console.log(err);
    return res
      .status(400)
      .json({ success: false, message: 'Something went wrong' });
  }
  pitcher.x = req.body.xaxis;
  pitcher.y = req.body.yaxis;
  try {
    await pitcher.save();
    return res.status(201).json({ success: true, message: 'pitcher updated' });
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ success: false, message: 'Something went wrong' });
  }
};

const createImagePitchers = async (req, res) => {
  const pitcher = new Pitcher({
    x: 300,
    y: 300,
    pitcherContent: req.file.path,
    projectId: req.body.projectId,
    pitcherType: 'image',
  });
  try {
    await pitcher.save();
    return res.status(201).json({ success: true, message: 'pitcher created' });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: 'Something went wrong' });
  }
};

const deletePitcher = async (req, res) => {
  let pitcher;
  try {
    pitcher = await Pitcher.findById(req.body._id);
    await pitcher.remove();
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: 'Something went wrong' });
  }
  return res
    .status(500)
    .json({ success: true, message: 'Successfully deleted' });
};

const deleteAllPitchers = async (req, res) => {
  let pitchers;
  try {
    await Pitcher.deleteMany({
      projectId: ObjectId(req.params.projectId),
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: 'Something went wrong' });
  }
  return res
    .status(500)
    .json({ success: true, message: 'Successfully deleted' });
};

module.exports = {
  createTextPitcher,
  getPitchers,
  updatePitchers,
  createImagePitchers,
  deletePitcher,
  deleteAllPitchers,
};
