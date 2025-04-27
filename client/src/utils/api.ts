import axios from 'axios';
import { toast } from 'react-toastify';

// Создаем экземпляр axios с базовым URL
const api = axios.create({
  baseURL: '/',
});

// Добавляем интерцептор для запросов - добавляет токен к запросам
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Добавляем интерцептор для ответов - обрабатывает ошибки
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Если токен недействителен или истек
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
      toast.error('Сессия истекла. Пожалуйста, войдите снова.');
    }
    return Promise.reject(error);
  }
);

export default api; 