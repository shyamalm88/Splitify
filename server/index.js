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

// Import models to ensure they're registered with Mongoose
require("./models/User");
require("./models/Group");
require("./models/Category");
require("./models/Expense");

// Import utils
const { initializeDefaults } = require("./utils/setupDefaults");
const { errorHandler } = require("./utils/errorHandler");

// Import routes
const userRoutes = require("./routes/users");
const notificationRoutes = require("./routes/notifications");
const authRoutes = require("./routes/auth");
const groupRoutes = require("./routes/groups");
const categoryRoutes = require("./routes/categories");
const expenseRoutes = require("./routes/expenses");

// Initialize Express app
const app = express();
const port = process.env.PORT || 5001;

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
connectDB()
  .then(async () => {
    // Initialize default data after DB connection is established
    await initializeDefaults();
  })
  .catch((err) => {
    console.error("Failed to initialize default data:", err);
  });

// Middleware
app.use(cors());
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ extended: true, limit: "100mb" }));
app.use(cookieParser());

// Use Morgan in development mode only
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// Security headers
app.use(helmet());

// Response compression
app.use(compression());

// Session configuration
app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    },
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
app.use("/api/groups", groupRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/expenses", expenseRoutes);

// Socket.io connection
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });

  // Add socket to a room based on user ID for targeted notifications
  socket.on("join_user_room", (userId) => {
    if (userId) {
      socket.join(`user_${userId}`);
      console.log(`User ${userId} joined their personal room`);
    }
  });

  // Join a group room to receive group-specific updates
  socket.on("join_group", (groupId) => {
    if (groupId) {
      socket.join(`group_${groupId}`);
      console.log(`Socket ${socket.id} joined group ${groupId}`);
    }
  });
});

// Make io accessible in routes
app.set("io", io);

// Error handling middleware (must be after routes)
app.use(errorHandler);

// Handle 404 errors
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    error: "Not Found",
    message: "The requested resource does not exist",
  });
});

// Start server
server.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

module.exports = app;
