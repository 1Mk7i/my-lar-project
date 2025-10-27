import React from 'react'

interface BooksFilterProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  statusFilter: 'all' | 'available' | 'out_of_stock'
  onStatusChange: (value: 'all' | 'available' | 'out_of_stock') => void
  languageFilter: string
  onLanguageChange: (value: string) => void
  sortBy: 'title' | 'author' | 'year' | 'price'
  onSortChange: (value: 'title' | 'author' | 'year' | 'price') => void
  availableLanguages: string[]
}

export function BooksFilter({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
  languageFilter,
  onLanguageChange,
  sortBy,
  onSortChange,
  availableLanguages,
}: BooksFilterProps) {
  return (
    <div className="mb-6 space-y-4">
      <div>
        <input
          type="text"
          placeholder="🔍 Пошук за назвою або автором..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Статус</label>
          <select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value as any)}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Всі</option>
            <option value="available">В наявності</option>
            <option value="out_of_stock">Немає в наявності</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Мова</label>
          <select
            value={languageFilter}
            onChange={(e) => onLanguageChange(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Всі мови</option>
            {availableLanguages.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Сортування</label>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as any)}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="title">За назвою</option>
            <option value="author">За автором</option>
            <option value="year">За роком</option>
            <option value="price">За ціною</option>
          </select>
        </div>
      </div>
    </div>
  )
}

