var socket = io();

var messages = document.getElementById("messages");
var form = document.getElementById("form");
var input = document.getElementById("input");
var nicks = document.getElementById("nickname");
var newNick = document.getElementById("newnick");
var typingText = document.getElementById("typing");
var onlineUsersTable = document.getElementById("online-table")

var isTyping = false;

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (input.value) {
    socket.emit("message", input.value);
    addMessage({ text: input.value, author: socket.nickname, class: "msg own-message" });
    input.value = "";
    isTyping = false;
  }
});

input.addEventListener('keypress', () => {
  if (!isTyping) socket.emit('typing-start', socket.id)
  isTyping = true;
})

nicks.addEventListener("submit", (e) => {
  e.preventDefault();
  if (newNick.value && newNick.value !== socket.nickname) {
    socket.nickname = newNick.value
    socket.emit("change-nick", { socketID: socket.id, nickname: newNick.value })
  }
})

socket.on("new-member", nick => socket.nickname = nick)

socket.on('typing-start', user => {
  typingText.className = "typing"
  typingText.textContent = `${user} está digitando`
})

socket.emit("help");
socket.on('ta ai', (data) => {
  data.forEach(a => {
    onlineUsers({ add: true, id: a.id, username: a.nick })
  })
})

socket.on("connection-info", (data) => {
  switch (data.type) {
    case "add":
      addMessage({ text: `${data.nickname} entrou na conversa`, class: "conn-info" })
      if (data.socketID !== socket.id)
        onlineUsers({ add: true, id: data.socketID, username: data.nickname })
      break;
    case "disconnect":
      addMessage({ text: `${data.nickname} saiu da conversa`, class: "conn-info gray" })
      onlineUsers({ add: false, id: data.socketID })
      break;
  }
});

socket.on("change-nick", data => {
  addMessage({ text: `${data.oldNick} mudou o nome para ${data.newNick}`, class: "nicks" })
  changeOnlineUserNick({ id: data.userID, nickname: data.newNick, oldNick: data.oldNick })
})

socket.on("message", function (msg) {
  addMessage({ author: msg.author, class: "msg incoming-message", text: msg.message })
  typingText.className = "typing hide"
});

function addMessage(data) {
  var sam = document.createElement("div")
  var item = document.createElement("li");
  sam.className = "name"
  sam.textContent = data.author
  item.textContent = data.text
  item.className += data.class
  messages.appendChild(item);
  if (data.author) item.appendChild(sam);
  window.scrollTo(0, document.body.scrollHeight);
}

function onlineUsers(user) {
  if (user.add) {
    var newUser = document.createElement("li")
    newUser.textContent = `${user.username} está online`
    newUser.id = user.id
    onlineUsersTable.appendChild(newUser)
  } else {
    var oldUser = document.getElementById(user.id);
    oldUser.remove();
  }
}

function changeOnlineUserNick(user) {
  var userData = document.getElementById(user.id);
  userData.textContent = `${user.nickname} (${user.oldNick}) está online`
}

