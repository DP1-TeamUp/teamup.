const app = require('express')();
const server = require('http').createServer(app);
const cors = require('cors');

const io = require('socket.io')(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

app.use(cors());

const PORT = process.env.PORT || 4050;

app.get('/', (req, res) => {
  res.send('Server is running');
});

let users = {};

let socketToRoom = {};

io.on('connection', (socket) => {
  socket.on('join room', (roomID) => {
    if (users[roomID]) {
      users[roomID].push(socket.id);
    } else {
      users[roomID] = [socket.id];
    }

    console.log('you joined the room', users);

    socketToRoom[socket.id] = roomID;
    const usersInThisRoom = users[roomID].filter((id) => id !== socket.id);

    console.log('users in this room', usersInThisRoom);
    socket.emit('all users', usersInThisRoom);
  });

  socket.on('sending signal', (payload) => {
    io.to(payload.userToSignal).emit('user joined', {
      signal: payload.signal,
      callerID: payload.callerID,
    });
  });

  socket.on('returning signal', (payload) => {
    io.to(payload.callerID).emit('receiving returned signal', {
      signal: payload.signal,
      id: socket.id,
    });
  });

  socket.on('disconnectChat', () => {
    const roomID = socketToRoom[socket.id];
    console.log(roomID);
    let room = users[roomID];
    if (room) {
      room = room.filter((id) => id !== socket.id);
      users[roomID] = room;
    }

    const usersInThisRoom = users[roomID];
    console.log('disconnect', usersInThisRoom);

    socket.emit('all users', usersInThisRoom);
  });

  socket.on('disconnectChatfromButton', () => {
    const roomID = socketToRoom[socket.id];
    console.log(roomID);
    let room = users[roomID];
    if (room) {
      room = room.filter((id) => id !== socket.id);
      users[roomID] = room;
    }

    const usersInThisRoom = users[roomID];
    console.log('disconnect', usersInThisRoom);
  });
});

server.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
