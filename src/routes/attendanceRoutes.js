const express = require('express');
const protect = require('../middleware/authMiddleware');
const Attendance = require('../models/Attendance');
const User = require('../models/user');

const router = express.Router();

// Record attendance (Admin and Teacher roles allowed)
router.post('/', protect(['admin', 'teacher']), async (req, res) => {
  const { studentId, status, notes } = req.body;

  const student = await User.findById(studentId);
  if (!student || student.role !== 'student') {
    return res.status(400).json({ message: 'Invalid student' });
  }

  const attendance = new Attendance({
    student: studentId,
    status,
    notes,
  });

  try {
    await attendance.save();
    res.status(201).json({ message: 'Attendance recorded successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error recording attendance', error: error.message });
  }
});

// Get attendance (Admin and Teacher roles allowed)
router.get('/', protect(['admin', 'teacher']), async (req, res) => {
  try {
    const attendanceRecords = await Attendance.find().populate('student', 'name email');
    res.json(attendanceRecords);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching attendance records', error: error.message });
  }
});

// Get attendance for a specific student (Admin and Teacher roles allowed)
router.get('/:studentId', protect(['admin', 'teacher']), async (req, res) => {
  try {
    const attendanceRecords = await Attendance.find({ student: req.params.studentId }).populate('student', 'name email');
    res.json(attendanceRecords);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching student attendance records', error: error.message });
  }
});

module.exports = router;
