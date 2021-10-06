const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const compress = require('compression');
const cors = require('cors');
const helmet = require('helmet');

const userRoutes = require('./routes/user.routes');
const authRoutes = require('./routes/auth.routes');
const projectRoutes = require('./routes/project.routes');
const boardRoutes = require('./routes/board.routes');
const taskRoutes = require('./routes/task.routes');
const activeRoutes = require('./routes/active.routes');
const sprintRoutes = require('./routes/sprint.routes');
const reportsRoutes = require('./routes/reports.routes');
const pitcherRoutes = require('./routes/pitcher.routes');

const app = express();

/*. . . configure express ...*/
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compress());
app.use(helmet());
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use('/uploads', express.static('uploads'));

//routes
app.use('/', userRoutes);
app.use('/', authRoutes);
app.use('/', projectRoutes);
app.use('/', boardRoutes);
app.use('/', taskRoutes);
app.use('/', activeRoutes);
app.use('/', sprintRoutes);
app.use('/', reportsRoutes);
app.use('/', pitcherRoutes);

app.use((err, req, res, next) => {
  console.log(err);
  if (err.name === 'UnauthorizedError') {
    res
      .status(401)
      .json({ success: false, message: err.name + ': ' + err.message });
  } else if (err) {
    res
      .status(400)
      .json({ success: false, message: err.name + ': ' + err.message });
    console.log(err);
  }
});

module.exports = app;
