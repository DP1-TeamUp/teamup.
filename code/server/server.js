const config = require('../config/config');
const mongoose = require('mongoose');
const app = require('./express');
const Pusher = require('pusher');

const pusher = new Pusher({
  appId: '1231858',
  key: '44f5dfd1d0a381447e26',
  secret: '589d3d57a970cc42aa87',
  cluster: 'ap2',
  useTLS: true,
});

mongoose.connect(config.mongoUri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Connection Error:'));

db.once('open', () => {
  console.log('Database connected');

  //----------------------------------------------------------------For Actives Members-----------------
  const activesMembers = db.collection('actives');
  const changeStreamActive = activesMembers.watch();
  changeStreamActive.on('change', (change) => {
    //console.log('A change occured in members', change);

    if (change.operationType === 'insert') {
      const activeDetails = change.fullDocument;
      pusher.trigger('actives', 'inserted', {
        message: activeDetails,
      });
    } else if (change.operationType === 'delete') {
      pusher.trigger('actives', 'deleted', {
        message: 'delete',
      });
    } else {
      console.log('Error trigerring Pusher');
    }
  });

  //----------------------------------------------------------------For Pitchers----------------
  const pitchers = db.collection('pitchers');
  const changeStreamPitchers = pitchers.watch();
  changeStreamPitchers.on('change', (change) => {
    if (
      change.operationType === 'insert' ||
      change.operationType === 'delete'
    ) {
      const activeDetails = change.fullDocument;
      pusher.trigger('pitchers', 'please', {
        message: activeDetails,
      });
    } else if (change.operationType === 'update') {
      let data = {
        identity: change.documentKey,
        x: change.updateDescription.updatedFields.x,
        y: change.updateDescription.updatedFields.y,
      };
      pusher.trigger('pitchers', 'pitcherUpdate', {
        message: data,
      });
    } else {
      console.log('Error trigerring Pusher');
    }
  });

  //---------------------------------------------------------------For User Notifications------------
  const allUsers = db.collection('users');
  const changeStreamUsers = allUsers.watch();
  changeStreamUsers.on('change', (change) => {
    //console.log('A change occured in members', change);
    if (change.operationType === 'update') {
      let data = change.updateDescription.updatedFields;
      pusher.trigger('notifications', 'notificationUpdate', {
        message: data,
      });
    } else {
      console.log('Error trigerring Pusher');
    }
  });
});

app.listen(config.port, (err) => {
  if (err) {
    console.log(err);
  }
  console.log('Server started on port: ', config.port);
});
