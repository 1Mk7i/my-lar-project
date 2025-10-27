import { useState, useMemo } from 'react'
import { Book } from '../lib/api/types'

type StatusFilter = 'all' | 'available' | 'out_of_stock'
type SortBy = 'title' | 'author' | 'year' | 'price'

export function useBooksFilter(books: Book[]) {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [languageFilter, setLanguageFilter] = useState('all')
  const [sortBy, setSortBy] = useState<SortBy>('title')

  const filteredBooks = useMemo(() => {
    let filtered = books.filter((book) => {
      const matchesSearch =
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesStatus =
        statusFilter === 'all' || book.status === statusFilter
      
      const matchesLanguage =
        languageFilter === 'all' || book.language === languageFilter

      return matchesSearch && matchesStatus && matchesLanguage
    })

    // Сортування
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title)
        case 'author':
          return a.author.localeCompare(b.author)
        case 'year':
          return b.year - a.year
        case 'price':
          return a.price - b.price
        default:
          return 0
      }
    })

    return filtered
  }, [books, searchTerm, statusFilter, languageFilter, sortBy])

  // Отримання унікальних мов
  const availableLanguages = useMemo(() => {
    return Array.from(new Set(books.map((book) => book.language)))
  }, [books])

  return {
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
  }
}
