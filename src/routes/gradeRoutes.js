const express = require('express');
const protect = require('../middleware/authMiddleware');
const Grade = require('../models/Grade');
const User = require('../models/user');

const router = express.Router();

// Add a grade (Admin and Teacher roles allowed)
router.post('/', protect(['admin', 'teacher']), async (req, res) => {
  const { studentId, subject, grade } = req.body;

  const student = await User.findById(studentId);
  if (!student || student.role !== 'student') {
    return res.status(400).json({ message: 'Invalid student' });
  }

  const gradeEntry = new Grade({
    student: studentId,
    subject,
    grade,
    teacher: req.user.id, // Store the teacher who added the grade
  });

  try {
    await gradeEntry.save();
    res.status(201).json({ message: 'Grade added successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error adding grade', error: error.message });
  }
});

// Get all grades (Admin and Teacher roles allowed)
router.get('/', protect(['admin', 'teacher']), async (req, res) => {
  try {
    const grades = await Grade.find().populate('student', 'name email').populate('teacher', 'name email');
    res.json(grades);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching grades', error: error.message });
  }
});

// Get grades for a specific student (Admin and Teacher roles allowed)
router.get('/:studentId', protect(['admin', 'teacher']), async (req, res) => {
  try {
    const grades = await Grade.find({ student: req.params.studentId }).populate('student', 'name email').populate('teacher', 'name email');
    res.json(grades);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching student grades', error: error.message });
  }
});

// Update a grade (Admin and Teacher roles allowed)
router.put('/:id', protect(['admin', 'teacher']), async (req, res) => {
  const { subject, grade } = req.body;

  try {
    const updatedGrade = await Grade.findByIdAndUpdate(
      req.params.id,
      { subject, grade },
      { new: true }
    );
    res.json(updatedGrade);
  } catch (error) {
    res.status(500).json({ message: 'Error updating grade', error: error.message });
  }
});

// Delete a grade (Admin and Teacher roles allowed)
router.delete('/:id', protect(['admin', 'teacher']), async (req, res) => {
  try {
    await Grade.findByIdAndDelete(req.params.id);
    res.json({ message: 'Grade deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting grade', error: error.message });
  }
});

module.exports = router;
