import { useState, useCallback } from 'react'
import axios from 'axios'

// Тимчасово створимо простий systemService прямо тут
const tempSystemService = {
  async testConnection() {
    console.log('🔧 Тестування базового підключення...')
    try {
      const response = await axios.get('http://localhost:8000/api/test')
      console.log('✅ Підключення успішне:', response.data)
      return response.data
    } catch (error) {
      console.error('❌ Тест підключення не вдався:', error)
      throw error
    }
  }
}

type ConnectionStatus = 'idle' | 'testing' | 'connected' | 'failed'

export function useApiConnection() {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('idle')
  const [connectionError, setConnectionError] = useState<string | null>(null)

  const testConnection = useCallback(async () => {
    try {
      setConnectionStatus('testing')
      setConnectionError(null)
      
      console.log('🔧 Тестування підключення до API...')
      
      const response = await tempSystemService.testConnection()
      console.log('✅ Підключення успішне:', response)
      
      setConnectionStatus('connected')
      return true
    } catch (error: any) {
      console.error('❌ Помилка підключення:', error)
      
      setConnectionStatus('failed')
      setConnectionError(
        error.response?.data?.message || 
        'Не вдалося підключитися до сервера. Перевірте, чи запущений бекенд.'
      )
      return false
    }
  }, [])

  const resetConnection = useCallback(() => {
    setConnectionStatus('idle')
    setConnectionError(null)
  }, [])

  return {
    connectionStatus,
    connectionError,
    testConnection,
    resetConnection,
  }
}
