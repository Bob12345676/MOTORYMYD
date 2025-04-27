const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Motor = require('../models/Motor');
const User = require('../models/User');

// Загрузка переменных окружения
dotenv.config();

// Подключение к базе данных
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Тестовые данные для двигателей
const motors = [
  {
    name: 'Motor 775',
    model: '775-12V-288W',
    description: 'Мощный двигатель постоянного тока 775 с высоким крутящим моментом. Идеально подходит для роботов, электроинструментов и других проектов, требующих высокой мощности.',
    power: 288,
    voltage: 12,
    current: 20,
    speed: 12000,
    weight: 0.35,
    dimensions: {
      length: 70,
      width: 42,
      height: 42
    },
    images: [
      'https://via.placeholder.com/600x400?text=Motor+775+Image+1',
      'https://via.placeholder.com/600x400?text=Motor+775+Image+2'
    ],
    features: [
      'Высокая мощность',
      'Низкий уровень шума',
      'Длительный срок службы',
      'Двойные шарикоподшипники'
    ],
    applications: [
      'Роботы',
      'Электроинструменты',
      'Модели RC',
      'Проекты DIY'
    ],
    price: 1200,
    available: true
  },
  {
    name: 'Motor 555',
    model: '555-12V-150W',
    description: 'Компактный двигатель постоянного тока средней мощности. Отлично подходит для небольших проектов и устройств.',
    power: 150,
    voltage: 12,
    current: 12.5,
    speed: 15000,
    weight: 0.28,
    dimensions: {
      length: 60,
      width: 36,
      height: 36
    },
    images: [
      'https://via.placeholder.com/600x400?text=Motor+555+Image+1',
      'https://via.placeholder.com/600x400?text=Motor+555+Image+2'
    ],
    features: [
      'Средняя мощность',
      'Компактный размер',
      'Низкое энергопотребление'
    ],
    applications: [
      'Бытовые приборы',
      'Небольшие электроинструменты',
      'Модели RC'
    ],
    price: 900,
    available: true
  },
  {
    name: 'Motor 895',
    model: '895-24V-350W',
    description: 'Высокомощный двигатель постоянного тока для профессиональных приложений. Обеспечивает высокий крутящий момент и надежную работу в тяжелых условиях.',
    power: 350,
    voltage: 24,
    current: 14.6,
    speed: 10000,
    weight: 0.48,
    dimensions: {
      length: 90,
      width: 50,
      height: 50
    },
    images: [
      'https://via.placeholder.com/600x400?text=Motor+895+Image+1',
      'https://via.placeholder.com/600x400?text=Motor+895+Image+2'
    ],
    features: [
      'Сверхвысокая мощность',
      'Усиленная конструкция',
      'Промышленное качество',
      'Охлаждающий вентилятор'
    ],
    applications: [
      'Промышленное оборудование',
      'Электротранспорт',
      'Профессиональные инструменты'
    ],
    price: 1800,
    available: true
  }
];

// Тестовые данные для пользователей
const users = [
  {
    username: 'admin',
    email: 'admin@example.com',
    password: 'admin12345',
    role: 'admin'
  },
  {
    username: 'editor',
    email: 'editor@example.com',
    password: 'editor12345',
    role: 'editor'
  },
  {
    username: 'user',
    email: 'user@example.com',
    password: 'user12345',
    role: 'user'
  }
];

// Функция для импорта данных
const importData = async () => {
  try {
    // Очистка базы данных
    await Motor.deleteMany();
    await User.deleteMany();
    
    // Импорт двигателей
    await Motor.insertMany(motors);
    
    // Импорт пользователей
    await User.create(users);
    
    console.log('Данные успешно импортированы');
    process.exit();
  } catch (error) {
    console.error(`Ошибка: ${error.message}`);
    process.exit(1);
  }
};

// Запуск импорта
importData(); 