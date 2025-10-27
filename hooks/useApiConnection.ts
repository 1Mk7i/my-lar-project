import { useState, useCallback } from 'react'

// Спробуємо прямий імпорт
import { systemService } from '../lib/api/services/system.service'

// Debug logging
console.log('🔍 systemService imported directly:', systemService)
console.log('🔍 systemService.testConnection:', systemService?.testConnection)

type ConnectionStatus = 'idle' | 'testing' | 'connected' | 'failed'

export function useApiConnection() {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('idle')
  const [connectionError, setConnectionError] = useState<string | null>(null)

  const testConnection = useCallback(async () => {
    try {
      setConnectionStatus('testing')
      setConnectionError(null)
      
      console.log('🔧 Тестування підключення до API...')
      
      const response = await systemService.testConnection()
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
