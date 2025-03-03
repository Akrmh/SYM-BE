const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

// ✅ CREATE: Register an Admin
router.post("/register-admin", protect, authorizeRoles("admin"), async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword, role: "admin" });

    await newUser.save();

    res.status(201).json({
      message: "Admin registered successfully",
      user: { id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role },
    });
  } catch (error) {
    console.error("Error in register-admin route:", error);
    res.status(500).json({ message: error.message });
  }
});

// ✅ READ: Get All Admins
router.get("/admins", protect, authorizeRoles("admin"), async (req, res) => {
  try {
    const admins = await User.find({ role: "admin" }).select("-password");
    res.status(200).json(admins);
  } catch (error) {
    res.status(500).json({ message: "Error fetching admins", error: error.message });
  }
});

// ✅ READ: Get a Single Admin by ID
router.get("/admin/:id", protect, authorizeRoles("admin"), async (req, res) => {
  try {
    const admin = await User.findById(req.params.id).select("-password");
    if (!admin || admin.role !== "admin") {
      return res.status(404).json({ message: "Admin not found" });
    }
    res.status(200).json(admin);
  } catch (error) {
    res.status(500).json({ message: "Error fetching admin", error: error.message });
  }
});

// ✅ UPDATE: Update Admin Details
router.put("/admin/:id", protect, authorizeRoles("admin"), async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const admin = await User.findById(req.params.id);
    if (!admin || admin.role !== "admin") {
      return res.status(404).json({ message: "Admin not found" });
    }

    if (name) admin.name = name;
    if (email) admin.email = email;
    if (password) {
      admin.password = await bcrypt.hash(password, 10);
    }

    await admin.save();
    res.status(200).json({ message: "Admin updated successfully", admin });
  } catch (error) {
    res.status(500).json({ message: "Error updating admin", error: error.message });
  }
});

// ✅ DELETE: Remove an Admin
router.delete("/admin/:id", protect, authorizeRoles("admin"), async (req, res) => {
  try {
    const admin = await User.findById(req.params.id);
    if (!admin || admin.role !== "admin") {
      return res.status(404).json({ message: "Admin not found" });
    }

    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Admin deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting admin", error: error.message });
  }
});

module.exports = router;
