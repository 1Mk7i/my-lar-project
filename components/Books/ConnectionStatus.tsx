import React from 'react'

interface ConnectionStatusProps {
  status: 'idle' | 'testing' | 'connected' | 'failed'
  error?: string | null
  onRetry?: () => void
}

export function ConnectionStatus({ status, error, onRetry }: ConnectionStatusProps) {
  if (status === 'idle' || status === 'connected') {
    return null
  }

  if (status === 'testing') {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-center">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500 mr-3"></div>
          <p className="text-blue-700">🔧 Тестування підключення до API...</p>
        </div>
      </div>
    )
  }

  if (status === 'failed') {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-red-700 font-semibold mb-1">
              ❌ Не вдалося підключитися до сервера
            </p>
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <p className="text-red-600 text-sm mt-2">
              Перевірте, чи запущений Laravel сервер на http://localhost:8000
            </p>
          </div>
          {onRetry && (
            <button
              onClick={onRetry}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              Повторити
            </button>
          )}
        </div>
      </div>
    )
  }

  return null
}
