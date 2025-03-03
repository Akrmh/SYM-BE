const express = require("express");
const protect = require("../middleware/authMiddleware.js");
const Performance = require("../models/Performance.js");
const Notification = require("../models/Notification.js");
const User = require("../models/user.js"); // Ensure student exists

const router = express.Router();

/**
 * @route POST /api/performance/add
 * @desc Add student performance record (Teacher & Admin)
 * @access Teacher, Admin
 */
router.post("/add", protect(["teacher", "admin"]), async (req, res) => {
  try {
    const { studentId, subject, score, feedback } = req.body;

    if (!studentId || !subject || score === undefined) {
      return res.status(400).json({ message: "Student ID, subject, and score are required." });
    }

    // Check if student exists
    const student = await User.findById(studentId);
    if (!student || student.role !== "student") {
      return res.status(404).json({ message: "Student not found." });
    }

    const performance = new Performance({
      student: studentId,
      subject,
      score,
      feedback,
      teacher: req.user.id,
    });

    await performance.save();

    // Send notification to student
    await Notification.create({
      recipient: studentId,
      sender: req.user.id,
      type: "performance",
      message: `New grade added for ${subject}: ${score}.`,
    });

    res.status(201).json({ message: "Performance record added successfully", performance });
  } catch (error) {
    res.status(500).json({ message: "Error adding performance record", error: error.message });
  }
});

/**
 * @route GET /api/performance/student/:studentId
 * @desc Get student performance records (Admin & Teacher)
 * @access Admin, Teacher
 */
router.get("/student/:studentId", protect(["teacher", "admin"]), async (req, res) => {
  try {
    const { studentId } = req.params;

    const performanceRecords = await Performance.find({ student: studentId }).sort({ _id: -1 });

    if (!performanceRecords.length) {
      return res.status(404).json({ message: "No performance records found for this student." });
    }

    res.json({ performance: performanceRecords });
  } catch (error) {
    res.status(500).json({ message: "Error fetching performance records", error: error.message });
  }
});

/**
 * @route GET /api/performance/me
 * @desc Get logged-in student's own performance records
 * @access Student
 */
router.get("/me", protect(["student"]), async (req, res) => {
  try {
    const performanceRecords = await Performance.find({ student: req.user.id }).sort({ _id: -1 });

    if (!performanceRecords.length) {
      return res.status(404).json({ message: "No performance records found." });
    }

    res.json({ performance: performanceRecords });
  } catch (error) {
    res.status(500).json({ message: "Error fetching your performance records", error: error.message });
  }
});

/**
 * @route PUT /api/performance/update/:id
 * @desc Update a performance record (Teacher & Admin)
 * @access Teacher, Admin
 */
router.put("/update/:id", protect(["teacher", "admin"]), async (req, res) => {
  try {
    const { score, feedback } = req.body;

    let performance = await Performance.findById(req.params.id);
    if (!performance) {
      return res.status(404).json({ message: "Performance record not found." });
    }

    // Ensure score is a valid number if provided
    if (score !== undefined && isNaN(score)) {
      return res.status(400).json({ message: "Score must be a valid number." });
    }

    const updatedFields = {};
    if (score !== undefined) updatedFields.score = score;
    if (feedback) updatedFields.feedback = feedback;

    if (Object.keys(updatedFields).length === 0) {
      return res.status(400).json({ message: "No updates provided." });
    }

    performance = await Performance.findByIdAndUpdate(req.params.id, updatedFields, { new: true });

    // Send notification to student about grade update
    await Notification.create({
      recipient: performance.student,
      sender: req.user.id,
      type: "performance",
      message: `Your grade for ${performance.subject} has been updated to ${performance.score}.`,
    });

    res.json({ message: "Performance record updated successfully", performance });
  } catch (error) {
    res.status(500).json({ message: "Error updating performance record", error: error.message });
  }
});

/**
 * @route DELETE /api/performance/delete/:id
 * @desc Delete a performance record (Teacher & Admin)
 * @access Teacher, Admin
 */
router.delete("/delete/:id", protect(["teacher", "admin"]), async (req, res) => {
  try {
    const performance = await Performance.findById(req.params.id);

    if (!performance) {
      return res.status(404).json({ message: "Performance record not found." });
    }

    await Performance.deleteOne({ _id: req.params.id });

    res.json({ message: "Performance record deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting performance record", error: error.message });
  }
});

module.exports = router;
