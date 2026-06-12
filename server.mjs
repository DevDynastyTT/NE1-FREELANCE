import { createServer } from "http";
import next from "next";
import { Server } from "socket.io";

const port = parseInt(process.env.PORT || "3000", 10);
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const onlineUsers = new Map();
const typingStatus = new Map();

app.prepare().then(() => {
  const httpServer = createServer(handle);

  const io = new Server(httpServer, {
    cors: {
      origin: process.env.NE1FREELANCE_ORIGIN || "http://localhost:3000",
      credentials: true,
    },
  });

  const setOnlineUser = (userID, socketID) => {
    if (!onlineUsers.has(userID)) {
      console.log("New Client Online");
      onlineUsers.set(userID, socketID);
    }
  };

  const sendTypingAlert = (senderID, receiverID) => {
    const onlineUserSocketID = onlineUsers.get(receiverID);
    typingStatus.set(senderID, true);
    io.to(onlineUserSocketID).emit("receive-typing-alert", {
      senderID,
      receiverID,
      isTyping: true,
    });

    setTimeout(() => {
      typingStatus.delete(senderID);
      io.to(onlineUserSocketID).emit("receive-typing-alert", {
        senderID,
        receiverID,
        isTyping: false,
      });
    }, 5000);
  };

  io.on("connection", (socket) => {
    socket.on("online-users", (data) => {
      setOnlineUser(data.userID, socket.id);
    });

    socket.on("typing-alert", (data) => {
      const { senderID, receiverID } = data;
      if (!typingStatus.has(senderID)) {
        sendTypingAlert(senderID, receiverID);
      }
    });

    socket.on("send-message", (data) => {
      const { message, file, sender, receiver, receiverID, senderID } = data;
      const onlineUserSocketID = onlineUsers.get(receiverID);

      const messageData = {
        senderID,
        newMessage: message,
        sender,
      };

      if (file) messageData.file = file;
      if (onlineUserSocketID) {
        io.to(onlineUserSocketID).emit("receive-message", messageData);
      }
    });

    socket.on("disconnect", () => {
      for (const [userID, socketID] of onlineUsers.entries()) {
        if (socketID === socket.id) {
          onlineUsers.delete(userID);
          console.log("User", userID, "is now offline");
          break;
        }
      }
    });
  });

  httpServer.listen(port, () => {
    console.log(
      `> Server listening at http://localhost:${port} as ${
        dev ? "development" : process.env.NODE_ENV
      }`
    );
  });
});
