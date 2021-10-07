const express = require('express');
const userControl = require('../controllers/user.controller');
const authControl = require('../controllers/auth.controller');
const fileUpload = require('../middlewares/file-upload');

const router = express.Router();

router
  .route('/api/notifications/:uid')
  .get(userControl.getNotifications)
  .delete(userControl.deleteNotifications);

router.route('/api/users').get(userControl.list).post(userControl.create);

router
  .route('/api/users/:userId')
  .get(authControl.requireSignin, userControl.read)
  .put(
    authControl.requireSignin,
    authControl.hasAuthorization,
    fileUpload.single('image'),
    userControl.update
  )
  .delete(
    authControl.requireSignin,
    authControl.hasAuthorization,
    userControl.remove
  );
router.post('/forget-password', userControl.forgetPassword);
router.put('/reset-password/:resetToken', userControl.resetPassword);
router
  .route('/api/skills/users')
  .put(userControl.addSkills)
  .delete(userControl.deleteSkill);

router.param('userId', userControl.userByID);

module.exports = router;
