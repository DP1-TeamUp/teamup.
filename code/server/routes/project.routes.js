const express = require('express');
const projectController = require('../controllers/project.controller');

const router = express.Router();

router.route('/api/projects').post(projectController.create);

router
  .route('/api/projects/user/:userId')
  .get(projectController.findProjectsByUserId);

router
  .route('/api/projects/:projectId')
  .get(projectController.selectProjectById);

router
  .route('/api/projects/members/:projectId')
  .put(projectController.addMemberToProject)
  .get(projectController.listOfAllMembersByProjectId)
  .delete(projectController.removeMemberFromProject);

module.exports = router;
