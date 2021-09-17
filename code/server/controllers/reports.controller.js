const Project = require('../models/project.model');
const Board = require('../models/board.model');
const ObjectId = require('mongodb').ObjectID;
const Task = require('../models/task.model');

const getAllReports = async (req, res) => {
  const projectId = req.params.projectId;

  let project;
  try {
    project = await Project.findById(projectId).populate('sprints');
  } catch (error) {
    console.log(error);
    return res
      .status(504)
      .json({ success: false, message: 'Something went wrong' });
  }

  let boards;
  try {
    boards = await Board.find({ project: ObjectId(projectId) });
  } catch (error) {
    console.log(error);
    return res
      .status(504)
      .json({ success: false, message: 'Something went wrong' });
  }

  let tasks;
  try {
    tasks = await Task.find({ projectId: ObjectId(projectId) }).populate(
      'assignedTo',
      'username'
    );
  } catch (error) {
    console.log(error);
    return res
      .status(504)
      .json({ success: false, message: 'Something went wrong' });
  }

  let ongoing = 0;
  let completed = 0;

  project.sprints.forEach((sprint) => {
    ongoing = ongoing + sprint.ongoing.length;
    completed = completed + sprint.completed.length;
  });

  let pending = tasks.length - ongoing - completed;

  let name;
  let workLoadData = [];
  let count;
  project.members.forEach((member) => {
    count = 0;
    tasks.forEach((task) => {
      if (String(member) == String(task.assignedTo._id)) {
        count++;
        name = task.assignedTo.username;
      }
    });
    let newWorkLoad = { subject: name, A: count };
    workLoadData.push(newWorkLoad);
  });

  let sprintSummary = [];
  let totalVelocity = 0;
  let totalStories = 0;
  project.sprints.forEach((sprint) => {
    let summary;
    let sprintName = `Sprint ${sprint.sprintNo}`;
    let velocity = sprint.velocity;
    totalVelocity = totalVelocity + velocity;
    let stories =
      sprint.pending.length + sprint.ongoing.length + sprint.completed.length;
    totalStories = totalStories + stories;
    let meanVelocity = totalVelocity / sprint.sprintNo;
    let meanStories = totalStories / sprint.sprintNo;
    summary = {
      name: sprintName,
      velocity: velocity,
      stories: stories,
      meanVelocity: meanVelocity,
      meanStory: meanStories,
    };
    sprintSummary.push(summary);
  });

  return res.status(504).json({
    success: true,
    message: 'Reports generated successfully',
    totalSprints: project.sprints.length,
    totalEpics: boards.length,
    totalStories: tasks.length,
    ongoing: ongoing,
    completed: completed,
    pending: pending,
    workLoadData,
    sprintSummary,
  });
};

module.exports = { getAllReports };