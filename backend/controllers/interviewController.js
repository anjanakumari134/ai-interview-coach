const { body, validationResult } = require('express-validator');
const InterviewSession = require('../models/InterviewSession');
const ActivityLog = require('../models/ActivityLog');

// @desc    Get all interview sessions for a user
// @route   GET /api/interviews
// @access  Private
const getInterviews = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build query
    const query = { userId: req.user.id };

    // Filter by role
    if (req.query.role) {
      query.role = req.query.role;
    }

    // Filter by category
    if (req.query.category) {
      query.category = req.query.category;
    }

    // Filter by status
    if (req.query.status) {
      query.status = req.query.status;
    }

    // Search by role or tags
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      query.$or = [
        { role: searchRegex },
        { tags: { $in: [searchRegex] } }
      ];
    }

    // Sort options
    let sort = {};
    if (req.query.sortBy) {
      const sortField = req.query.sortBy;
      const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;
      sort[sortField] = sortOrder;
    } else {
      sort = { createdAt: -1 }; // Default sort by newest first
    }

    const interviews = await InterviewSession.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate('userId', 'name email');

    const total = await InterviewSession.countDocuments(query);

    res.json({
      success: true,
      data: interviews,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single interview session
// @route   GET /api/interviews/:id
// @access  Private
const getInterview = async (req, res, next) => {
  try {
    const interview = await InterviewSession.findById(req.params.id)
      .populate('userId', 'name email');

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview session not found'
      });
    }

    // Check if user owns the interview
    if (interview.userId._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this interview'
      });
    }

    res.json({
      success: true,
      data: interview
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new interview session
// @route   POST /api/interviews
// @access  Private
const createInterview = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { role, category, questions, duration, tags } = req.body;

    const interview = await InterviewSession.create({
      userId: req.user.id,
      role,
      category,
      questions: questions || [],
      duration,
      tags: tags || [],
      totalScore: 0 // Will be calculated by pre-save hook
    });

    // Log activity
    await ActivityLog.create({
      userId: req.user.id,
      sessionId: interview._id,
      action: 'created',
      details: { role, category }
    });

    res.status(201).json({
      success: true,
      data: interview
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update interview session
// @route   PUT /api/interviews/:id
// @access  Private
const updateInterview = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    let interview = await InterviewSession.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview session not found'
      });
    }

    // Check if user owns the interview
    if (interview.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this interview'
      });
    }

    const { questions, status, tags } = req.body;

    // Update fields
    if (questions) interview.questions = questions;
    if (status) interview.status = status;
    if (tags) interview.tags = tags;

    // Generate AI insights if interview is completed
    if (status === 'completed' && questions && questions.length > 0) {
      interview.aiInsights = generateAIInsights(questions);
    }

    interview = await interview.save();

    // Log activity
    await ActivityLog.create({
      userId: req.user.id,
      sessionId: interview._id,
      action: 'updated',
      details: { status, questionsCount: questions?.length }
    });

    res.json({
      success: true,
      data: interview
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete interview session
// @route   DELETE /api/interviews/:id
// @access  Private
const deleteInterview = async (req, res, next) => {
  try {
    const interview = await InterviewSession.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview session not found'
      });
    }

    // Check if user owns the interview
    if (interview.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this interview'
      });
    }

    await interview.deleteOne();

    // Log activity
    await ActivityLog.create({
      userId: req.user.id,
      sessionId: interview._id,
      action: 'deleted',
      details: { role: interview.role, category: interview.category }
    });

    res.json({
      success: true,
      message: 'Interview session deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Helper function to generate AI insights (mocked)
const generateAIInsights = (questions) => {
  const categories = {};
  let totalScore = 0;
  let strengths = [];
  let weaknesses = [];

  questions.forEach(q => {
    totalScore += q.score;
    if (!categories[q.category]) {
      categories[q.category] = [];
    }
    categories[q.category].push(q.score);
  });

  // Analyze performance by category
  Object.keys(categories).forEach(category => {
    const avgScore = categories[category].reduce((a, b) => a + b, 0) / categories[category].length;
    if (avgScore >= 80) {
      strengths.push(`Strong performance in ${category}`);
    } else if (avgScore < 60) {
      weaknesses.push(`Needs improvement in ${category}`);
    }
  });

  const overallAvg = totalScore / questions.length;

  return {
    strengths,
    weaknesses,
    recommendations: [
      overallAvg >= 70 ? 'Continue practicing to maintain your performance' : 'Focus on weak areas and practice more questions',
      'Review feedback for each question to understand areas of improvement',
      'Consider practicing with a timer to improve time management'
    ],
    overallFeedback: overallAvg >= 80 
      ? 'Excellent performance! You demonstrate strong interview skills.' 
      : overallAvg >= 60 
      ? 'Good performance with room for improvement.'
      : 'Keep practicing! Focus on understanding core concepts.'
  };
};

// Validation rules
const validateInterview = [
  body('role')
    .isIn(['Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'DevOps Engineer', 'Data Scientist', 'Product Manager', 'UI/UX Designer', 'Software Engineer'])
    .withMessage('Invalid role'),
  
  body('category')
    .isIn(['Technical', 'Behavioral', 'System Design', 'DSA', 'Mixed'])
    .withMessage('Invalid category'),
  
  body('duration')
    .isInt({ min: 15, max: 180 })
    .withMessage('Duration must be between 15 and 180 minutes')
];

const validateInterviewUpdate = [
  body('questions.*.questionText')
    .optional()
    .notEmpty()
    .withMessage('Question text is required'),
  
  body('questions.*.userAnswer')
    .optional()
    .notEmpty()
    .withMessage('User answer is required'),
  
  body('questions.*.score')
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage('Score must be between 0 and 100'),
  
  body('questions.*.feedback')
    .optional()
    .notEmpty()
    .withMessage('Feedback is required'),
  
  body('status')
    .optional()
    .isIn(['in-progress', 'completed', 'abandoned'])
    .withMessage('Invalid status')
];

module.exports = {
  getInterviews,
  getInterview,
  createInterview,
  updateInterview,
  deleteInterview,
  validateInterview,
  validateInterviewUpdate
};
