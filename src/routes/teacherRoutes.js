const express = require('express');
const protect = require('../middleware/authMiddleware');
const User = require('../models/user');

const router = express.Router();

// Create a teacher (Admin only)
router.post('/', protect(['admin']), async (req, res) => {
  const { name, email, password, nationality, degree } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const teacher = new User({ name, email, password, role: 'teacher', nationality, degree });

  try {
    await teacher.save();
    res.status(201).json({ message: 'Teacher created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error creating teacher', error: error.message });
  }
});

// Get all teachers (Admin only)
router.get('/', protect(['admin']), async (req, res) => {
  try {
    const teachers = await User.find({ role: 'teacher' });
    res.json(teachers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching teachers', error: error.message });
  }
});

// Update teacher (Admin only)
router.put('/:id', protect(['admin']), async (req, res) => {
  const { name, email, nationality, degree } = req.body;

  try {
    const teacher = await User.findById(req.params.id);
    if (!teacher) {
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

// Delete teacher (Admin only)
router.delete('/:id', protect(['admin']), async (req, res) => {
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
