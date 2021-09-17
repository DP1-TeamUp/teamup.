const express = require('express');
const router = express.Router();

const reportsController = require('../controllers/reports.controller');

router.get('/api/reports/:projectId', reportsController.getAllReports);

module.exports = router;
