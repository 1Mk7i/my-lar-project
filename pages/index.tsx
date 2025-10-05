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
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
            <div className="text-4xl mb-4">👥</div>
            <h3 className="text-xl font-semibold mb-2">Користувачі</h3>
            <p className="text-gray-600 mb-4">Управління користувачами системи</p>
            <a 
              href="/users"
              className="inline-block w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-200"
            >
              Перейти до модуля
            </a>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
            <div className="text-4xl mb-4">📦</div>
            <h3 className="text-xl font-semibold mb-2">Продукти</h3>
            <p className="text-gray-600 mb-4">Каталог товарів та послуг</p>
            <a 
              href="/products"
              className="inline-block w-full py-2 px-4 bg-green-600 text-white rounded hover:bg-green-700 transition-colors duration-200"
            >
              Перейти до модуля
            </a>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
            <div className="text-4xl mb-4">⚙️</div>
            <h3 className="text-xl font-semibold mb-2">Налаштування</h3>
            <p className="text-gray-600 mb-4">Конфігурація системи</p>
            <button 
              onClick={() => alert('Модуль буде додано пізніше')}
              className="w-full py-2 px-4 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors duration-200"
            >
              Перейти до модуля
            </button>
          </div>


          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
            <div className="text-4xl mb-4">📚</div>
            <h3 className="text-xl font-semibold mb-2">Бібліотека</h3>
            <p className="text-gray-600 mb-4">Перегляд та управління книгами</p>
            <a
              href="/books"
              className="inline-block w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-200"
            >
              Перейти до модуля
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}