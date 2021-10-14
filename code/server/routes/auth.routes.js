const express = require('express');
const authControl = require('../controllers/auth.controller');

const router = express.Router();

router.route('/auth/signin').post(authControl.signin);
router.route('/auth/signout').get(authControl.signout);
router
  .route('/auth/projects/:projectId/')
  .get(authControl.requireSignin, authControl.isAMember, (req, res) => {
    return res.status(200).json({ success: true });
  });

module.exports = router;
