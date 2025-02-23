// src/routes/adminRoutes.js
const express = require('express');
const protect = require('../middleware/authMiddleware.js');

const router = express.Router();

// Example of an admin-only route
router.get('/admin-dashboard', protect(['admin']), (req, res) => {
  res.json({ message: 'Welcome to the Admin Dashboard' });
});

module.exports = router;
