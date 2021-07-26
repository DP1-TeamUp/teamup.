const mongoose = require('mongoose');
const Sprint = require('../models/sprint.model');
const Project = require('../models/project.model');
const Task = require('../models/task.model');
const ObjectId = require('mongodb').ObjectID;

const create = async (req, res) => {
  if (
    !req.body.endTime ||
    !req.body.startTime ||
    !req.body.sprintNo ||
    !req.body.projectId
  ) {
    return res.status(400).json({
      success: false,
      message: 'Required information were missing for the request',
    });
  }

  let project;
  try {
    project = await Project.findById(req.body.projectId);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error while matching projectId',
    });
  }

  if (!project) {
    return res.status(400).json({
      success: false,
      message: 'Error while matching projectId',
    });
  }

  if (req.body.startTime >= req.body.endTime) {
    return res.status(400).json({
      success: false,
      message: 'Sprint start time cannot be greater or equal to end time',
    });
  }

  let currentTime = new Date();

  if (new Date(req.body.endTime) < currentTime) {
    return res.status(400).json({
      success: false,
      message: 'Your sprint end time cannot be smaller then current time',
    });
  }

  let collidingSprint;
  try {
    collidingSprint = await Sprint.findOne({
      projectId: ObjectId(req.body.projectId),
      startTime: { $gte: new Date(req.body.startTime) },
      endTime: { $lte: new Date(req.body.endTime) },
    });
    if (!collidingSprint) {
      collidingSprint = await Sprint.findOne({
        projectId: ObjectId(req.body.projectId),
        startTime: { $lte: new Date(req.body.startTime) },
        endTime: { $gte: new Date(req.body.endTime) },
      });
    }
    if (!collidingSprint) {
      collidingSprint = await Sprint.findOne({
        projectId: ObjectId(req.body.projectId),
        startTime: { $lte: new Date(req.body.endTime) },
        endTime: { $gte: new Date(req.body.endTime) },
      });
    }
    if (!collidingSprint) {
      collidingSprint = await Sprint.findOne({
        projectId: ObjectId(req.body.projectId),
        startTime: { $lte: new Date(req.body.startTime) },
        endTime: { $gte: new Date(req.body.startTime) },
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong please try again',
    });
  }

  if (collidingSprint) {
    return res.status(400).json({
      success: false,
      message: `Sprint time colliding with another Sprint${collidingSprint.sprintNo}`,
    });
  }

  let sprint = new Sprint(req.body);
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await sprint.save({ session: sess });
    project.sprints.push(sprint._id);
    await project.save({ session: sess });
    await sess.commitTransaction();
    return res.status(201).json({
      success: true,
      message: 'New Sprint created successfully',
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      message: 'Something went wrong creating the sprint please try again',
    });
  }
};

module.exports = { create };
