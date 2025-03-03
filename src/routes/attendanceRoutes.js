const express = require("express");
const { protect, authorizeRoles } = require("../middleware/authMiddleware.js");
const Attendance = require("../models/Attendance.js");
const Notification = require("../models/Notification.js");

const router = express.Router();

/**
 * @route POST /api/attendance/mark
 * @desc Mark student attendance (Admin & Teacher)
 * @access Admin, Teacher
 */
router.post("/mark", protect, authorizeRoles("teacher", "admin"), async (req, res) => {
  try {
    const { studentId, status, date } = req.body;

    if (!studentId || !status) {
      return res.status(400).json({ message: "Student ID and status are required." });
    }

    const attendance = await Attendance.create({
      student: studentId,
      markedBy: req.user.id,
      status,
      date: date || new Date(),
    });

    // Send notification to student
    await Notification.create({
      recipient: studentId,
      sender: req.user.id,
      type: "attendance",
      message: `Your attendance for ${attendance.date.toDateString()} is marked as ${status}.`,
    });

    res.status(201).json({ message: "Attendance marked successfully", attendance });
  } catch (error) {
    res.status(500).json({ message: "Error marking attendance", error: error.message });
  }
});

/**
 * @route GET /api/attendance/student/:studentId
 * @desc Get attendance record for a specific student (Admin & Teacher)
 * @access Admin, Teacher
 */
router.get("/student/:studentId", protect, authorizeRoles("teacher", "admin"), async (req, res) => {
  try {
    const { studentId } = req.params;

    const attendanceRecords = await Attendance.find({ student: studentId }).sort({ date: -1 });

    res.json({ attendance: attendanceRecords });
  } catch (error) {
    res.status(500).json({ message: "Error fetching attendance", error: error.message });
  }
});

/**
 * @route GET /api/attendance/me
 * @desc Get logged-in student's own attendance
 * @access Student
 */
router.get("/me", protect, authorizeRoles("student"), async (req, res) => {
  try {
    const attendanceRecords = await Attendance.find({ student: req.user.id }).sort({ date: -1 });

    res.json({ attendance: attendanceRecords });
  } catch (error) {
    res.status(500).json({ message: "Error fetching your attendance", error: error.message });
  }
});

module.exports = router;
