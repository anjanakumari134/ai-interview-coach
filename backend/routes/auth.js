const express = require('express');
const { protect } = require('../middleware/auth');
const {
  registerUser,
  loginUser,
  getMe,
  validateRegister,
  validateLogin
} = require('../controllers/authController');

const router = express.Router();

// Public routes
router.post('/register', validateRegister, registerUser);
router.post('/login', validateLogin, loginUser);

// Protected routes
router.get('/me', protect, getMe);

module.exports = router;
