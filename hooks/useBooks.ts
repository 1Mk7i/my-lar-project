import { useState, useEffect, useCallback } from 'react'
import { booksService } from '@/lib/api'
import { Book } from '@/lib/api/types'

interface UseBooksOptions {
  autoLoad?: boolean
}

export function useBooks(options: UseBooksOptions = { autoLoad: true }) {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadBooks = useCallback(async (params?: any) => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('🔄 Завантаження книг...')
      const response = await booksService.getBooks(params)
      
      if (response && response.success) {
        setBooks(response.books || [])
        console.log(`✅ Завантажено ${response.books?.length || 0} книг`)
        return response
      } else {
        throw new Error('Невірний формат відповіді від сервера')
      }
    } catch (err: any) {
      console.error('❌ Помилка завантаження книг:', err)
      
      let errorMessage = 'Помилка завантаження книг'
      
      if (err.response?.data) {
        const errorData = err.response.data
        if (typeof errorData === 'string') {
          errorMessage = errorData
        } else if (errorData.message) {
          errorMessage = errorData.message
        } else if (errorData.error) {
          errorMessage = errorData.error
        }
      } else if (err.message) {
        errorMessage = err.message
      }
      
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (options.autoLoad) {
      loadBooks()
    }
  }, [options.autoLoad, loadBooks])

  return {
    books,
    loading,
    error,
    loadBooks,
    setBooks,
  }
}
