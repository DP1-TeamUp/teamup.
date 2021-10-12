const express = require('express');
const projectController = require('../controllers/project.controller');
const authControl = require('../controllers/auth.controller');

const router = express.Router();

router
  .route('/api/projects')
  .post(projectController.create)
  .put(projectController.changeDesignation);

router
  .route('/api/projects/user/:userId')
  .get(projectController.findProjectsByUserId);

router
  .route('/api/projects/:projectId')
  .get(projectController.selectProjectById);

router
  .route('/api/projects/members/:projectId')
  .put(
    authControl.requireSignin,
    authControl.isTeamLead,
    projectController.addMemberToProject
  )
  .get(projectController.listOfAllMembersByProjectId)
  .delete(
    authControl.requireSignin,
    authControl.isTeamLead,
    projectController.removeMemberFromProject
  );

router
  .route('/api/projects/sprints/:projectId')
  .get(projectController.listSprintsByProjectId);

module.exports = router;
