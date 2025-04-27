const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const fileUpload = require('express-fileupload');
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Загрузка переменных окружения
dotenv.config();

// Подключение к базе данных
connectDB();

// Инициализация Express
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));

// Логирование в режиме разработки
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Middleware для загрузки файлов
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: '/tmp/'
}));

// Маршруты API
app.use('/api/motors', require('./routes/motors'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/upload', require('./routes/upload'));

// Обработка статических ресурсов в продакшне
if (process.env.NODE_ENV === 'production') {
  // Статические файлы
  app.use(express.static(path.join(__dirname, '../client/build')));

  // Все запросы, кроме API, перенаправляем на React
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client', 'build', 'index.html'));
  });
} else {
  // Обработка главной страницы в режиме разработки
  app.get('/', (req, res) => {
    res.send('API запущено...');
  });
}

// Обработка ошибок
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: err.message || 'Ошибка сервера'
  });
});

// Запуск сервера
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Сервер запущен в ${process.env.NODE_ENV} режиме на порту ${PORT}`);
}); 