const express = require('express');
const protect = require('../middleware/authMiddleware');
const User = require('../models/user');

const router = express.Router();

// Create a student (Admin and Teacher roles allowed)
router.post('/', protect(['admin', 'teacher']), async (req, res) => {
  const { name, email, password, nationality, degree } = req.body;

  // Check if user already exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  // Create a new student
  const student = new User({
    name,
    email,
    password,
    role: 'student', // Force the role to be 'student' for student creation
    nationality,
    degree,
  });

  try {
    // Save the student
    await student.save();
    res.status(201).json({ message: 'Student created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error creating student', error: error.message });
  }
});

// Get all students (Admin and teachers)
router.get('/', protect(['admin', 'teacher']), async (req, res) => {
  try {
    const students = await User.find({ role: 'student' });
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching students', error: error.message });
  }
});

// Update student (Admin and Teacher roles allowed)
router.put('/:id', protect(['admin', 'teacher']), async (req, res) => {
  const { name, email, nationality, degree } = req.body;

  try {
    const student = await User.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    student.name = name || student.name;
    student.email = email || student.email;
    student.nationality = nationality || student.nationality;
    student.degree = degree || student.degree;

    await student.save();
    res.json({ message: 'Student updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating student', error: error.message });
  }
});

// Delete student (Admin and Teacher roles allowed)
router.delete('/:id', protect(['admin', 'teacher']), async (req, res) => {
  try {
    const student = await User.findByIdAndDelete(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting student', error: error.message });
  }
});

module.exports = router;
