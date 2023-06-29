const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const cors = require("cors");

require("dotenv").config();

mongoose.set('strictQuery', false);

const app = express();

// Parse JSON bodies
app.use(express.json());

// Enable CORS with specific options
app.use(cors({
  origin: process.env.ORIGIN,
  credentials: true,
  methods: ['GET', 'POST', 'DELETE', 'PUT', 'OPTIONS'], // Add OPTIONS method
}));

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("DB Connection Successful"))
  .catch(err => console.log(`ERROR CONNECTION: ${err.message}`));

// Set up session middleware
app.use(session({
  secret: process.env.EXPRESS_SESSION_KEY,
  resave: false,
  saveUninitialized: false,
}));

// Route for authentication
app.use("/api/auth", authRoutes);

// Start the server
const server = app.listen(process.env.SERVER_PORT, () =>
  console.log(`Express Server started on port ${process.env.SERVER_PORT}`)
);
