const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const cors = require("cors");

require("dotenv").config()
mongoose.set('strictQuery', false);

const app = express();
const socket = require("socket.io");


app.use(express.json());

app.use(cors({
  origin: process.env.NE1FREELANCE_ORIGIN,
  credentials: true,
  methods: ['GET', 'POST', 'DELETE', 'PUT'], // Add OPTIONS method
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("DB Connection Successful"))
  .catch(err => console.log(`ERROR CONNECTION: ${err.message}`));

app.use(session({
  secret: process.env.EXPRESS_SESSION_KEY,
  resave: false,
  saveUninitialized: false,
}));

app.use("/api/auth", authRoutes);

const server = app.listen(process.env.SERVER_PORT, () =>
  console.log(`Mongoose Server started on ${process.env.SERVER_PORT}`)
);