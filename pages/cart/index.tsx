import { useState, useEffect } from 'react'
import Link from 'next/link'
import { CartItem } from '@/components/types/CartItem.types'


export default function Cart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    setCartItems(cart)
  }, [])

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return
    
    const updatedCart = cartItems.map(item =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    )
    setCartItems(updatedCart)
    localStorage.setItem('cart', JSON.stringify(updatedCart))
  }

  const removeItem = (id: number) => {
    const updatedCart = cartItems.filter(item => item.id !== id)
    setCartItems(updatedCart)
    localStorage.setItem('cart', JSON.stringify(updatedCart))
  }

  const clearCart = () => {
    setCartItems([])
    localStorage.setItem('cart', '[]')
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('uk-UA', {
      style: 'currency',
      currency: 'UAH'
    }).format(price)
  }

  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Навігація */}
        <nav>
          <div className="flex items-center space-x-1 md:space-x-3">
            <Link href="/" className="link">
              🏠 Головна
            </Link>
            <span className="text-gray-400">/</span>
            <Link href="/books" className="link">
              📚 Книги
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-sm font-medium text-gray-500">🛒 Кошик</span>
          </div>
        </nav>

        {/* Заголовок */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1>🛒 Кошик</h1>
            <p className="subtitle">Ваші обрані книги</p>
          </div>
        </div>

        {cartItems.length === 0 ? (
          // Порожній кошик
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="text-6xl mb-4">🛒</div>
            <h2>Кошик порожній</h2>
            <p className="subtitle">Додайте книги з каталогу до кошика</p>
            <Link 
              href="/books"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg"
            >
              Перейти до книг
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Список товарів */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex gap-4">
                    {/* Обкладинка */}
                    <div className="w-24 h-32 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      {item.cover_image ? (
                        <img 
                          src={item.cover_image} 
                          alt={item.title}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <span className="text-3xl">📖</span>
                      )}
                    </div>

                    {/* Інформація */}
                    <div className="flex-grow">
                      <h3 className="title">{item.title}</h3>
                      <p className="subtitle">Автор: {item.author}</p>
                      <p className="description">{item.description}</p>
                      
                      <div className="flex justify-between items-center">
                        <div className="product-price">
                          {formatPrice(item.price)}
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          {/* Кількість */}
                          <div className="flex items-center border border-gray-300 rounded-lg">
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="px-3 text-gray-600 py-1 hover:bg-gray-100"
                            >
                              -
                            </button>
                            <span className="px-3 text-gray-600 py-1 border-x border-gray-300 min-w-12 text-center">
                              {item.quantity}
                            </span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="px-3 text-gray-600 py-1 hover:bg-gray-100"
                            >
                              +
                            </button>
                          </div>

                          {/* Видалити */}
                          <button 
                            onClick={() => removeItem(item.id)}
                            className="text-red-600 hover:text-red-800 p-2"
                          >
                            Видалити
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Панель замовлення */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-6 sticky top-4">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Оформлення замовлення</h3>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Товари:</span>
                    <span className="title">{totalItems} товар(ів)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Доставка:</span>
                    <span className="text-green-600">Безкоштовно</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between text-lg font-bold">
                      <span className="title">Всього:</span>
                      <span className="title">{formatPrice(totalPrice)}</span>
                    </div>
                  </div>
                </div>

                <button className="success-button">
                  Оформити замовлення
                </button>

                <button 
                  onClick={clearCart}
                  className="unsuccess-button"
                >
                  Очистити кошик
                </button>

                <Link 
                  href="/books"
                  className="secondary-button"
                >
                  Продовжити покупки
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}