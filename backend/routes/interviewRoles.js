const express = require('express');
const router = express.Router();
const {
  getInterviewRoles,
  createInterviewRole,
  updateInterviewRole,
  deleteInterviewRole,
  generateAIQuestions,
  evaluateAnswer
} = require('../controllers/interviewRoleController');
const { protect } = require('../middleware/auth');

// Get all interview roles
router.get('/', protect, getInterviewRoles);

// Create new interview role
router.post('/', protect, createInterviewRole);

// Update interview role
router.put('/:id', protect, updateInterviewRole);

// Delete interview role
router.delete('/:id', protect, deleteInterviewRole);

// Generate AI questions
router.post('/generate-questions', protect, generateAIQuestions);

// Evaluate answer
router.post('/evaluate-answer', protect, evaluateAnswer);

module.exports = router;
