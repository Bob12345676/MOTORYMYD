const express = require('express');
const {
  uploadImage,
  deleteImage
} = require('../controllers/uploadController');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Защищенные маршруты (только для администраторов и редакторов)
router.post('/', protect, authorize('admin', 'editor'), uploadImage);
router.delete('/:fileName', protect, authorize('admin', 'editor'), deleteImage);

module.exports = router; 