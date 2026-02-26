const express = require('express');
const { protect } = require('../middleware/auth');
const {
  getInterviews,
  getInterview,
  createInterview,
  updateInterview,
  deleteInterview,
  validateInterview,
  validateInterviewUpdate
} = require('../controllers/interviewController');

const router = express.Router();

// All routes are protected
router.use(protect);

// Routes
router.route('/')
  .get(getInterviews)
  .post(validateInterview, createInterview);

router.route('/:id')
  .get(getInterview)
  .put(validateInterviewUpdate, updateInterview)
  .delete(deleteInterview);

module.exports = router;
