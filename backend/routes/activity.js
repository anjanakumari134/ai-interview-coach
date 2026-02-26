const express = require('express');
const { protect } = require('../middleware/auth');
const { getActivityLogs } = require('../controllers/activityController');

const router = express.Router();

// All routes are protected
router.use(protect);

router.get('/', getActivityLogs);

module.exports = router;
