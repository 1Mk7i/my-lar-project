export default function Home() {
  const handleTestMessage = () => {
          fetch('http://localhost:8000/api/test-message')
              .then(res => res.json())
              .then(data => alert(data.message))
              .catch(error => alert('Помилка: ' + error.message));
      };
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-5xl font-bold text-gray-800 mb-8">
          🎉 Next.js + Laravel Ready!
        </h1>
        
        <p className="text-xl text-gray-600 mb-8">
          Модульна архітектура успішно мігрована на Next.js
        </p>

        <button
          onClick={handleTestMessage}
          className="mb-8 py-2 px-4 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors duration-200"
        >
          Тестове повідомлення з бекенду
        </button>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          <div className="info-block">
            <div className="text-4xl mb-4">👥</div>
            <h3 className="text-xl text-gray-600 font-semibold mb-2">Користувачі</h3>
            <p className="text-gray-600 mb-4">Управління користувачами системи</p>
            <a 
              href="/users"
              className="primary-button-lg"
            >
              Перейти
            </a>
          </div>

          <div className="info-block">
            <div className="text-4xl mb-4">📦</div>
            <h3 className="text-xl text-gray-600 font-semibold mb-2">Продукти</h3>
            <p className="text-gray-600 mb-4">Каталог товарів та послуг</p>
            <a 
              href="/products"
              className="primary-button-lg"
            >
              Перейти
            </a>
          </div>

          <div className="info-block">
            <div className="text-4xl mb-4">📚</div>
            <h3 className="text-xl text-gray-600 font-semibold mb-2">Бібліотека</h3>
            <p className="text-gray-600 mb-4">Каталог книг</p>
            <a
              href="/books"
              className="primary-button-lg"
            >
              Перейти
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}