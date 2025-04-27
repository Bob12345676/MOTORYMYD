#!/bin/bash

# Устанавливаем зависимости
npm install
cd server && npm install
cd ../client && npm install

# Устанавливаем и проверяем правильные права
chmod -R 755 ./node_modules/.bin
chmod -R 755 ./node_modules/react-scripts

# Запускаем сборку с CI=false для игнорирования предупреждений
CI=false NODE_OPTIONS=--openssl-legacy-provider npm run build

# Возвращаемся в корневую директорию
cd .. 