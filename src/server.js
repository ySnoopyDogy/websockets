
const express = require('express')
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = 3000;

app.use(express.static(__dirname + '/static'))

app.get('/', (_req, res) => {
  res.sendFile(__dirname + '/static/index.html');
});

io.on('connection', (socket) => {
  io.emit('conn', { type: 'add', user: socket.id })

  socket.on('disconnect', usr => {
    io.emit('conn', { type: 'disconnect', user: usr.id })
  })

  socket.on('chat message', msg => {
    io.emit('chat message', msg);
  });
});

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});