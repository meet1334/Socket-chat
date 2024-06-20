const express = require("express");
const { createServer } = require("node:http");
const { join } = require("node:path");
const { Server } = require("socket.io");

const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(express.static(join(__dirname, "/public")));
app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "/index.html"));
});

// ================================= Socket started=========================================

const users = {};

io.on("connection", (socket) => {
  //=================== new user joining & message getting ================================
  socket.on("new-user-joined", (name) => {
    console.log(name, "new user joined");
    users[socket.id] = name;
    socket.broadcast.emit("user-joined", name);
  });

  //=================== new message sending & receiveing ===================================

  socket.on("send", (message) => {
    socket.broadcast.emit("receive", {
      message: message,
      name: users[socket.id],
    });
  });

  //=================== user left the group =================================================

  socket.on("disconnect", (message) => {
    socket.broadcast.emit("left-user", users[socket.id]);
    delete users[socket.id];
  });
});

// ================================= Socket ended============================================

server.listen(8000, () => {
  console.log("server running at http://localhost:8000");
});
