const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'teamupp89@gmail.com',
    pass: 'g0198tid', // naturally, replace both with your real credentials or an application-specific password
  },
});

module.exports = transporter;
