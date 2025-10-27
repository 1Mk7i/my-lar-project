import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { Book } from '@/components/types/Book.types'

export default function BookDetail() {
  const router = useRouter()
  const { id } = router.query
  const [book, setBook] = useState<Book | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (id) {
      loadBook()
    }
  }, [id])

  const loadBook = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/modules/books/${id}`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      setBook(data.book)
      setError(null)
    } catch (err) {
      console.error('Error loading book:', err)
      setError('Помилка завантаження інформації про книгу: ' + (err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  // Функція додавання в кошик
  const addToCart = (book: Book) => {
    try {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]')
      const existingItem = cart.find((item: any) => item.id === book.id)
      
      if (existingItem) {
        existingItem.quantity += 1
      } else {
        cart.push({
          id: book.id,
          title: book.title,
          author: book.author,
          description: book.description,
          cover_image: book.cover_image,
          price: book.price,
          quantity: 1
        })
      }
      
      localStorage.setItem('cart', JSON.stringify(cart))
      alert(`Книгу "${book.title}" додано до кошика!`)
    } catch (error) {
      console.error('Помилка додавання до кошика:', error)
      alert('Помилка додавання до кошика')
    }
  }

  const getLanguageLabel = (language: string) => {
    const languages: { [key: string]: string } = {
      'ukrainian': '🇺🇦 Українська',
      'english': '🇬🇧 Англійська', 
      'german': '🇩🇪 Німецька',
      'french': '🇫🇷 Французька',
      'spanish': '🇪🇸 Іспанська',
      'italian': '🇮🇹 Італійська',
      'polish': '🇵🇱 Польська'
    }
    return languages[language] || language
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('uk-UA', {
      style: 'currency',
      currency: 'UAH'
    }).format(price)
  }

  const getBookYear = (book: Book) => {
    return book.year || book.publication_year || 'Не вказано'
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="container mx-auto">
          <Link href="/books" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
            ← Повернутися до всіх книг
          </Link>
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <strong className="font-bold">Помилка!</strong>
            <span className="block sm:inline"> {error}</span>
            <button 
              onClick={loadBook}
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Спробувати ще раз
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="container mx-auto">
          <Link href="/books" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
            ← Повернутися до всіх книг
          </Link>
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600 text-lg">Завантажуємо інформацію про книгу...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="container mx-auto">
          <Link href="/books" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
            ← Повернутися до всіх книг
          </Link>
          <div className="text-center py-20 bg-white rounded-xl shadow">
            <span className="text-6xl mb-4 block">📚</span>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Книгу не знайдено</h3>
            <p className="text-gray-600">На жаль, такої книги не існує в нашій бібліотеці.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Навігація */}
        <nav>
          <div className="flex items-center space-x-1 md:space-x-3">
            <Link href="/" className="link">
              🏠 Головна
            </Link>
            <span className="mx-2 text-gray-400">/</span>
            <Link href="/books" className="link">
              📚 Книги
            </Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-sm font-medium text-gray-500">{book.title}</span>
          </div>
          <Link 
            href="/cart" 
            className="secondary-button-sm"
          >
            🛒 Кошик
          </Link>
        </nav>

        {/* Основна інформація */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="md:flex">
            {/* Обкладинка */}
            <div className="md:w-1/3 p-8 flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
              {book.cover_image ? (
                <img
                  src={book.cover_image}
                  alt={book.title}
                  className="w-64 h-96 object-cover rounded-lg shadow-lg"
                />
              ) : (
                <div className="text-center">
                  <span className="text-8xl mb-4 block">📖</span>
                  <p className="text-gray-500">Немає обкладинки</p>
                </div>
              )}
            </div>

            {/* Детальна інформація */}
            <div className="md:w-2/3 p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h1>{book.title}</h1>
                  <p className="text-xl text-gray-600 mb-4">{book.author}</p>
                </div>
                <span className={`tag-fill ${
                  book.status === 'available' 
                    ? 'success-tag' 
                    : 'unsuccess-tag'
                }`}>
                  {book.status === 'available' ? '✅ В наявності' : '⏳ Немає в наявності'}
                </span>
              </div>

              {/* Опис */}
              <div className="mb-8">
                <h2>Опис:</h2>
                <p className="text-gray-700 leading-relaxed">
                  {book.description || 'Опис відсутній'}
                </p>
              </div>

              {/* Деталі */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-4">
                  <div className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-gray-800 font-medium">💰 Ціна:</span>
                    <span className="product-price">{formatPrice(book.price)}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-gray-800 font-medium">📅 Рік видання:</span>
                    <span className="font-semibold text-gray-900">{getBookYear(book)}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-gray-800 font-medium">📄 Сторінок:</span>
                    <span className="font-semibold text-gray-900">{book.pages || 'Не вказано'}</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-gray-800 font-medium">🌐 Мова:</span>
                    <span className="font-semibold text-gray-900">{getLanguageLabel(book.language)}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-gray-800 font-medium">🔖 ISBN:</span>
                    <span className="font-semibold text-gray-900">{book.isbn || 'Не вказано'}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-gray-800 font-medium">🆔 ID:</span>
                    <span className="font-semibold text-gray-900">{book.id}</span>
                  </div>
                </div>
              </div>

              {/* Кнопки дій */}
              <div className="flex space-x-4">
                <button 
                  onClick={() => addToCart(book)}
                  className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                    book.status === 'available'
                      ? 'success-tag'
                      : 'unsuccess-tag cursor-not-allowed'
                  }`}
                  disabled={book.status !== 'available'}
                >
                  {book.status === 'available' ? '🛒 Додати до кошика' : 'Недоступно для замовлення'}
                </button>
                <Link 
                  href="/books" 
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
                >
                  ← До всіх книг
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}