/**
 * API Client Configuration
 * Централізована конфігурація для всіх API запитів
 */

import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { API_CONFIG, STORAGE_KEYS } from '@/constants';
import { getLocalStorage } from '@/utils';

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

// Request interceptor - додає токен до кожного запиту
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Перевіряємо, чи ми на клієнті перед використанням localStorage
    if (typeof window !== 'undefined') {
      const token = getLocalStorage(STORAGE_KEYS.AUTH_TOKEN);
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor - обробка помилок
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Обробка різних типів помилок
    if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
      console.error('Network Error: Перевірте, чи запущений бекенд сервер на', API_CONFIG.BASE_URL);
      console.error('Також перевірте CORS налаштування на бекенді');
    } else if (error.response?.status === 401) {
      console.warn('Unauthorized request - token may be expired');
    } else if (error.response) {
      // Сервер відповів з помилкою
      console.error('API Error:', error.response.status, error.response.data);
    } else {
      // Помилка налаштування запиту
      console.error('Request Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;