const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Motor = require('../models/Motor');
const User = require('../models/User');

// Загружаем переменные окружения
dotenv.config();

// Подключаемся к MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Данные для заполнения
const motors = [
  {
    name: 'Асинхронный двигатель АИР',
    model: 'АИР100S4',
    description: 'Энергоэффективный асинхронный двигатель для промышленного применения. Подходит для постоянных нагрузок и длительной работы.',
    power: 3.0,
    voltage: 380,
    current: 6.5,
    speed: 1500,
    weight: 28,
    dimensions: {
      length: 340,
      width: 226,
      height: 235
    },
    images: ['https://example.com/motors/air100s4.jpg'],
    features: ['Высокий КПД', 'Низкий уровень шума', 'Защита IP55'],
    applications: ['Насосы', 'Вентиляторы', 'Конвейеры'],
    price: 12500,
    available: true
  },
  {
    name: 'Двигатель постоянного тока',
    model: 'ДПТ-125',
    description: 'Мощный двигатель постоянного тока с высоким моментом для применения в системах, требующих плавной регулировки скорости.',
    power: 5.5,
    voltage: 220,
    current: 28,
    speed: 3000,
    weight: 45,
    dimensions: {
      length: 420,
      width: 280,
      height: 310
    },
    images: ['https://example.com/motors/dpt125.jpg'],
    features: ['Высокий пусковой момент', 'Широкий диапазон регулирования', 'Компактность'],
    applications: ['Станки', 'Подъемные механизмы', 'Транспортные системы'],
    price: 24800,
    available: true
  },
  {
    name: 'Шаговый двигатель',
    model: 'NEMA 23',
    description: 'Прецизионный шаговый двигатель для систем автоматизации и ЧПУ с высокой точностью позиционирования.',
    power: 0.5,
    voltage: 48,
    current: 2.8,
    speed: 600,
    weight: 0.7,
    dimensions: {
      length: 56,
      width: 56,
      height: 78
    },
    images: ['https://example.com/motors/nema23.jpg'],
    features: ['Высокая точность', 'Угол шага 1.8°', 'Низкое энергопотребление'],
    applications: ['3D принтеры', 'ЧПУ станки', 'Робототехника'],
    price: 3800,
    available: true
  },
  {
    name: 'Сервопривод',
    model: 'SERVO-180',
    description: 'Высокоточный сервопривод с обратной связью для автоматизации производства и робототехники.',
    power: 2.2,
    voltage: 220,
    current: 10,
    speed: 4500,
    weight: 12,
    dimensions: {
      length: 240,
      width: 150,
      height: 180
    },
    images: ['https://example.com/motors/servo180.jpg'],
    features: ['Обратная связь', 'Высокая динамика', 'Точное позиционирование'],
    applications: ['Промышленные роботы', 'Упаковочное оборудование', 'Прецизионная механика'],
    price: 32500,
    available: true
  },
  {
    name: 'Бесщеточный двигатель',
    model: 'BLDC-2000',
    description: 'Современный бесщеточный двигатель с электронным управлением для высоконагруженных применений.',
    power: 1.5,
    voltage: 48,
    current: 35,
    speed: 2000,
    weight: 8.5,
    dimensions: {
      length: 180,
      width: 120,
      height: 120
    },
    images: ['https://example.com/motors/bldc2000.jpg'],
    features: ['Высокая эффективность', 'Длительный срок службы', 'Компактность'],
    applications: ['Электротранспорт', 'Дроны', 'Промышленная автоматика'],
    price: 18900,
    available: true
  }
];

const users = [
  {
    username: 'admin',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin'
  },
  {
    username: 'user',
    email: 'user@example.com',
    password: 'user123',
    role: 'user'
  }
];

// Функция для импорта данных
const importData = async () => {
  try {
    // Очищаем текущие данные
    await Motor.deleteMany();
    await User.deleteMany();
    
    // Импортируем новые данные
    await Motor.insertMany(motors);
    await User.create(users);
    
    console.log('Данные успешно импортированы');
    process.exit();
  } catch (error) {
    console.error(`Ошибка: ${error.message}`);
    process.exit(1);
  }
};

// Функция для удаления всех данных
const deleteData = async () => {
  try {
    await Motor.deleteMany();
    await User.deleteMany();
    
    console.log('Данные успешно удалены');
    process.exit();
  } catch (error) {
    console.error(`Ошибка: ${error.message}`);
    process.exit(1);
  }
};

// Проверяем аргументы командной строки
if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
} else {
  console.log('Пожалуйста, укажите флаг: -i (импорт) или -d (удаление)');
  process.exit();
} 