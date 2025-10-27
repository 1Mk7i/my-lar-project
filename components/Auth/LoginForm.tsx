// components/Auth/LoginForm.tsx
'use client'

import { useState } from 'react'
import { apiClient } from '@/lib/api-client'

interface LoginFormProps {
  onSuccess?: () => void
  onClose?: () => void
}

export function LoginForm({ onSuccess, onClose }: LoginFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !password) {
      setError('Будь ласка, заповніть всі поля')
      return
    }

    setLoading(true)
    setError('')

    try {
      console.log('🔐 Спроба входу...')
      
      const response = await apiClient.login({ email, password })
      
      console.log('✅ Успішний вхід:', response)
      
      // Викликаємо callback успіху
      if (onSuccess) {
        onSuccess()
      }
      
      // Закриваємо модальне вікно, якщо є
      if (onClose) {
        onClose()
      }
      
      // Оновлюємо сторінку або перенаправляємо
      setTimeout(() => {
        window.location.reload()
      }, 1000)
      
    } catch (err: any) {
      console.error('❌ Помилка входу:', err)
      
      let errorMessage = 'Помилка авторизації'
      
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error
      } else if (err.message) {
        errorMessage = err.message
      }
      
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleTestConnection = async () => {
    try {
      console.log('🔧 Тестування підключення...')
      const response = await apiClient.testConnection()
      console.log('✅ Підключення успішне:', response)
      alert('Підключення до API успішне!')
    } catch (error) {
      console.error('❌ Помилка підключення:', error)
      alert('Помилка підключення до API')
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleLogin} className="space-y-6">
        {/* Заголовок */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Вхід в систему</h2>
          <p className="mt-2 text-sm text-gray-600">
            Увійдіть у свій обліковий запис
          </p>
        </div>

        {/* Помилка */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <div className="flex items-center">
              <span className="text-red-500 text-lg mr-2">⚠️</span>
              <span className="font-medium">{error}</span>
            </div>
          </div>
        )}

        {/* Поле email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email адреса
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="your@email.com"
            required
            disabled={loading}
          />
        </div>

        {/* Поле пароля */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            Пароль
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="Ваш пароль"
            required
            disabled={loading}
          />
        </div>

        {/* Кнопка входу */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Вхід...
            </div>
          ) : (
            'Увійти'
          )}
        </button>

        {/* Додаткові дії */}
        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={handleTestConnection}
            className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            🔧 Тест підключення
          </button>
          
          <button
            type="button"
            onClick={onClose}
            className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            Скасувати
          </button>
        </div>

        {/* Демо дані */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Демо дані для тесту:</h3>
          <div className="text-xs text-gray-600 space-y-1">
            <p>Email: admin@example.com</p>
            <p>Password: password</p>
          </div>
        </div>
      </form>
    </div>
  )
}