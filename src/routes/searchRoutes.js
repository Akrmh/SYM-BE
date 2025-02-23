// src/routes/searchRoutes.js
const express = require('express');
const User = require('../models/user');

const router = express.Router();

// Search for users by name, degree, or nationality
router.get('/', async (req, res) => {
  const { name, degree, nationality } = req.query;
  const query = {};

  if (name) query.name = { $regex: name, $options: 'i' };
  if (degree) query.degree = { $regex: degree, $options: 'i' };
  if (nationality) query.nationality = { $regex: nationality, $options: 'i' };

  try {
    const users = await User.find(query);
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error searching users', error: error.message });
  }
});

module.exports = router;
