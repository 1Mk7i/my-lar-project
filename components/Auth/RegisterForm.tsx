// components/Auth/RegisterForm.tsx
"use client";

import { useState } from "react";
import { apiClient } from "@/lib/api-client";

interface RegisterFormProps {
    onSuccess?: () => void;
    onClose?: () => void;
    onSwitchToLogin?: () => void;
}

export function RegisterForm({ onSuccess, onClose, onSwitchToLogin }: RegisterFormProps) {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.email || !formData.password || !formData.password_confirmation) {
            setError("Будь ласка, заповніть всі поля");
            return;
        }

        if (formData.password !== formData.password_confirmation) {
            setError("Паролі не співпадають");
            return;
        }

        if (formData.password.length < 8) {
            setError("Пароль має містити щонайменше 8 символів");
            return;
        }

        setLoading(true);
        setError("");

        try {
            console.log("📝 Спроба реєстрації...");

            const response = await apiClient.register(formData);

            console.log("✅ Успішна реєстрація:", response);

            // Викликаємо callback успіху
            if (onSuccess) {
                onSuccess();
            }

            // Закриваємо модальне вікно, якщо є
            if (onClose) {
                onClose();
            }

            // Оновлюємо сторінку або перенаправляємо
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } catch (err: any) {
            console.error("❌ Помилка реєстрації:", err);

            let errorMessage = "Помилка реєстрації";

            if (err.response?.data?.message) {
                errorMessage = err.response.data.message;
            } else if (err.response?.data?.error) {
                errorMessage = err.response.data.error;
            } else if (err.response?.data?.errors) {
                // Laravel validation errors
                const errors = err.response.data.errors;
                const firstError = Object.values(errors)[0] as string[];
                errorMessage = firstError[0];
            } else if (err.message) {
                errorMessage = err.message;
            }

            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto">
            <form onSubmit={handleRegister} className="space-y-6">
                {/* Заголовок */}
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900">
                        Реєстрація
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Створіть новий обліковий запис
                    </p>
                </div>

                {/* Помилка */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                        <div className="flex items-center">
                            <span className="text-red-500 text-lg mr-2">
                                ⚠️
                            </span>
                            <span className="font-medium">{error}</span>
                        </div>
                    </div>
                )}

                {/* Поле імені */}
                <div>
                    <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700 mb-2"
                    >
                        Повне ім'я
                    </label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="Ваше повне ім'я"
                        required
                        disabled={loading}
                    />
                </div>

                {/* Поле email */}
                <div>
                    <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-2"
                    >
                        Email адреса
                    </label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="your@email.com"
                        required
                        disabled={loading}
                    />
                </div>

                {/* Поле пароля */}
                <div>
                    <label
                        htmlFor="password"
                        className="block text-sm font-medium text-gray-700 mb-2"
                    >
                        Пароль
                    </label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="Мінімум 8 символів"
                        required
                        minLength={8}
                        disabled={loading}
                    />
                </div>

                {/* Поле підтвердження пароля */}
                <div>
                    <label
                        htmlFor="password_confirmation"
                        className="block text-sm font-medium text-gray-700 mb-2"
                    >
                        Підтвердити пароль
                    </label>
                    <input
                        id="password_confirmation"
                        name="password_confirmation"
                        type="password"
                        value={formData.password_confirmation}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="Повторіть пароль"
                        required
                        disabled={loading}
                    />
                </div>

                {/* Кнопка реєстрації */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                    {loading ? (
                        <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                            Реєстрація...
                        </div>
                    ) : (
                        "Зареєструватися"
                    )}
                </button>

                {/* Додаткові дії */}
                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                    <button
                        type="button"
                        onClick={onSwitchToLogin}
                        className="text-sm text-blue-600 hover:text-blue-800 transition-colors font-medium"
                    >
                        Вже маєте акаунт? Увійти
                    </button>

                    <button
                        type="button"
                        onClick={onClose}
                        className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
                    >
                        Скасувати
                    </button>
                </div>
            </form>
        </div>
    );
}
