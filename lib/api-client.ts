// lib/api-client.ts
import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios'

class ApiClient {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      },
      withCredentials: true,
    })

    this.setupInterceptors()
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`, config.params || '')
        return config
      },
      (error) => {
        console.error('❌ Request error:', error)
        return Promise.reject(error)
      }
    )

    // Response interceptor
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        console.log(`✅ ${response.status} ${response.config.url}`)
        return response
      },
      (error) => {
        console.error(`❌ API Error ${error.response?.status} ${error.config?.url}:`, {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          headers: error.response?.headers,
          config: {
            url: error.config?.url,
            method: error.config?.method,
            baseURL: error.config?.baseURL
          }
        })
        
        // Більш детальна обробка помилок
        if (error.response?.status === 500) {
          console.error('🔥 Серверна помилка 500. Перевірте:')
          console.error('1. Чи запущений Laravel сервер?')
          console.error('2. Чи є помилки в storage/logs/laravel.log?')
          console.error('3. Чи правильно налаштована база даних?')
        }
        
        return Promise.reject(error)
      }
    )
  }

  // Generic methods
  async get<T>(url: string, params?: any): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.client.get(url, { params })
      return response.data
    } catch (error) {
      console.error(`❌ GET ${url} failed:`, error)
      throw error
    }
  }

  async post<T>(url: string, data?: any): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.client.post(url, data)
      return response.data
    } catch (error) {
      console.error(`❌ POST ${url} failed:`, error)
      throw error
    }
  }

  // Test methods - спростимо для тестування
  async testConnection(): Promise<any> {
    try {
      console.log('🔧 Тестування базового підключення...')
      const response = await this.client.get('/test')
      return response.data
    } catch (error) {
      console.error('❌ Тест підключення не вдався:', error)
      throw error
    }
  }

  async testDirectConnection(): Promise<boolean> {
    try {
      // Прямий запит без обробки через get()
      const response = await fetch('http://localhost:8000/api/test', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        credentials: 'include'
      })
      
      console.log('🔧 Прямий тест:', {
        status: response.status,
        ok: response.ok,
        url: response.url
      })
      
      if (response.ok) {
        const data = await response.json()
        console.log('✅ Прямий тест успішний:', data)
        return true
      } else {
        console.error('❌ Прямий тест не вдався:', response.status, response.statusText)
        return false
      }
    } catch (error) {
      console.error('❌ Прямий тест викликав помилку:', error)
      return false
    }
  }

  // Books methods
  async getBooks(): Promise<any> {
    return this.get('/modules/books')
  }
}

export const apiClient = new ApiClient()