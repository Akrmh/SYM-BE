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
    type: String, // Teacher's feedback
  },
  gradedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Teacher who graded
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Performance = mongoose.model('Performance', performanceSchema);
module.exports = Performance;
