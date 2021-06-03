const express = require('express');
const app = express();

const http = require('http');
const server = htpp.createServer(app);

//pass socket.io in the created server
const io = require('socket.io')(server, {
  cors: {
    origin: 'https://localhost:3000',
    method: ['GET', 'POST'],
  },
});

io.on('connection', onConnection);

function onConnection(socket) {
  socket.on('drawing', (data) => socket.broadcast.emit('drawing', data));
}

const port = 4000;

server.listen(port, () => console.log(`Server running on port ${port}`));
