const express = require('express');
const boardController = require('../controllers/board.controller');

const router = express.Router();

router.route('/api/boards').post(boardController.create);

router
  .route('/api/boards/:projectId')
  .get(boardController.findAllBoardsByProject);

module.exports = router;
