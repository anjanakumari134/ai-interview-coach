const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true
  },
  userAnswer: {
    type: String,
    required: true
  },
  score: {
    type: Number,
    min: 0,
    max: 100,
    required: true
  },
  feedback: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['Technical', 'Behavioral', 'System Design', 'DSA', 'General'],
    required: true
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium'
  }
});

const interviewSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  role: {
    type: String,
    required: true,
    enum: ['Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'DevOps Engineer', 'Data Scientist', 'Product Manager', 'UI/UX Designer', 'Software Engineer']
  },
  questions: [questionSchema],
  totalScore: {
    type: Number,
    min: 0,
    max: 100,
    required: true
  },
  category: {
    type: String,
    enum: ['Technical', 'Behavioral', 'System Design', 'DSA', 'Mixed'],
    required: true
  },
  status: {
    type: String,
    enum: ['in-progress', 'completed', 'abandoned'],
    default: 'in-progress'
  },
  duration: {
    type: Number, // in minutes
    required: true
  },
  aiInsights: {
    strengths: [String],
    weaknesses: [String],
    recommendations: [String],
    overallFeedback: String
  },
  tags: [{
    type: String
  }]
}, {
  timestamps: true
});

// Calculate total score before saving
interviewSessionSchema.pre('save', function(next) {
  if (this.questions.length > 0) {
    const totalScore = this.questions.reduce((sum, question) => sum + question.score, 0);
    this.totalScore = Math.round(totalScore / this.questions.length);
  }
  next();
});

// Index for better query performance
interviewSessionSchema.index({ userId: 1, createdAt: -1 });
interviewSessionSchema.index({ role: 1 });
interviewSessionSchema.index({ category: 1 });
interviewSessionSchema.index({ totalScore: -1 });

module.exports = mongoose.model('InterviewSession', interviewSessionSchema);
