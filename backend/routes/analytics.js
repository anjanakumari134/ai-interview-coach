const express = require('express');
const { protect } = require('../middleware/auth');
const { getUserAnalytics } = require('../controllers/analyticsController');

const router = express.Router();

// All routes are protected
router.use(protect);

router.get('/', getUserAnalytics);

module.exports = router;
