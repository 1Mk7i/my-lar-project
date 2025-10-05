import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Book {
  id: number
  title: string
  author: string
  description: string
  isbn: string
  year: number
  cover_image: string | null
  price: number
  pages: number
  language: string
  status: 'available' | 'out_of_stock'
  created_at: string
  updated_at: string
}

export default function Books() {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadBooks()
  }, [])

  const loadBooks = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/modules/books')
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      setBooks(data.books || [])
      setError(null)
    } catch (err) {
      console.error('Error loading books:', err)
      setError('Помилка завантаження книг: ' + (err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="container mx-auto">
          <Link href="/" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
            ← Повернутися на головну
          </Link>
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <strong className="font-bold">Помилка!</strong>
            <span className="block sm:inline"> {error}</span>
            <button 
              onClick={loadBooks}
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Спробувати ще раз
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Хлібні крихти */}
        <nav className="flex mb-6" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <Link href="/" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600">
                🏠 Головна
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <span className="mx-2 text-gray-400">/</span>
                <span className="text-sm font-medium text-gray-500">📚 Книги</span>
              </div>
            </li>
          </ol>
        </nav>

        {/* Заголовок сторінки */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              📚 Бібліотека книг
            </h1>
            <p className="mt-2 text-gray-600">Перегляд та управління книгами</p>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            ➕ Додати книгу
          </button>
        </div>

        {/* Сітка книг */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Завантаження книг...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {books.map((book) => (
              <div key={book.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="relative pb-[60%] bg-gray-200">
                  {book.cover_image ? (
                    <img
                      src={book.cover_image}
                      alt={book.title}
                      className="absolute h-full w-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                      <span className="text-6xl">📖</span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {book.title}
                  </h3>
                  <p className="text-gray-600 mb-2">{book.author}</p>
                  <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                    {book.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="text-lg font-bold text-blue-600">
                      {book.price} ₴
                    </div>
                    <div className="flex space-x-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        book.status === 'available' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {book.status === 'available' ? 'В наявності' : 'Немає в наявності'}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 flex space-x-2">
                    <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors">
                      Детальніше
                    </button>
                    <button className="p-2 text-gray-500 hover:text-blue-600 transition-colors">
                      ✏️
                    </button>
                    <button className="p-2 text-gray-500 hover:text-red-600 transition-colors">
                      🗑️
                    </button>
                  </div>
                </div>
                <div className="px-4 py-2 bg-gray-50 text-sm text-gray-500">
                  <div className="flex justify-between">
                    <span>Рік: {book.year}</span>
                    <span>{book.pages} стор.</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {books.length === 0 && !loading && (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <span className="text-6xl mb-4 block">📚</span>
            <h3 className="text-xl font-medium text-gray-900 mb-2">Книг не знайдено</h3>
            <p className="text-gray-500">Наразі в бібліотеці немає жодної книги</p>
          </div>
        )}
      </div>
    </div>
  )
}