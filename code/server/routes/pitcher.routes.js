const express = require('express');
const pitcherController = require('../controllers/pitcher.controllers');
const fileUpload = require('../middlewares/file-upload');

const router = express.Router();

router
  .route('/api/pitchers')
  .put(pitcherController.updatePitchers)
  .delete(pitcherController.deletePitcher);
router.route('/api/pitchers/text').post(pitcherController.createTextPitcher);
router
  .route('/api/pitchers/image')
  .post(fileUpload.single('image'), pitcherController.createImagePitchers);
router
  .route('/api/pitchers/:projectId')
  .get(pitcherController.getPitchers)
  .delete(pitcherController.deleteAllPitchers);

module.exports = router;
