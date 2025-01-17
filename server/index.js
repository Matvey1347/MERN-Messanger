const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const { Server } = require("socket.io");

const app = express();

require("dotenv").config()

app.use(express.json());
app.use(cors())
app.use("/api/users", require("./Routes/userRoute"));
app.use("/api/chats", require("./Routes/chatRoute"));
app.use("/api/messages", require("./Routes/messageRoute"));

const port = process.env.PORT;

const expressServer = app.listen(port, () => {
  console.log(`Running on ... ${port}`);
})

app.get("/", (req, res) => {
  res.send("Welcome our chat");
})

mongoose.connect(process.env.ATLAS_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log("Mongo Success"))
  .catch(err => console.log(`Mongo Error ${err}`));

const io = new Server(expressServer, {
  cors: process.env.CLIENT_URL
});

let onlineUsers = [];

io.on("connection", (socket) => {
  socket.on("addNewUser", (userId) => {
    if (!onlineUsers.some(user => user.userId === userId)) {
      onlineUsers.push({ userId, socketId: socket.id })
    }
    io.emit("getOnlineUsers", onlineUsers);
  });

  socket.on("disconnect", () => {
    onlineUsers = onlineUsers.filter(user => user.socketId !== socket.id);
    io.emit("getOnlineUsers", onlineUsers);
  });

  socket.on("sendMessage", ({ message, chat }) => {
    const users = onlineUsers.filter(socketUser => {
      if (chat.members.find(memberId => memberId == socketUser.userId)) {
        return socketUser;
      }
      return false;
    });

    users.forEach(socketUser => {
      io.to(socketUser.socketId).emit("getMessage", message);
      io.to(socketUser.socketId).emit("getHotification", {
        senderId: message.senderId,
        chatId: message.chatId,
        isRead: false,
        date: new Date()
      });
    });
  });
});