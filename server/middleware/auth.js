const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

// Middleware для защиты маршрутов
exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  // Проверяем наличие токена в заголовке Authorization
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Получаем токен из заголовка
    token = req.headers.authorization.split(' ')[1];
  }

  // Проверяем, что токен существует
  if (!token) {
    res.status(401);
    throw new Error('Нет доступа, требуется аутентификация');
  }

  try {
    // Верифицируем токен
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Получаем пользователя по ID из токена
    req.user = await User.findById(decoded.id);

    next();
  } catch (error) {
    res.status(401);
    throw new Error('Нет доступа, требуется аутентификация');
  }
});

// Middleware для проверки прав доступа
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      res.status(401);
      throw new Error('Нет доступа, требуется аутентификация');
    }
    
    if (!roles.includes(req.user.role)) {
      res.status(403);
      throw new Error(`У роли ${req.user.role} нет доступа к этому ресурсу`);
    }
    
    next();
  };
}; 