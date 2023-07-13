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

const setOnlineUser = (userID: string, socketID: string): void => {
  if(!onlineUsers.has(userID)){
    onlineUsers.set(userID, socketID)
    console.log(onlineUsers.get(userID), 'is now online')
  }else console.log('User is already online')
}

const sendTypingAlert = (senderID:string, receiverID:string):void => {
  const onlineUserSocketID = onlineUsers.get(receiverID);
  io.to(onlineUserSocketID).emit("receive-typing-alert", {senderID, receiverID, isTyping: true});
}

//Listen for connection event when client establishes a websocket connection
// ...

io.on("connection", (socket) => {
  console.log('Client Connected')

  socket.on("online-users", (data:any) => {
    setOnlineUser(data.userID, socket.id);
  });

  socket.on("typing-alert", (data) => {
    const {senderID, receiverID} = data
    sendTypingAlert(senderID, receiverID)
  })

  socket.on("send-message", (data:any) => {
    const {message, sender, receiver, receiverID, senderID,  } = data;

    const onlineUserSocketID = onlineUsers.get(receiverID);
    if (!onlineUserSocketID) {
      console.log(`${receiver} is offline`)
      axios.post(notifyUserRoute, 
        {
          message, receiverID, senderID
        })
    }

      console.log(`${receiver} is online`)
      io.to(onlineUserSocketID).emit("receive-message", {
        senderID,
        newMessage: message,
      });
      console.log(sender, "sent", message, 'to', receiver);


   
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
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

/* io.emit()
  In the context of websockets and event-driven programming, 
  "emit" refers to sending or publishing an event from one part 
  of the application to another. It allows you to trigger an 
  event and provide data associated with that event.

  In the case of websockets, emitting an event means sending data 
  from the client to the server or vice versa. It allows communication 
  between the client and the server by sending messages or notifications.
*/