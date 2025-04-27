const asyncHandler = require('express-async-handler');
const User = require('../models/User');

// @desc    Регистрация пользователя
// @route   POST /api/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  
  // Проверяем, существует ли пользователь с таким email
  const userExists = await User.findOne({ email });
  
  if (userExists) {
    res.status(400);
    throw new Error('Пользователь с таким email уже существует');
  }
  
  // Создаем пользователя
  const user = await User.create({
    username,
    email,
    password,
    role: 'user' // По умолчанию обычный пользователь
  });
  
  if (user) {
    // Генерируем JWT токен
    const token = user.getSignedJwtToken();
    
    res.status(201).json({
      success: true,
      token,
      data: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } else {
    res.status(400);
    throw new Error('Некорректные данные пользователя');
  }
});

// @desc    Аутентификация пользователя
// @route   POST /api/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  
  // Проверяем, указаны ли email и пароль
  if (!email || !password) {
    res.status(400);
    throw new Error('Пожалуйста, укажите email и пароль');
  }
  
  // Ищем пользователя по email
  const user = await User.findOne({ email }).select('+password');
  
  if (!user) {
    res.status(401);
    throw new Error('Неверные учетные данные');
  }
  
  // Проверяем пароль
  const isMatch = await user.matchPassword(password);
  
  if (!isMatch) {
    res.status(401);
    throw new Error('Неверные учетные данные');
  }
  
  // Генерируем JWT токен
  const token = user.getSignedJwtToken();
  
  res.status(200).json({
    success: true,
    token,
    data: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role
    }
  });
});

// @desc    Получить данные текущего пользователя
// @route   GET /api/auth/me
// @access  Private
exports.getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  
  res.status(200).json({
    success: true,
    data: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt
    }
  });
});

// @desc    Создать пользователя с правами администратора
// @route   POST /api/auth/create-admin
// @access  Private/Admin
exports.createAdmin = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  
  // Проверяем, существует ли пользователь с таким email
  const userExists = await User.findOne({ email });
  
  if (userExists) {
    res.status(400);
    throw new Error('Пользователь с таким email уже существует');
  }
  
  // Создаем пользователя с правами администратора
  const user = await User.create({
    username,
    email,
    password,
    role: 'admin'
  });
  
  if (user) {
    res.status(201).json({
      success: true,
      data: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } else {
    res.status(400);
    throw new Error('Некорректные данные пользователя');
  }
});

// @desc    Выход из системы (очистка куки)
// @route   POST /api/auth/logout
// @access  Private
exports.logout = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    data: {}
  });
}); 