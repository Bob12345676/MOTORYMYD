const asyncHandler = require('express-async-handler');
const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');

// Настройка AWS
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

const s3 = new AWS.S3();

// @desc    Загрузить изображение
// @route   POST /api/upload
// @access  Private/Admin
exports.uploadImage = asyncHandler(async (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    res.status(400);
    throw new Error('Файл не загружен');
  }

  const file = req.files.file;

  // Проверка типа файла
  if (!file.mimetype.startsWith('image')) {
    res.status(400);
    throw new Error('Пожалуйста, загрузите изображение');
  }

  // Проверка размера файла (максимум 5MB)
  if (file.size > 5 * 1024 * 1024) {
    res.status(400);
    throw new Error('Размер изображения не должен превышать 5MB');
  }

  // Генерируем уникальное имя файла
  const fileName = `${uuidv4()}${path.extname(file.name)}`;

  // Параметры для загрузки в S3
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `motors/${fileName}`,
    Body: file.data,
    ContentType: file.mimetype,
    ACL: 'public-read'
  };

  // Загрузка файла в S3
  s3.upload(params, (err, data) => {
    if (err) {
      console.error(err);
      res.status(500);
      throw new Error('Ошибка при загрузке файла');
    }

    res.status(200).json({
      success: true,
      url: data.Location
    });
  });
});

// @desc    Удалить изображение
// @route   DELETE /api/upload/:fileName
// @access  Private/Admin
exports.deleteImage = asyncHandler(async (req, res) => {
  const fileName = req.params.fileName;

  // Параметры для удаления из S3
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `motors/${fileName}`
  };

  // Удаление файла из S3
  s3.deleteObject(params, (err, data) => {
    if (err) {
      console.error(err);
      res.status(500);
      throw new Error('Ошибка при удалении файла');
    }

    res.status(200).json({
      success: true,
      data: {}
    });
  });
}); 