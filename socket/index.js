const { Server } = require("socket.io");

const io = new Server({
  cors: "http://localhost:5173/"
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

io.listen(3000);