/**
 * Application Constants
 * Централізоване зберігання всіх констант додатку
 */

// API Configuration
// Використовуємо NEXT_PUBLIC_ префікс для доступу на клієнті
// Не використовуємо typeof window на рівні модуля, щоб уникнути hydration mismatch
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 
            process.env.NEXT_PUBLIC_API_URL || 
            'http://localhost:8000/api',
  TIMEOUT: 10000,
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  USER: 'user',
  THEME_MODE: 'themeMode',
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_ITEMS_PER_PAGE: 12,
  ITEMS_PER_PAGE_OPTIONS: [6, 12, 24, 48] as const,
} as const;

// Search & Filter
export const SEARCH = {
  DEBOUNCE_DELAY: 500, // milliseconds
} as const;

// User Roles
export const USER_ROLES = {
  USER: 1,
  AUTHOR: 2,
  ADMIN: 3,
} as const;

// File Upload
export const FILE_UPLOAD = {
  MAX_AVATAR_SIZE: 2048, // KB
  ALLOWED_AVATAR_TYPES: ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'],
} as const;

// Routes
export const ROUTES = {
  HOME: '/',
  CART: '/cart',
  PROFILE: '/profile',
  ADMIN: '/admin',
  BOOKS: {
    BASE: '/books',
    DETAIL: (id: number | string) => `/books/${id}`,
    EDIT: (id: number | string) => `/books/${id}/edit`,
  },
} as const;

// Snackbar
export const SNACKBAR = {
  DEFAULT_DURATION: 4000, // milliseconds
} as const;

