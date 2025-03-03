// src/server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const teacherRoutes = require('./routes/teacherRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const searchRoutes = require('./routes/searchRoutes');
const adminRoutes = require('./routes/adminRoutes'); // Import admin routes


dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/admin', adminRoutes); // Mount admin routes
app.use('/api/admins', adminRoutes)
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/search', searchRoutes);

// Real-time communication
io.on('connection', (socket) => {
  console.log('New client connected');
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Health Check Route
app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "Server is running!" });
});

server.listen(process.env.PORT || 5000, () => {
  console.log(`Server running in ${process.env.PORT} `);
});
