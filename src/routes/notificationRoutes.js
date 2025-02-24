const express = require('express');
const protect = require('../middleware/authMiddleware');
const Notification = require('../models/Notification');

const router = express.Router();

// ✅ Send Notification (Admin & Teachers)
router.post('/send', protect(['admin', 'teacher']), async (req, res) => {
  try {
    const { recipientId, type, message } = req.body;

    const notification = new Notification({
      recipient: recipientId,
      sender: req.user.id,
      type,
      message,
    });

    await notification.save();
    res.status(201).json({ message: 'Notification sent successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error sending notification', error: error.message });
  }
});

// ✅ Get Notifications for Logged-in User
router.get('/', protect(['admin', 'teacher', 'student']), async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user.id })
      .sort({ createdAt: -1 });

    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notifications', error: error.message });
  }
});

// ✅ Mark Notification as Read
router.put('/read/:id', protect(['admin', 'teacher', 'student']), async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    notification.isRead = true;
    await notification.save();

    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating notification', error: error.message });
  }
});

// ✅ Delete Notification
router.delete('/delete/:id', protect(['admin', 'teacher', 'student']), async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    await notification.deleteOne();
    res.json({ message: 'Notification deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting notification', error: error.message });
  }
});

module.exports = router;
