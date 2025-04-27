# Архитектура приложения

## Обзор

Приложение построено по принципу клиент-серверной архитектуры:

- **Клиент**: React с TypeScript, отвечает за пользовательский интерфейс
- **Сервер**: Node.js + Express, обрабатывает API запросы
- **База данных**: MongoDB, хранит данные о двигателях
- **Хранилище**: AWS S3, хранит изображения двигателей

## Схема базы данных

### Коллекция "motors"

```json
{
  "_id": "ObjectId",
  "name": "String",           // Название двигателя
  "model": "String",          // Модель двигателя
  "description": "String",    // Описание двигателя
  "power": "Number",          // Мощность (Вт)
  "voltage": "Number",        // Напряжение (В)
  "current": "Number",        // Сила тока (А)
  "speed": "Number",          // Скорость вращения (об/мин)
  "weight": "Number",         // Вес (кг)
  "dimensions": {             // Размеры (мм)
    "length": "Number",
    "width": "Number",
    "height": "Number"
  },
  "images": ["String"],       // URL изображений в AWS S3
  "features": ["String"],     // Особенности двигателя
  "applications": ["String"], // Применение двигателя
  "price": "Number",          // Цена (опционально)
  "available": "Boolean",     // Наличие
  "createdAt": "Date",        // Дата создания записи
  "updatedAt": "Date"         // Дата обновления записи
}
```

### Коллекция "users" (для административной панели)

```json
{
  "_id": "ObjectId",
  "username": "String",      // Имя пользователя
  "email": "String",         // Email пользователя
  "password": "String",      // Хэшированный пароль
  "role": "String",          // Роль (admin, editor)
  "createdAt": "Date",       // Дата создания
  "updatedAt": "Date"        // Дата обновления
}
```

## API Эндпоинты

### Публичные API

- `GET /api/motors` - Получение списка всех двигателей
- `GET /api/motors/:id` - Получение информации о конкретном двигателе
- `GET /api/motors/search` - Поиск двигателей по параметрам

### Защищенные API (требуют авторизации)

- `POST /api/motors` - Создание нового двигателя
- `PUT /api/motors/:id` - Обновление информации о двигателе
- `DELETE /api/motors/:id` - Удаление двигателя
- `POST /api/upload` - Загрузка изображений

### API Аутентификации

- `POST /api/auth/register` - Регистрация нового пользователя
- `POST /api/auth/login` - Авторизация пользователя
- `GET /api/auth/me` - Получение информации о текущем пользователе
- `POST /api/auth/logout` - Выход из системы 