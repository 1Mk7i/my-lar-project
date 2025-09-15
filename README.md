# Laravel API + Next.js Проект

Сучасний веб-додаток з модульною архітектурою, побудований на Laravel (API backend) та Next.js (frontend) з використанням TypeScript та TailwindCSS.

## 🏗️ Архітектура

- **Backend**: Laravel 11 (тільки API)
- **Frontend**: Next.js 15 + TypeScript + React 19
- **Стилі**: TailwindCSS 4
- **База даних**: SQLite (для розробки)

## 🚀 Швидкий старт

### Вимоги
- PHP 8.2+
- Node.js 18+ (рекомендується 20+)
- Composer
- NPM або Yarn

### Встановлення

1. **Клонувати репозиторій**
```bash
git clone <your-repo-url>
cd my-lar-project
```

2. **Встановити PHP залежності**
```bash
composer install
```

3. **Встановити Node.js залежності**
```bash
npm install
```

4. **Налаштувати оточення**
```bash
cp .env.example .env
php artisan key:generate
```

5. **Запустити міграції**
```bash
php artisan migrate
```

## 🔧 Розробка

### Запуск в режимі розробки

**🎯 Рекомендований спосіб (два термінали):**
```bash
# Термінал 1: Laravel API сервер (порт 8000)
php artisan serve

# Термінал 2: Next.js dev сервер (порт 3000)
npm run dev
```

**⚡ Швидкий запуск (одна команда):**
```bash
npm run dev:all
```

### Доступ до додатку

- **Next.js Frontend**: `http://localhost:3000`
- **Laravel API**: `http://localhost:8000`
- **API тестування**: `http://localhost:8000/api/home`

## 📁 Структура проекту

```
├── app/Http/Controllers/Api/    # � API контролери Laravel
│   └── HomeController.php
├── pages/                       # 📄 Next.js сторінки
│   ├── _app.tsx                # ⚙️ Кореневий компонент Next.js
│   ├── index.tsx               # 🏠 Головна сторінка
│   ├── users/
│   │   └── index.tsx           # � Сторінка користувачів
│   └── products/
│       └── index.tsx           # 📦 Сторінка продуктів
├── styles/                     # 🎨 Глобальні стилі
│   └── globals.css             # 🌐 TailwindCSS
├── routes/                     # 🛣️ Laravel роути
│   ├── api.php                 # 🔌 API роути
│   └── web.php                 # 🌐 Веб роути
├── config/                     # ⚙️ Конфігурація Laravel
├── database/                   # 🗄️ Міграції та фабрики
└── package.json                # 📦 Next.js залежності
```

## 🧩 Модульна система

### Доступні сторінки

1. **Головна** � - Дашборд та навігація
2. **Користувачі** 👥 - Управління користувачами
3. **Продукти** 📦 - Каталог товарів
4. *Налаштування* ⚙️ - (планується)

### Створення нової сторінки

```bash
# 1. Створити Next.js сторінку
touch pages/your-page.tsx

# 2. Створити API ендпоінт в Laravel
php artisan make:controller Api/YourPageController

# 3. Додати роути в routes/api.php

# 4. Зареєструвати роут в api.php
```

## 🛠 Технології

- **Backend**: Laravel 11 (API-only)
- **Frontend**: Next.js 15 + TypeScript + React 19
- **Стилі**: TailwindCSS 4
- **HTTP Client**: Fetch API
- **Архітектура**: API-first + SSR/CSR

## 📝 API

### Основні ендпоінти

- `GET /api/home` - Дані головної сторінки
- `GET /api/test-message` - Тестове повідомлення
- `GET /api/users` - Список користувачів (планується)
- `GET /api/products` - Список продуктів (планується)

### Приклад відповіді API

```json
{
  "message": "Laravel API працює!",
  "frontend": "http://localhost:3000",
  "api": "http://localhost:8000/api"
}
```

## 🚨 Вирішення проблем

### Проблема з API підключенням

```bash
# Перевірити чи працює Laravel сервер
php artisan route:list

# Перевірити API роути
curl http://localhost:8000/api/home
```

### Проблеми з Next.js

```bash
# Очистити кеш Next.js
rm -rf .next
npm run dev
```

### Проблеми з залежностями

```bash
# Переустановити залежності
rm -rf node_modules package-lock.json
npm install
```

## 🎯 Особливості

- ✅ API-first архітектура з Laravel
- ✅ Server-Side Rendering (SSR) з Next.js
- ✅ TypeScript підтримка
- ✅ Responsive дизайн з TailwindCSS
- ✅ Роздільні сервери для API та Frontend
- ✅ Hot Module Replacement (HMR)
- ✅ Готовність до продакшн деплою

## 📄 Ліцензія

Цей проект є відкритим програмним забезпеченням, ліцензованим під [MIT ліцензією](https://opensource.org/licenses/MIT).