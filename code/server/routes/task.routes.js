const express = require('express');
const router = express.Router();
const taskController = require('../controllers/task.controller');

router.post('/api/tasks', taskController.create);
router.get('/api/tasks/:projectId', taskController.listAllTasksByProjectId);

module.exports = router;
