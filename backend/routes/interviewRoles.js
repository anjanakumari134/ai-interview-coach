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
router.get('/', protect, getInterviewRoles);
router.post('/', protect, createInterviewRole);
router.put('/:id', protect, updateInterviewRole);
router.delete('/:id', protect, deleteInterviewRole);
router.post('/generate-questions', protect, generateAIQuestions);
router.post('/evaluate-answer', protect, evaluateAnswer);

module.exports = router;
