const mongoose = require('mongoose');

const MotorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Пожалуйста, укажите название двигателя'],
    trim: true,
    maxlength: [100, 'Название не может быть длиннее 100 символов']
  },
  model: {
    type: String,
    required: [true, 'Пожалуйста, укажите модель двигателя'],
    trim: true,
    maxlength: [100, 'Модель не может быть длиннее 100 символов']
  },
  description: {
    type: String,
    required: [true, 'Пожалуйста, добавьте описание двигателя'],
    trim: true
  },
  power: {
    type: Number,
    required: [true, 'Пожалуйста, укажите мощность двигателя']
  },
  voltage: {
    type: Number,
    required: [true, 'Пожалуйста, укажите напряжение двигателя']
  },
  current: {
    type: Number,
    required: [true, 'Пожалуйста, укажите силу тока двигателя']
  },
  speed: {
    type: Number,
    required: [true, 'Пожалуйста, укажите скорость вращения двигателя']
  },
  weight: {
    type: Number,
    required: [true, 'Пожалуйста, укажите вес двигателя']
  },
  dimensions: {
    length: {
      type: Number,
      required: [true, 'Пожалуйста, укажите длину двигателя']
    },
    width: {
      type: Number,
      required: [true, 'Пожалуйста, укажите ширину двигателя']
    },
    height: {
      type: Number,
      required: [true, 'Пожалуйста, укажите высоту двигателя']
    }
  },
  images: [
    {
      type: String,
      required: [true, 'Пожалуйста, добавьте хотя бы одно изображение']
    }
  ],
  features: [String],
  applications: [String],
  price: {
    type: Number,
    default: 0
  },
  available: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Обновляем поле updatedAt перед сохранением
MotorSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Motor', MotorSchema); 