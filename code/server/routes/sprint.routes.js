const express = require('express');
const router = express.Router();
const sprintController = require('../controllers/sprint.controller');

router.route('/api/sprints').post(sprintController.create);

module.exports = router;
