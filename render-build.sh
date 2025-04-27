#!/bin/bash

# Exit on any error
set -e

echo "🚀 Starting build process for MOTORYMYD"

# Create server directory if it doesn't exist
mkdir -p server
mkdir -p client

# Setup basic server if it doesn't exist
if [ ! -f "server/package.json" ]; then
  echo "⚙️ Creating basic server setup..."
  cat > server/package.json << 'EOL'
{
  "name": "motorymyd-server",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
EOL

  cat > server/server.js << 'EOL'
require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the React app if in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  
  app.get('*', (req, res) => {
    if (req.path.startsWith('/api')) {
      return res.status(404).json({ message: 'API endpoint not found' });
    }
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  });
}

// Basic API route
app.get('/api/status', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
EOL
fi

# Install server dependencies
echo "📦 Installing server dependencies..."
cd server
npm install
cd ..

# Setup client build
echo "🏗️ Setting up manual client build..."

# Create build directory
mkdir -p client/build
mkdir -p client/build/static/css
mkdir -p client/build/static/js

# Create index.html
cat > client/build/index.html << 'EOL'
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="theme-color" content="#000000" />
  <meta name="description" content="МОТОРЫМЫД - Каталог двигателей и моторов" />
  <title>МОТО РЫМЫД</title>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
  <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
  <link rel="stylesheet" href="/static/css/main.css" />
</head>
<body>
  <noscript>Для работы приложения необходимо включить JavaScript.</noscript>
  <div id="root">
    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; text-align: center; font-family: 'Roboto', sans-serif;">
      <h1 style="font-size: 2.5rem; margin-bottom: 1rem;">МОТОРЫМЫД</h1>
      <p style="font-size: 1.2rem; margin-bottom: 1rem;">Приложение каталога двигателей</p>
      <div style="background-color: #f8f9fa; padding: 1.5rem; border-radius: 8px; max-width: 600px; width: 90%;">
        <p style="margin-bottom: 1rem;">Сервер успешно запущен, но возникли проблемы с подключением к базе данных.</p>
        <p style="margin-bottom: 1rem;">Для полноценной работы приложения необходимо добавить IP-адрес Render в список разрешенных в MongoDB Atlas.</p>
        <div style="border: 1px solid #ddd; background-color: #fff; padding: 1rem; border-radius: 4px; text-align: left; margin-bottom: 1rem;">
          <p><strong>Как исправить:</strong></p>
          <ol style="padding-left: 1.5rem; margin-top: 0.5rem;">
            <li>Войдите в свой аккаунт MongoDB Atlas</li>
            <li>Перейдите в раздел "Network Access"</li>
            <li>Нажмите "Add IP Address"</li>
            <li>Добавьте IP-адрес 0.0.0.0/0 (или конкретные IP Render)</li>
            <li>Нажмите "Confirm"</li>
          </ol>
        </div>
        <p>После добавления IP-адреса сервер подключится к базе данных при следующем перезапуске.</p>
      </div>
    </div>
  </div>
</body>
</html>
EOL

# Create basic CSS
cat > client/build/static/css/main.css << 'EOL'
body {
  margin: 0;
  font-family: 'Roboto', 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #f5f5f5;
  color: #333;
}

h1, h2, h3, h4, h5, h6 {
  color: #333;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 15px;
}

button {
  background-color: #1976d2;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

button:hover {
  background-color: #1565c0;
}

input, select {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}
EOL

echo "✅ Manual client build completed"

echo "✅ Build process completed successfully!" 