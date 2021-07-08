const express = require('express');
const router = express.Router();
const taskController = require('../controllers/task.controller');

router.post('/api/tasks', taskController.create);
router.get('/api/tasks/:projectId', taskController.listAllTasksByProjectId);
router.get('/api/tasks/users/:userId', taskController.listMyTasks);

module.exports = router;
