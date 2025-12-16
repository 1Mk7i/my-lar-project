import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

// Додаємо інтерцептор, щоб кожен запит мав актуальний токен
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken'); // Перевірте назву ключа!
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;