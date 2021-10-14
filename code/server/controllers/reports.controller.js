const Project = require('../models/project.model');
const Board = require('../models/board.model');
const ObjectId = require('mongodb').ObjectID;
const Task = require('../models/task.model');

const getAllReports = async (req, res) => {
  const projectId = req.params.projectId;

  let project;
  try {
    project = await Project.findById(projectId)
      .populate('sprints')
      .populate('members', 'username');
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
    name = member.username;
    tasks.forEach((task) => {
      if (task.assignedTo) {
        if (String(member._id) == String(task.assignedTo._id)) {
          count++;
          name = task.assignedTo.username;
        }
      }
    });
    let newWorkLoad = { subject: name, A: count };
    workLoadData.push(newWorkLoad);
  });

  let sprintSummary = [];
  let totalVelocity = 0;
  let totalStories = 0;
  let sprintCount = 1;
  project.sprints.forEach((sprint) => {
    let summary;
    let sprintName = `Sprint ${sprint.sprintNo}`;
    let velocity = sprint.velocity;
    totalVelocity = totalVelocity + velocity;
    let stories =
      sprint.pending.length + sprint.ongoing.length + sprint.completed.length;
    totalStories = totalStories + stories;
    let meanVelocity = totalVelocity / sprintCount;
    let meanStories = totalStories / sprintCount;
    summary = {
      name: sprintName,
      velocity: velocity,
      stories: stories,
      meanVelocity: meanVelocity.toLocaleString().substring(0, 5),
      meanStory: meanStories.toLocaleString().substring(0, 4),
    };
    sprintSummary.push(summary);
    sprintCount = sprintCount + 1;
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
