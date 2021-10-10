const express = require('express');
const router = express.Router();
const taskController = require('../controllers/task.controller');
const authControl = require('../controllers/auth.controller');

router.post(
  '/api/tasks',
  authControl.requireSignin,
  authControl.isAMember,
  taskController.create
);
router.get(
  '/api/tasks/:projectId',
  authControl.requireSignin,
  authControl.isAMember,
  taskController.listAllTasksByProjectId
);
router.get('/api/tasks/users/:userId', taskController.listMyTasks);
router.put(
  '/api/tasks/:taskId',
  authControl.requireSignin,
  taskController.updateTaskFromEpic
);
router.delete(
  '/api/tasks/:taskId',
  authControl.requireSignin,
  taskController.deleteTask
);
router.put('/api/tasks/kanban/:taskId', taskController.updateTaskFromKanban);
router.post('/api/tasks/suggestions/assignment', taskController.taskSuggester);

module.exports = router;
