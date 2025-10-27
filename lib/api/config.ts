// lib/api/config.ts
export const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
  withCredentials: true,
}

export const API_ENDPOINTS = {
  test: '/test',
  health: '/health',
  books: {
    list: '/modules/books',
    show: (id: number) => `/modules/books/${id}`,
  },
}
