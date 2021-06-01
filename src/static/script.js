var socket = io();

var messages = document.getElementById("messages");
var form = document.getElementById("form");
var input = document.getElementById("input");
var nicks = document.getElementById("nickname")
var newNick = document.getElementById("newnick")

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (input.value) {
    socket.emit("message", input.value);
    addMessage({ text: input.value, author: socket.nickname, class: "msg own-message" });
    input.value = "";
  }
});

nicks.addEventListener("submit", (e) => {
  e.preventDefault();
  if (newNick.value && newNick.value !== socket.nickname) {
    socket.nickname = newNick.value
    socket.emit("change-nick", { socketID: socket.id, nickname: newNick.value })
  }
})

socket.on("force nickname change", nick => {
  socket.nickname = nick;
})

socket.on("connection-info", (data) => {
  switch (data.type) {
    case "add":
      addMessage({ text: `${data.nickname} entrou na conversa`, class: "conn-info" })
      break;
    case "disconnect":
      addMessage({ text: `${data.nickname} saiu da conversa`, class: "conn-info gray" })
      break;
  }
});

socket.on("change-nick", data => {
  addMessage({ text: `${data.oldNick} mudou o nome para ${data.newNick}`, class: "nicks" })
})

socket.on("message", function (msg) {
  addMessage({ author: msg.author, class: "msg incoming-message", text: msg.message })
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

