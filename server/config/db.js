const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000
    });

    console.log(`MongoDB подключена: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error(`Ошибка подключения к MongoDB: ${error.message}`);
    console.log('Сервер продолжит работу без подключения к базе данных');
    return false;
  }
};

module.exports = connectDB; 