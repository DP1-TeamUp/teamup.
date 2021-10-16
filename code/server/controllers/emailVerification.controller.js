const EmailVerification = require('../models/EmailVerification');
const transporter = require('../helper/nodemailer');

const createEmailVerification = async (req, res) => {
  if (
    !req.body.password ||
    !req.body.name ||
    !req.body.email ||
    !req.body.username
  ) {
    return res
      .status(400)
      .json({ success: false, message: 'Please fill in your form' });
  }
  if (req.body.password.length < 6) {
    return res.status(404).json({
      success: false,
      message: 'Password has to be of 6 charcters or more',
    });
  }

  let randomChars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (var i = 0; i < 8; i++) {
    result += randomChars.charAt(
      Math.floor(Math.random() * randomChars.length)
    );
  }

  const user = new EmailVerification({
    email: req.body.email,
    username: req.body.username,
    name: req.body.name,
    password: req.body.password,
    verificationCode: result,
  });

  const message = `Verification code: ${result}`;

  const mailOptions = {
    from: 'teamupp89@gmail.com',
    to: user.email,
    subject: 'Account Verification',
    text: message,
  };
  // sending mail
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      return res
        .status(200)
        .json({ success: false, message: 'Error sending mail' });
    } else {
      console.log('Email sent: ' + info.response);
    }
  });

  try {
    await user.save();
    return res.status(201).json({ success: true, message: 'Stored' });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res
        .status(400)
        .json({ success: false, message: 'Already have the code' });
    }
    return res
      .status(400)
      .json({ success: false, message: 'Unable to create an user' });
  }
};

module.exports = { createEmailVerification };
