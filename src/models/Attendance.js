const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
    required: true,
  },
  status: {
    type: String,
    enum: ['Present', 'Absent'],
    required: true,
  },
  complement: {
    type: String, // Reason for attendance (if needed)
  },
  markedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Teacher who marked attendance
    required: true,
  },
});

const Attendance = mongoose.model('Attendance', attendanceSchema);
module.exports = Attendance;
