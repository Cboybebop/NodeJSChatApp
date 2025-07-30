const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

io.on('connection', socket => {
  socket.on('join', ({ room, name }) => {
    socket.name = name;
    const clients = io.sockets.adapter.rooms.get(room) || new Set();
    if (clients.size >= 2) {
      socket.emit('room-full');
      return;
    }
    socket.join(room);
    socket.emit('joined', room);
    socket.to(room).emit('user-connected', { name });
    const updatedClients = io.sockets.adapter.rooms.get(room);
    if (updatedClients.size === 2) {
      io.to(room).emit('ready');
    }
  });

  socket.on('offer', data => {
    socket.to(data.room).emit('offer', { offer: data.offer, name: socket.name });
  });

  socket.on('answer', data => {
    socket.to(data.room).emit('answer', { answer: data.answer, name: socket.name });
  });

  socket.on('candidate', data => {
    socket.to(data.room).emit('candidate', { candidate: data.candidate, name: socket.name });
  });

  socket.on('message', data => {
    io.in(data.room).emit('message', { name: socket.name, message: data.message });
  });

  socket.on('disconnecting', () => {
    socket.rooms.forEach(room => {
      if (room !== socket.id) {
        socket.to(room).emit('user-disconnected', { name: socket.name });
      }
    });
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server started on port ${PORT}`));