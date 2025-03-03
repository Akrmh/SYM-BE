const express = require('express');
const bcrypt = require('bcryptjs');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const User = require('../models/user');

const router = express.Router();

// ✅ CREATE: Add a Teacher (Admin Only)
router.post('/', protect, authorizeRoles('admin'), async (req, res) => {
  const { name, email, password, nationality, degree } = req.body;

  // Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const teacher = new User({
      name,
      email,
      password: hashedPassword,
      role: 'teacher',
      nationality,
      degree,
    });

    await teacher.save();
    res.status(201).json({ message: 'Teacher created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error creating teacher', error: error.message });
  }
});

// ✅ READ: Get All Teachers (Admin Only)
router.get('/', protect, authorizeRoles('admin'), async (req, res) => {
  try {
    const teachers = await User.find({ role: 'teacher' }).select('-password');
    res.json(teachers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching teachers', error: error.message });
  }
});

// ✅ READ: Get a Single Teacher by ID (Admin Only)
router.get('/:id', protect, authorizeRoles('admin'), async (req, res) => {
  try {
    const teacher = await User.findById(req.params.id).select('-password');
    if (!teacher || teacher.role !== 'teacher') {
      return res.status(404).json({ message: 'Teacher not found' });
    }
    res.json(teacher);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching teacher', error: error.message });
  }
});

// ✅ UPDATE: Modify Teacher Details (Admin Only)
router.put('/:id', protect, authorizeRoles('admin'), async (req, res) => {
  const { name, email, nationality, degree } = req.body;

  try {
    const teacher = await User.findById(req.params.id);
    if (!teacher || teacher.role !== 'teacher') {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    teacher.name = name || teacher.name;
    teacher.email = email || teacher.email;
    teacher.nationality = nationality || teacher.nationality;
    teacher.degree = degree || teacher.degree;

    await teacher.save();
    res.json({ message: 'Teacher updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating teacher', error: error.message });
  }
});

// ✅ DELETE: Remove a Teacher (Admin Only)
router.delete('/:id', protect, authorizeRoles('admin'), async (req, res) => {
  try {
    const teacher = await User.findByIdAndDelete(req.params.id);
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    res.json({ message: 'Teacher deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting teacher', error: error.message });
  }
});

module.exports = router;
