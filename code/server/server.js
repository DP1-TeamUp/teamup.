const config = require('../config/config');
const mongoose = require('mongoose');
const app = require('./express');

mongoose
  .connect(config.mongoUri, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Database Connected');
  })
  .catch((err) => {
    if (err) console.log('Unable to connect to database');
  });

app.listen(config.port, (err) => {
  if (err) {
    console.log(err);
  }
  console.log('Server started on port: ', config.port);
});
