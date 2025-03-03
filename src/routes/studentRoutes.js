const express = require('express');
const bcrypt = require('bcryptjs');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const User = require('../models/user');

const router = express.Router();

// ✅ CREATE: Add a Student (Only Admins & Teachers can create)
router.post('/', protect, authorizeRoles('admin', 'teacher'), async (req, res) => {
  const { name, email, password, nationality, degree } = req.body;

  // Check if the user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const student = new User({
      name,
      email,
      password: hashedPassword,
      role: 'student', // Ensure only students are created
      nationality,
      degree,
    });

    await student.save();
    res.status(201).json({ message: 'Student created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error creating student', error: error.message });
  }
});

// ✅ READ: Get All Students (Only Admins & Teachers)
router.get('/', protect, authorizeRoles('admin', 'teacher'), async (req, res) => {
  try {
    const students = await User.find({ role: 'student' }).select('-password');
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching students', error: error.message });
  }
});

// ✅ READ: Get a Single Student by ID (Only Admins & Teachers)
router.get('/:id', protect, authorizeRoles('admin', 'teacher'), async (req, res) => {
  try {
    const student = await User.findById(req.params.id).select('-password');
    if (!student || student.role !== 'student') {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching student', error: error.message });
  }
});

// ✅ UPDATE: Modify Student Details (Only Admins & Teachers)
router.put('/:id', protect, authorizeRoles('admin', 'teacher'), async (req, res) => {
  const { name, email, nationality, degree } = req.body;

  try {
    const student = await User.findById(req.params.id);
    if (!student || student.role !== 'student') {
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

// ✅ DELETE: Remove a Student (Only Admins & Teachers)
router.delete('/:id', protect, authorizeRoles('admin', 'teacher'), async (req, res) => {
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
