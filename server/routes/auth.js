const express = require('express');
const {
  register,
  login,
  getMe,
  createAdmin,
  logout
} = require('../controllers/authController');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Публичные маршруты
router.post('/register', register);
router.post('/login', login);

// Защищенные маршруты
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);

// Защищенные маршруты (только для администраторов)
router.post('/create-admin', protect, authorize('admin'), createAdmin);

module.exports = router; 