const asyncHandler = require('express-async-handler');
const Motor = require('../models/Motor');

// @desc    Получить все двигатели
// @route   GET /api/motors
// @access  Public
exports.getMotors = asyncHandler(async (req, res) => {
  // Создаем объект запроса
  const query = {};
  
  // Фильтрация по наличию
  if (req.query.available) {
    query.available = req.query.available === 'true';
  }
  
  // Фильтрация по диапазону мощности
  if (req.query.minPower && req.query.maxPower) {
    query.power = {
      $gte: parseInt(req.query.minPower),
      $lte: parseInt(req.query.maxPower)
    };
  } else if (req.query.minPower) {
    query.power = { $gte: parseInt(req.query.minPower) };
  } else if (req.query.maxPower) {
    query.power = { $lte: parseInt(req.query.maxPower) };
  }
  
  // Поиск по названию или модели
  if (req.query.search) {
    query.$or = [
      { name: { $regex: req.query.search, $options: 'i' } },
      { model: { $regex: req.query.search, $options: 'i' } }
    ];
  }
  
  // Пагинация
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  
  const motors = await Motor.find(query)
    .skip(startIndex)
    .limit(limit);
  
  const total = await Motor.countDocuments(query);
  
  res.status(200).json({
    success: true,
    count: motors.length,
    total,
    pagination: {
      pages: Math.ceil(total / limit),
      page,
      limit
    },
    data: motors
  });
});

// @desc    Получить один двигатель по ID
// @route   GET /api/motors/:id
// @access  Public
exports.getMotor = asyncHandler(async (req, res) => {
  const motor = await Motor.findById(req.params.id);
  
  if (!motor) {
    res.status(404);
    throw new Error('Двигатель не найден');
  }
  
  res.status(200).json({
    success: true,
    data: motor
  });
});

// @desc    Создать новый двигатель
// @route   POST /api/motors
// @access  Private/Admin
exports.createMotor = asyncHandler(async (req, res) => {
  const motor = await Motor.create(req.body);
  
  res.status(201).json({
    success: true,
    data: motor
  });
});

// @desc    Обновить двигатель
// @route   PUT /api/motors/:id
// @access  Private/Admin
exports.updateMotor = asyncHandler(async (req, res) => {
  let motor = await Motor.findById(req.params.id);
  
  if (!motor) {
    res.status(404);
    throw new Error('Двигатель не найден');
  }
  
  motor = await Motor.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  
  res.status(200).json({
    success: true,
    data: motor
  });
});

// @desc    Удалить двигатель
// @route   DELETE /api/motors/:id
// @access  Private/Admin
exports.deleteMotor = asyncHandler(async (req, res) => {
  const motor = await Motor.findById(req.params.id);
  
  if (!motor) {
    res.status(404);
    throw new Error('Двигатель не найден');
  }
  
  await motor.remove();
  
  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Поиск двигателей
// @route   GET /api/motors/search
// @access  Public
exports.searchMotors = asyncHandler(async (req, res) => {
  const keyword = req.query.keyword;
  
  if (!keyword) {
    res.status(400);
    throw new Error('Пожалуйста, укажите поисковый запрос');
  }
  
  const motors = await Motor.find({
    $or: [
      { name: { $regex: keyword, $options: 'i' } },
      { model: { $regex: keyword, $options: 'i' } },
      { description: { $regex: keyword, $options: 'i' } }
    ]
  });
  
  res.status(200).json({
    success: true,
    count: motors.length,
    data: motors
  });
}); 