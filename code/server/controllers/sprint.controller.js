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
  sprint.velocity = 0;
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

const getSprints = async (req, res) => {
  if (!req.params.projectId) {
    return res.status(400).json({
      success: false,
      message: 'Project ID is required',
    });
  }

  let project;
  try {
    project = await Project.findById(req.params.projectId);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error while matching projectId',
    });
  }

  if (!project) {
    return res.status(400).json({
      success: false,
      message: 'Project does not exist',
    });
  }

  let sprints;
  try {
    sprints = await Sprint.find({ projectId: ObjectId(req.params.projectId) });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Error retrieving sprints',
    });
  }
  return res.status(200).json({
    success: true,
    message: 'Successfully retrieved sprints',
    sprints,
  });
};

const getTaskBySprintId = async (req, res) => {
  const sprintId = req.params.sprintId;

  let sprint;
  try {
    sprint = await Sprint.findById(sprintId)
      .populate({ path: 'pending', populate: { path: 'assignedTo' } })
      .populate({ path: 'ongoing', populate: { path: 'assignedTo' } })
      .populate({ path: 'completed', populate: { path: 'assignedTo' } });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Error retrieving sprints',
    });
  }

  return res.status(500).json({
    success: true,
    message: 'Retrievied sprint Info',
    sprint,
  });
};

const getCurrentSprint = async (req, res) => {
  let currentSprint;
  try {
    currentSprint = await Sprint.findOne({
      projectId: ObjectId(req.params.projectId),
      startTime: { $lte: new Date() },
      endTime: { $gte: new Date() },
    })
      .populate({ path: 'pending', populate: { path: 'assignedTo' } })
      .populate({ path: 'ongoing', populate: { path: 'assignedTo' } })
      .populate({ path: 'completed', populate: { path: 'assignedTo' } });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Current sprint not loaded',
    });
  }
  if (!currentSprint) {
    return res.status(404).json({
      success: false,
      message: 'No current sprint found',
    });
  }
  return res.status(200).json({
    success: true,
    message: 'Retrievied sprint Info',
    currentSprint,
  });
};

const deleteSprint = async (req, res) => {
  let sprintId = req.params.sprintId;
  let sprint;
  try {
    sprint = await Sprint.findById(sprintId).populate('projectId');
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong while finding the sprint to delete',
    });
  }
  if (!sprint) {
    return res.status(404).json({
      success: false,
      message: 'The sprint is not found in our database',
    });
  }

  let projectId = sprint.projectId._id;

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    if (sprint.pending) {
      sprint.pending.forEach(async (pendingId) => {
        let pending = await Task.findById(pendingId);
        pending.status = 'Pending';
        await pending.save({ session: sess });
      });
    }
    if (sprint.ongoing) {
      sprint.ongoing.forEach(async (ongoingId) => {
        let ongoing = await Task.findById(ongoingId);
        ongoing.status = 'Pending';
        await ongoing.save({ session: sess });
      });
    }
    sprint.projectId.sprints.pull(sprintId);
    await sprint.projectId.save({ session: sess });
    await sprint.remove({ session: sess });
    await sess.commitTransaction();
    return res.status(201).json({
      success: true,
      message: 'New Sprint deleted successfully',
      projectId,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong deleting Sprint',
    });
  }
};

module.exports = {
  create,
  getSprints,
  getTaskBySprintId,
  getCurrentSprint,
  deleteSprint,
};
