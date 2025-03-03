const mongoose = require('mongoose');

const performanceSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  score: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  feedback: {
    type: String, // Optional feedback
  },
  gradedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // If a teacher graded, store their ID
    default: null, // Admins may add records without grading
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Admin or Teacher who added the record
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Performance = mongoose.model('Performance', performanceSchema);
module.exports = Performance;
