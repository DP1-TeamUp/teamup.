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

module.exports = router;
