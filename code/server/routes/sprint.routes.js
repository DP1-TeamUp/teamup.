const express = require('express');
const router = express.Router();
const sprintController = require('../controllers/sprint.controller');
const authControl = require('../controllers/auth.controller');

router.route('/api/sprints').post(sprintController.create);
router
  .route('/api/sprints/:projectId')
  .get(
    authControl.requireSignin,
    authControl.isAMember,
    sprintController.getSprints
  );
router
  .route('/api/sprints/info/:sprintId')
  .get(sprintController.getTaskBySprintId);
router.route('/api/sprints/:sprintId/').delete(sprintController.deleteSprint);
router
  .route('/api/currentSprint/:projectId')
  .get(
    authControl.requireSignin,
    authControl.isAMember,
    sprintController.getCurrentSprint
  );

module.exports = router;
