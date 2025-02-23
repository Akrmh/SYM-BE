const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db.js");
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');

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

app.get("/", (req, res) => {
  res.send("API is running...");
});

module.exports = app;
