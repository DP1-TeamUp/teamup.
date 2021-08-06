const express = require('express');
const router = express.Router();
const sprintController = require('../controllers/sprint.controller');

router.route('/api/sprints').post(sprintController.create);
router.route('/api/sprints/:projectId').get(sprintController.getSprints);
router
  .route('/api/sprints/info/:sprintId')
  .get(sprintController.getTaskBySprintId);

module.exports = router;
