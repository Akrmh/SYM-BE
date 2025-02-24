const express = require('express');
const protect = require('../middleware/authMiddleware');
const User = require('../models/user');

const router = express.Router();

// Search for students and teachers by name, degree, or nationality
router.get('/search', protect(['admin', 'teacher']), async (req, res) => {
  try {
    const { query, role } = req.query;

    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const searchCriteria = {
      role: role === 'teacher' ? 'teacher' : 'student', // Default to student if not specified
      $or: [
        { name: new RegExp(query, 'i') },  // Case-insensitive name search
        { degree: new RegExp(query, 'i') },
        { nationality: new RegExp(query, 'i') },
      ],
    };

    const users = await User.find(searchCriteria).select('-password'); // Exclude password from results
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error searching users', error: error.message });
  }
});

module.exports = router;
