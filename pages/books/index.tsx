// pages/books/index.tsx
'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useBooks } from '../../hooks/useBooks'
import { useBooksFilter } from '../../hooks/useBooksFilter'
import { useApiConnection } from '../../hooks/useApiConnection'
import { 
  BooksFilter, 
  BooksList, 
  ConnectionStatus 
} from '../../components/Books'

export default function BooksPage() {
  const { connectionStatus, connectionError, testConnection } = useApiConnection()
  const { books, loading, error } = useBooks({ autoLoad: false })
  const {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    languageFilter,
    setLanguageFilter,
    sortBy,
    setSortBy,
    filteredBooks,
    availableLanguages,
  } = useBooksFilter(books)

  useEffect(() => {
    const initialize = async () => {
      await testConnection()
    }
    initialize()
  }, [testConnection])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Заголовок */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            📚 Каталог книг
          </h1>
          <p className="text-gray-600">
            Знайдіть свою наступну улюблену книгу
          </p>
        </div>

        {/* Статус підключення */}
        <ConnectionStatus
          status={connectionStatus}
          error={connectionError}
          onRetry={testConnection}
        />

        {/* Фільтри */}
        <BooksFilter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          languageFilter={languageFilter}
          onLanguageChange={setLanguageFilter}
          sortBy={sortBy}
          onSortChange={setSortBy}
          availableLanguages={availableLanguages}
        />

        {/* Статистика */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-gray-600">
            Знайдено книг: <span className="font-semibold">{filteredBooks.length}</span>
            {filteredBooks.length !== books.length && (
              <span className="text-sm text-gray-500 ml-2">
                (з {books.length} загалом)
              </span>
            )}
          </p>
          
          <Link
            href="/books/add"
            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
          >
            ➕ Додати книгу
          </Link>
        </div>

        {/* Список книг */}
        <BooksList
          books={filteredBooks}
          loading={loading}
          error={error}
        />
      </div>
    </div>
  )
}
