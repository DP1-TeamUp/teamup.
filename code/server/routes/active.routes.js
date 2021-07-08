const express = require('express');
const router = express.Router();
const activeController = require('../controllers/active.controllers');

router.post('/api/actives', activeController.getOnline);
router.get('/api/actives/:projectId', activeController.getActives);
router.delete('/api/actives', activeController.getOffline);

module.exports = router;
