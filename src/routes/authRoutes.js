// src/routes/authRoutes.js
const express = require('express');
const User = require('../models/user.js');
const jwt = require('jsonwebtoken');


const router = express.Router();


// Register new user
router.post('/register', async (req, res) => {
 const { name, email, password, role } = req.body;


 const userExists = await User.findOne({ email });


 if (userExists) {
   return res.status(400).json({ message: 'User already exists' });
 }


 const user = new User({
   name,
   email,
   password,
   role,
 });


 try {
   await user.save();


   const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });


   res.status(201).json({
     message: 'User registered successfully',
     token,
   });
 } catch (error) {
   res.status(500).json({ message: 'Error registering user', error: error.message });
 }
});


module.exports = router;
