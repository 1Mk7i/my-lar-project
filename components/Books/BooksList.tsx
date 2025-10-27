import React from 'react'
import { Book } from '../../lib/api/types'
import { BookCard } from './BookCard'

interface BooksListProps {
  books: Book[]
  loading?: boolean
  error?: string | null
}

export function BooksList({ books, loading, error }: BooksListProps) {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Завантаження книг...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        <p className="font-semibold">❌ Помилка:</p>
        <p>{error}</p>
      </div>
    )
  }

  if (books.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-xl text-gray-500 mb-2">📚 Книг не знайдено</p>
        <p className="text-gray-400">Спробуйте змінити фільтри пошуку</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {books.map((book) => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  )
}
