const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const fileUpload = require('express-fileupload');
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Загрузка переменных окружения
dotenv.config();

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

// Функция для проверки статуса MongoDB
const checkMongoDBStatus = () => {
  return new Promise(async (resolve) => {
    try {
      const isConnected = await connectDB();
      console.log(`MongoDB статус: ${isConnected ? 'Подключено' : 'Отключено'}`);
      resolve(isConnected);
    } catch (error) {
      console.error('Ошибка при проверке статуса MongoDB:', error);
      resolve(false);
    }
  });
};

// Обработка подключения к MongoDB
const startServer = async () => {
  let isConnected = await checkMongoDBStatus();
  
  // Маршруты API с проверкой подключения к БД для каждого запроса
  app.use('/api/motors', async (req, res, next) => {
    if (!isConnected) {
      // Пробуем восстановить соединение при каждом запросе
      isConnected = await checkMongoDBStatus();
    }
    
    if (isConnected) {
      return require('./routes/motors')(req, res, next);
    } else {
      return res.status(503).json({
        success: false,
        error: 'База данных недоступна. Пожалуйста, попробуйте позже.'
      });
    }
  });
  
  app.use('/api/auth', async (req, res, next) => {
    if (!isConnected) {
      // Пробуем восстановить соединение при каждом запросе
      isConnected = await checkMongoDBStatus();
    }
    
    if (isConnected) {
      return require('./routes/auth')(req, res, next);
    } else {
      return res.status(503).json({
        success: false,
        error: 'База данных недоступна. Пожалуйста, попробуйте позже.'
      });
    }
  });
  
  app.use('/api/upload', async (req, res, next) => {
    if (!isConnected) {
      // Пробуем восстановить соединение при каждом запросе
      isConnected = await checkMongoDBStatus();
    }
    
    if (isConnected) {
      return require('./routes/upload')(req, res, next);
    } else {
      return res.status(503).json({
        success: false,
        error: 'База данных недоступна. Пожалуйста, попробуйте позже.'
      });
    }
  });

  // API статуса для проверки соединения с MongoDB
  app.get('/api/status', async (req, res) => {
    // Обновляем статус при запросе
    isConnected = await checkMongoDBStatus();
    
    res.json({ 
      status: 'online',
      databaseStatus: isConnected ? 'connected' : 'disconnected',
      message: isConnected ? 'Сервер работает и подключен к базе данных' : 'Сервер работает, но нет подключения к базе данных'
    });
  });

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
    console.log(`MongoDB статус: ${isConnected ? 'Подключено' : 'Не подключено'}`);
    console.log(`Для подключения к MongoDB необходимо добавить IP-адрес в MongoDB Atlas`);
  });
  
  // Настраиваем периодическую проверку состояния MongoDB
  setInterval(async () => {
    const previousStatus = isConnected;
    isConnected = await checkMongoDBStatus();
    
    // Логируем изменение статуса
    if (previousStatus !== isConnected) {
      if (isConnected) {
        console.log('✅ Подключение к MongoDB восстановлено');
      } else {
        console.log('❌ Потеряно подключение к MongoDB');
      }
    }
  }, 60000); // Проверяем каждую минуту
};

// Запускаем сервер
startServer(); 