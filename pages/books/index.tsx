// app/books/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Book } from "@/components/types/Book.types";
import AlertMessage, { Alert } from "@/components/Alerts/Alert";
import { AuthModal } from "@/components/Auth/AuthModal";
import { UserMenu } from "@/components/Auth/UserMenu";
import { useAuth } from "@/hooks/useAuth";
import { apiClient } from "@/lib/api-client";

export default function Books() {
    const [books, setBooks] = useState<Book[]>([]);
    const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<
        "all" | "available" | "out_of_stock"
    >("all");
    const [languageFilter, setLanguageFilter] = useState("all");
    const [sortBy, setSortBy] = useState<"title" | "author" | "year" | "price">(
        "title",
    );
    const [alert, setAlert] = useState<Alert | null>(null);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const { user, isAuthenticated, logout } = useAuth();

    // Завантаження при старті
    useEffect(() => {
        loadBooks();
    }, []);

    useEffect(() => {
        filterAndSortBooks();
    }, [books, searchTerm, statusFilter, languageFilter, sortBy]);

    const loadBooks = async () => {
        try {
            setLoading(true);
            console.log("🔄 Завантаження книг...");

            const response = await apiClient.getBooks();
            console.log("📚 Відповідь від API:", response);

            if (response && (response.books || response.success)) {
                setBooks(response.books || []);
                setError(null);
                console.log(
                    `✅ Завантажено ${response.books?.length || 0} книг`,
                );
            } else {
                throw new Error("Невірний формат відповіді від сервера");
            }
        } catch (err: any) {
            console.error("❌ Помилка завантаження книг:", err);

            let errorMessage = "Помилка завантаження книг";

            if (err.response?.data) {
                console.error("📡 Дані помилки:", err.response.data);

                const errorData = err.response.data;
                if (typeof errorData === "string") {
                    errorMessage = errorData;
                } else if (errorData.message) {
                    errorMessage = errorData.message;
                } else if (errorData.error) {
                    errorMessage = errorData.error;
                }
            }

            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const filterAndSortBooks = () => {
        let filtered = books.filter((book) => {
            const matchesSearch =
                book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                book.author.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesStatus =
                statusFilter === "all" ||
                (statusFilter === "available" && book.status === "available") ||
                (statusFilter === "out_of_stock" &&
                    book.status === "out_of_stock");

            const matchesLanguage =
                languageFilter === "all" || book.language === languageFilter;

            return matchesSearch && matchesStatus && matchesLanguage;
        });

        filtered.sort((a, b) => {
            switch (sortBy) {
                case "title":
                    return a.title.localeCompare(b.title);
                case "author":
                    return a.author.localeCompare(b.author);
                case "year":
                    return b.year - a.year;
                case "price":
                    return a.price - b.price;
                default:
                    return 0;
            }
        });

        setFilteredBooks(filtered);
    };

    const addToCart = (book: Book) => {
        try {
            const cart = JSON.parse(localStorage.getItem("cart") || "[]");
            const existingItem = cart.find((item: any) => item.id === book.id);

            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    id: book.id,
                    title: book.title,
                    author: book.author,
                    description: book.description,
                    cover_image: book.cover_image,
                    price: book.price,
                    quantity: 1,
                });
            }

            localStorage.setItem("cart", JSON.stringify(cart));

            setAlert({
                title: `Книгу "${book.title}" додано до кошика`,
                type: "success",
            });
        } catch (error) {
            console.error("Помилка додавання до кошика:", error);

            setAlert({
                title: "Помилка додавання до кошика",
                type: "danger",
            });
        }
    };

    const getLanguageLabel = (language: string) => {
        const languages: { [key: string]: string } = {
            ukrainian: "🇺🇦 Українська",
            english: "🇬🇧 Англійська",
            german: "🇩🇪 Німецька",
            french: "🇫🇷 Французька",
            spanish: "🇪🇸 Іспанська",
            italian: "🇮🇹 Італійська",
            polish: "🇵🇱 Польська",
        };
        return languages[language] || language;
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("uk-UA", {
            style: "currency",
            currency: "UAH",
        }).format(price);
    };

    const getBookStatus = (book: Book) => {
        const isAvailable = book.status === "available";
        return {
            isAvailable,
            label: isAvailable ? "✅ В наявності" : "⏳ Немає",
            styles: isAvailable
                ? "bg-green-100 text-green-800 border border-green-200"
                : "bg-red-100 text-red-800 border border-red-200",
        };
    };

    const availableLanguages = Array.from(
        new Set(books.map((book) => book.language)),
    );

    const handleCloseAuthModal = () => {
        setShowAuthModal(false);
    };

    const handleAuthSuccess = () => {
        setShowAuthModal(false);
    };

    const handleLogout = async () => {
        try {
            await logout();
            setAlert({
                title: "Ви успішно вийшли з системи",
                type: "success",
            });
        } catch (error) {
            console.error("Помилка виходу:", error);
        }
    };

    const handleCloseAlert = () => {
        setAlert(null);
    };

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 p-8">
                <div className="container mx-auto">
                    <Link
                        href="/"
                        className="text-blue-600 hover:text-blue-800 mb-4 inline-block"
                    >
                        ← Повернутися на головну
                    </Link>

                    <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                        <div className="flex items-center mb-4">
                            <span className="text-red-500 text-2xl mr-3">
                                ❌
                            </span>
                            <div>
                                <h2 className="text-xl font-bold text-red-800">
                                    Помилка завантаження
                                </h2>
                                <p className="text-red-600">{error}</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <button
                                onClick={loadBooks}
                                className="block w-full md:w-auto px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                            >
                                Спробувати ще раз
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                {/* Алерт */}
                {alert && (
                    <AlertMessage alert={alert} onClose={handleCloseAlert} />
                )}

                {/* Модальне вікно авторизації */}
                <AuthModal
                    isOpen={showAuthModal}
                    onClose={handleCloseAuthModal}
                    onSuccess={handleAuthSuccess}
                    initialMode="login"
                />

                {/* Навігація */}
                <nav className="flex justify-between items-center mb-6">
                    <div className="flex items-center space-x-1 md:space-x-3">
                        <Link
                            href="/"
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                            🏠 Головна
                        </Link>
                        <span className="text-gray-400">/</span>
                        <span className="text-sm font-medium text-gray-500">
                            📚 Книги
                        </span>
                    </div>

                    <div className="flex items-center space-x-3">
                        {isAuthenticated && user ? (
                            <UserMenu user={user} onLogout={handleLogout} />
                        ) : (
                            <button
                                onClick={() => setShowAuthModal(true)}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center text-sm transition-colors"
                            >
                                🔐 Увійти
                            </button>
                        )}
                        <Link
                            href="/cart"
                            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg flex items-center text-sm transition-colors"
                        >
                            🛒 Кошик
                        </Link>
                    </div>
                </nav>

                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        📚 Каталог книг
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Відкрийте для себе світ чудових книг від класики до
                        сучасних бестселерів
                    </p>
                </div>

                {/* Панель пошуку та фільтрів */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Пошук */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                🔍 Пошук книг
                            </label>
                            <input
                                type="text"
                                placeholder="Назва або автор..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            />
                        </div>

                        {/* Фільтр за статусом */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                📊 Статус
                            </label>
                            <select
                                value={statusFilter}
                                onChange={(e) =>
                                    setStatusFilter(e.target.value as any)
                                }
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            >
                                <option value="all">Всі книги</option>
                                <option value="available">В наявності</option>
                                <option value="out_of_stock">
                                    Немає в наявності
                                </option>
                            </select>
                        </div>

                        {/* Фільтр за мовою */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                🌐 Мова
                            </label>
                            <select
                                value={languageFilter}
                                onChange={(e) =>
                                    setLanguageFilter(e.target.value)
                                }
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            >
                                <option value="all">Всі мови</option>
                                {availableLanguages.map((language) => (
                                    <option key={language} value={language}>
                                        {getLanguageLabel(language)}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Сортування */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                🔄 Сортування
                            </label>
                            <select
                                value={sortBy}
                                onChange={(e) =>
                                    setSortBy(e.target.value as any)
                                }
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            >
                                <option value="title">За назвою</option>
                                <option value="author">За автором</option>
                                <option value="year">За роком (нові)</option>
                                <option value="price">За ціною (дешеві)</option>
                            </select>
                        </div>
                    </div>

                    {/* Інформація про результати */}
                    {!loading && (
                        <div className="mt-4 flex justify-between items-center text-sm text-gray-600">
                            <span>Знайдено книг: {filteredBooks.length}</span>
                            {(searchTerm ||
                                statusFilter !== "all" ||
                                languageFilter !== "all") && (
                                <button
                                    onClick={() => {
                                        setSearchTerm("");
                                        setStatusFilter("all");
                                        setLanguageFilter("all");
                                        setSortBy("title");
                                    }}
                                    className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                                >
                                    Скинути фільтри
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* Статистика */}
                {!loading && books.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white rounded-lg p-6 shadow-sm text-center">
                            <div className="text-3xl font-bold text-blue-600 mb-2">
                                {books.length}
                            </div>
                            <div className="text-gray-600">Всього книг</div>
                        </div>
                        <div className="bg-white rounded-lg p-6 shadow-sm text-center">
                            <div className="text-3xl font-bold text-green-600 mb-2">
                                {
                                    books.filter(
                                        (book) => book.status === "available",
                                    ).length
                                }
                            </div>
                            <div className="text-gray-600">
                                Доступно для читання
                            </div>
                        </div>
                        <div className="bg-white rounded-lg p-6 shadow-sm text-center">
                            <div className="text-3xl font-bold text-purple-600 mb-2">
                                {Math.round(
                                    books.reduce(
                                        (sum, book) => sum + book.pages,
                                        0,
                                    ) / books.length,
                                )}
                            </div>
                            <div className="text-gray-600">
                                Середня кількість сторінок
                            </div>
                        </div>
                    </div>
                )}

                {/* Сітка книг */}
                {loading ? (
                    <div className="text-center py-20">
                        <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
                        <p className="mt-4 text-gray-600 text-lg">
                            Завантажуємо колекцію книг...
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredBooks.map((book) => (
                                <div
                                    key={book.id}
                                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full"
                                >
                                    {/* Обкладинка */}
                                    <div className="relative pb-[60%] bg-gray-200 flex-shrink-0">
                                        {book.cover_image ? (
                                            <img
                                                src={book.cover_image}
                                                alt={book.title}
                                                className="absolute h-full w-full object-cover"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                                                <span className="text-6xl">
                                                    📖
                                                </span>
                                            </div>
                                        )}
                                        {/* Статус */}
                                        <div className="absolute top-2 right-2">
                                            <span
                                                className={`px-2 py-1 text-xs font-medium rounded-full ${getBookStatus(book).styles}`}
                                            >
                                                {getBookStatus(book).label}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Інформація про книгу */}
                                    <div className="p-4 flex flex-col flex-grow">
                                        <div className="flex-grow min-h-0">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 break-words">
                                                {book.title}
                                            </h3>
                                            <p className="text-gray-600 mb-2 break-words">
                                                {book.author}
                                            </p>
                                            <p className="text-sm text-gray-500 mb-4 line-clamp-3 break-words overflow-hidden">
                                                {book.description}
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-between mb-4">
                                            <div className="text-lg font-bold text-blue-600">
                                                {formatPrice(book.price)}
                                            </div>
                                            <div className="flex space-x-2 text-sm text-gray-500">
                                                <span>{book.year}</span>
                                                <span>•</span>
                                                <span>{book.pages} стр.</span>
                                            </div>
                                        </div>

                                        {/* Кнопки */}
                                        <div className="flex space-x-2">
                                            <Link
                                                href={`/books/${book.id}`}
                                                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 text-center text-sm transition-colors duration-200"
                                            >
                                                Детальніше
                                            </Link>
                                            <button
                                                onClick={() => addToCart(book)}
                                                className="flex-1 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 text-sm transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                                disabled={
                                                    book.status !== "available"
                                                }
                                            >
                                                🛒 В кошик
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Повідомлення про відсутність результатів */}
                        {filteredBooks.length === 0 && !loading && (
                            <div className="text-center py-20 bg-white rounded-xl shadow-lg">
                                <span className="text-8xl mb-6 block">🔍</span>
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                    Книг не знайдено
                                </h3>
                                <p className="text-gray-600 text-lg max-w-md mx-auto">
                                    Спробуйте змінити параметри пошуку або
                                    скиньте фільтри
                                </p>
                                <button
                                    onClick={() => {
                                        setSearchTerm("");
                                        setStatusFilter("all");
                                        setLanguageFilter("all");
                                    }}
                                    className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                                >
                                    Скинути фільтри
                                </button>
                            </div>
                        )}
                    </>
                )}

                {/* Футер */}
                <footer className="mt-16 text-center text-gray-500">
                    <p>© 2025 Сучасна бібліотека. Всі права захищено.</p>
                </footer>
            </div>
        </div>
    );
}
