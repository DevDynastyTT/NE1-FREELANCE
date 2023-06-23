const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const messageRoutes = require("./routes/messages");
const cors = require("cors");

require("dotenv").config()
mongoose.set('strictQuery', false);

const app = express();
const socket = require("socket.io");


app.use(express.json());

app.use(cors({
  origin: process.env.ORIGIN,
  credentials: true
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("DB Connection Successful"))
  .catch(err => console.log(`ERROR CONNECTION: ${err.message}`));

// Set up session middleware
// const sessionStore = new MongoStore({ mongooseConnection: mongoose.connection });

app.use(session({
  secret: process.env.EXPRESS_SESSION_KEY,
  resave: false,
  saveUninitialized: false,
}));

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);


const server = app.listen(process.env.SERVER_PORT, () =>
  console.log(`Mongoose Server started on ${process.env.SERVER_PORT}`)
);
 
const io = socket(server, {
  cors: {
    origin: process.env.ORIGIN,
    credentials: true,
  },
});

global.onlineUsers = new Map();
io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data.msg);
    }
  });
});




