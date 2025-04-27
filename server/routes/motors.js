const express = require('express');
const {
  getMotors,
  getMotor,
  createMotor,
  updateMotor,
  deleteMotor,
  searchMotors
} = require('../controllers/motorController');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Публичные маршруты
router.get('/', getMotors);
router.get('/search', searchMotors);
router.get('/:id', getMotor);

// Защищенные маршруты (только для администраторов)
router.post('/', protect, authorize('admin', 'editor'), createMotor);
router.put('/:id', protect, authorize('admin', 'editor'), updateMotor);
router.delete('/:id', protect, authorize('admin'), deleteMotor);

module.exports = router; 