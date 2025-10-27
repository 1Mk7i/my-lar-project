// lib/api/interceptors.ts
import { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios'

export function setupRequestInterceptor(client: AxiosInstance) {
  client.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`, config.params || '')
      return config
    },
    (error) => {
      console.error('❌ Request error:', error)
      return Promise.reject(error)
    }
  )
}

export function setupResponseInterceptor(client: AxiosInstance) {
  client.interceptors.response.use(
    (response: AxiosResponse) => {
      console.log(`✅ ${response.status} ${response.config.url}`)
      return response
    },
    (error) => {
      handleApiError(error)
      return Promise.reject(error)
    }
  )
}

function handleApiError(error: any) {
  console.error(`❌ API Error ${error.response?.status} ${error.config?.url}:`, {
    status: error.response?.status,
    statusText: error.response?.statusText,
    data: error.response?.data,
    headers: error.response?.headers,
    config: {
      url: error.config?.url,
      method: error.config?.method,
      baseURL: error.config?.baseURL,
    },
  })

  // Детальна обробка за статусами
  switch (error.response?.status) {
    case 500:
      console.error('🔥 Серверна помилка 500. Перевірте:')
      console.error('1. Чи запущений Laravel сервер?')
      console.error('2. Чи є помилки в storage/logs/laravel.log?')
      console.error('3. Чи правильно налаштована база даних?')
      break
    case 404:
      console.error('🔍 Ресурс не знайдено (404)')
      break
    case 401:
      console.error('🔐 Не авторизовано (401)')
      break
    case 403:
      console.error('🚫 Доступ заборонено (403)')
      break
  }
}

