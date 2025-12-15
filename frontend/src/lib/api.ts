import axios from "axios";

// 1. Визначаємо, чи код виконується на сервері
const isServer = typeof window === 'undefined';

// 2. Обираємо URL на основі середовища
const BASE_URL = isServer
  // Якщо на сервері (SSR), використовуємо внутрішній URL Docker Compose
  ? process.env.NEXT_PUBLIC_API_URL
  // Якщо в браузері (CSR), використовуємо URL, доступний з хоста
  : process.env.NEXT_PUBLIC_HOST_API_URL;

const api = axios.create({
  // 3. Додаємо суфікс '/api' до обраного URL
  baseURL: `${BASE_URL}/api`, 
  withCredentials: true,
});

export default api;