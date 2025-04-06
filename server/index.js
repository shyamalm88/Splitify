const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const passport = require("passport");
const morgan = require("morgan");
const helmet = require("helmet");
const compression = require("compression");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const { Server } = require("socket.io");
const http = require("http");
require("dotenv").config();

// Import DB connection
const connectDB = require("./config/db");

// Import routes
const userRoutes = require("./routes/users");
const notificationRoutes = require("./routes/notifications");
const authRoutes = require("./routes/auth");

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev")); // logging
app.use(helmet()); // security headers
app.use(compression()); // compress responses

// Session configuration
app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === "production" },
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());
require("./config/passport");

// Routes
app.get("/", (req, res) => {
  res.send("Server is running");
});

// API routes
app.use("/api/users", userRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/auth", authRoutes);

// Socket.io connection
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
