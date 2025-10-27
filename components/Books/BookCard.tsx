import React from 'react'
import Link from 'next/link'
import { Book } from '@/lib/api/types'

interface BookCardProps {
  book: Book
}

export function BookCard({ book }: BookCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-64 bg-gray-200">
        {book.cover_image ? (
          <img
            src={book.cover_image}
            alt={book.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <span className="text-6xl">📚</span>
          </div>
        )}
        
        <div className="absolute top-2 right-2">
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              book.status === 'available'
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {book.status === 'available' ? 'В наявності' : 'Немає'}
          </span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2 line-clamp-2">
          {book.title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-2">
          Автор: {book.author}
        </p>
        
        <p className="text-gray-500 text-sm mb-3 line-clamp-2">
          {book.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm text-gray-600">
              📅 {book.year} | 📖 {book.pages} стор.
            </p>
            <p className="text-sm text-gray-600">
              🌐 {book.language}
            </p>
          </div>
          
          <div className="text-right">
            <p className="text-2xl font-bold text-blue-600">
              {book.price.toFixed(2)} ₴
            </p>
          </div>
        </div>

        <Link
          href={`/books/${book.id}`}
          className="mt-4 block w-full text-center bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition-colors"
        >
          Детальніше
        </Link>
      </div>
    </div>
  )
}
