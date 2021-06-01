
const express = require('express')
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = 3000;

app.use(express.static(__dirname + '/static'))

app.get('/', (_req, res) => {
  res.sendFile(__dirname + '/static/index.html');
});

const nicknames = new Map()

const randomNicks = [
  "Coco Gelado",
  "Cabelo Arrepiado",
  "Pindamonhangaba",
  "123mateus",
  "gamer123",
  "jogandopica",
  "JoaoZinhoG4mer123"
]

io.on('connection', (socket) => {

  nicknames.set(socket.id, randomNicks[Math.floor(Math.random() * randomNicks.length)])
  io.emit('connection-info', { type: 'add', socketID: socket.id, nickname: nicknames.get(socket.id) })
  socket.on('disconnect', () => {
    io.emit('connection-info', { type: 'disconnect', socketID: socket.id, nickname: nicknames.get(socket.id) })
    nicknames.delete(socket.id)
  })

  socket.on('message', msg => {
    socket.broadcast.emit('message', { message: msg, author: nicknames.get(socket.id) });
  });

  socket.on('change-nick', data => {
    io.emit('change-nick', { oldNick: nicknames.get(data.socketID), newNick: data.nickname })
    nicknames.set(data.socketID, data.nickname)
  })

  socket.emit("force nickname change", nicknames.get(socket.id))

});

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});