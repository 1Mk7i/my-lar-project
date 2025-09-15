import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Product {
  id: number
  name: string
  description: string
  price: number
  created_at: string
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([
    {
      id: 1,
      name: "Laptop Dell XPS 13",
      description: "Потужний ультрабук для роботи та розваг",
      price: 45000,
      created_at: new Date().toISOString()
    },
    {
      id: 2,
      name: "iPhone 15 Pro",
      description: "Найновіший смартфон від Apple",
      price: 55000,
      created_at: new Date().toISOString()
    },
    {
      id: 3,
      name: "MacBook Pro M3",
      description: "Професійний ноутбук для творчих завдань",
      price: 85000,
      created_at: new Date().toISOString()
    }
  ])
  const [loading, setLoading] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb навігація */}
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
                <span className="text-sm font-medium text-gray-500">📦 Продукти</span>
              </div>
            </li>
          </ol>
        </nav>

        {/* Заголовок сторінки */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              📦 Продукти
            </h1>
            <p className="mt-2 text-gray-600">Каталог товарів та послуг</p>
          </div>
          <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
            ➕ Додати продукт
          </button>
        </div>

        {/* Сітка продуктів */}
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            <p className="mt-2 text-gray-600">Завантаження продуктів...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
                <div className="p-6">
                  <div className="text-4xl mb-4 text-center">📱</div>
                  <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                  <p className="text-gray-600 mb-4">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-green-600">
                      ₴{product.price.toLocaleString('uk-UA')}
                    </span>
                    <div className="space-x-2">
                      <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                        Переглянути
                      </button>
                      <button className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300">
                        Редагувати
                      </button>
                    </div>
                  </div>
                  <div className="mt-4 text-xs text-gray-500">
                    Створено: {new Date(product.created_at).toLocaleDateString('uk-UA')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {products.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📦</div>
            <p className="text-gray-500 text-lg">Продуктів поки що немає</p>
            <button className="mt-4 px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700">
              Додати перший продукт
            </button>
          </div>
        )}
      </div>
    </div>
  )
}