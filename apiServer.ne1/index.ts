import cors from "cors";
import axios from 'axios'
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import session from "express-session";
import { authRoutes } from "./routes/auth";
import { notifyUserRoute } from '../nextjs/utils/APIRoutes';
const socket = require("socket.io");

dotenv.config();

mongoose.set("strictQuery", false);

/************** EXPRESSjs FOR SERVER REQUEST RESPONSE COMMUNICATION **************/

const app = express();

// Parse JSON request bodies
app.use(express.json());

// Enable Cross-Origin Resource Sharing (CORS)
app.use(cors({
  origin: process.env.NE1FREELANCE_ORIGIN,
  credentials: true,
  methods: ["GET", "POST", "DELETE", "PUT"], // Add OPTIONS method
}));

// Parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB database
mongoose.connect(process.env.MONGODB_URI, {
  useUnifiedTopology: true
} as any)
  .then(() => console.log("DB Connection Successful"))
  .catch(err => console.log(`ERROR CONNECTION: ${err.message}`));

// Configure express-session middleware
app.use(session({
  secret: process.env.EXPRESS_SESSION_KEY,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === "production" ? true : false,
    httpOnly: true
  }
}));

// Mount the authRoutes middleware at the "/api/auth" path
app.use("/api/auth", authRoutes);
app.use("/api/auth/messages", authRoutes);

/// Start the server
const server = app.listen(process.env.SERVER_PORT, () =>
  console.log(`Server started on ${process.env.SERVER_PORT}`)
);



/************** WEBSOCKET FOR FULL-DUPLEX COMMUNICATION **************/

// Initialize socket.io
export const io = socket(server, {
  cors: {
    origin: process.env.NE1FREELANCE_ORIGIN,
    credentials: true,
  },
});

//Track onlineUsers by { "userID": "sockedID }
const onlineUsers = new Map();
// Track typing status by { "senderID": "isTyping" }
const typingStatus = new Map();

const setOnlineUser = (userID: string, socketID: string): void => {
  if(!onlineUsers.has(userID)) {
    console.log('New Client Online')
    onlineUsers.set(userID, socketID)
  }
}

const sendTypingAlert = (senderID, receiverID) => {
  const onlineUserSocketID = onlineUsers.get(receiverID);
  typingStatus.set(senderID, true);
  io.to(onlineUserSocketID).emit('receive-typing-alert', { senderID, receiverID, isTyping: true});

  setTimeout(() => {
    typingStatus.delete(senderID);
    io.to(onlineUserSocketID).emit('receive-typing-alert', { senderID, receiverID, isTyping: false});
  }, 5000);
};

//Listen for connection event when client establishes a websocket connection
// ...
let clientCount = 0
io.on("connection", (socket) => {
  socket.on("online-users", (data:any) => {
    setOnlineUser(data.userID, socket.id);
  });

  socket.on("typing-alert", (data) => {
    const {senderID, receiverID} = data
    if (!typingStatus.has(senderID)) sendTypingAlert(senderID, receiverID);
  })

  socket.on("send-message", (data:any) => {
    const {message, file, sender, receiver, receiverID, senderID,  } = data;
    const onlineUserSocketID = onlineUsers.get(receiverID);
    // if (!onlineUserSocketID) {
    //   axios.post(notifyUserRoute, 
    //     {
    //       message, receiverID, senderID
    //     })
    // }

      const messageData:any =  {
        senderID,
        newMessage: message,
        sender
      }

      if(file) messageData.file = file
      io.to(onlineUserSocketID).emit("receive-message", messageData);

  });

  socket.on('disconnect', () => {
    // Remove the disconnected socket from the onlineUsers map
    for (const [userID, socketID] of onlineUsers.entries()) {
      if (socketID === socket.id) {
        onlineUsers.delete(userID);
        console.log('User', userID, 'is now offline');
        break;
      }
    }
  });   
});