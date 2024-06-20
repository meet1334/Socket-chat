const socket = io();

const form = document.getElementById("send-container");
const messageInput = document.getElementById("messageInp");
const messageContainer = document.querySelector(".container");

//=================== For Append msg in container  =================

const append = (message, classLists, position) => {
  const messageElement = document.createElement("div");
  messageElement.innerText = message;
  messageElement.classList.add(classLists);
  messageElement.classList.add(position);
  messageContainer.appendChild(messageElement);
};

//=================== for message Sending receiving ================

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = messageInput.value;
  append(`You:${message}`, "msg", "right");
  socket.emit("send", message);
  messageInput.value = "";
});

//=================== for joining group msg =========================

const name = prompt("Enter your name to join chat:");
socket.emit("new-user-joined", name);

socket.on("user-joined", (name) => {
  append(`${name} is joined the conversation`, "midmsg", "middle");
});

//=================== for receiving  msg =============================

socket.on("receive", (data) => {
  append(`${data.name}:${data.message}`, "msg", "left");
});

//=================== for left group msg ==============================

socket.on("left-user", (name) => {
  append(`${name} is left the conversation`, "midmsg", "middle");
});
