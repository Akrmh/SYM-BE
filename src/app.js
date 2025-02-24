const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db.js");
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const gradeRoutes = require('./routes/gradeRoutes');
const userRoutes = require('./routes/userRoutes');
const performanceRoutes = require('./routes/performanceRoutes');
const notificationRoutes = require('./routes/notificationRoutes');




// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Authentication routes
app.use('/api/auth', authRoutes);

// Admin routes (only accessible by admin)
app.use('/api/admin', adminRoutes);

// Add the attendance routes
app.use('/api/attendance', attendanceRoutes);

// Add the grade routes
app.use('/api/grades', gradeRoutes)

// Add user search route
app.use('/api/users', userRoutes);

// Add performance routes
app.use('/api/performance', performanceRoutes);

// Add  notification routes.
app.use('/api/notifications', notificationRoutes);


app.get("/", (req, res) => {
  res.send("API is running...");
});

module.exports = app;
