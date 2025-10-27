// hooks/useAuth.ts
import { useState, useEffect, useCallback } from "react";
import { apiClient } from "@/lib/api-client";

interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
    created_at: string;
    updated_at: string;
}

interface UseAuthReturn {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (credentials: { email: string; password: string }) => Promise<void>;
    register: (userData: {
        name: string;
        email: string;
        password: string;
        password_confirmation: string;
    }) => Promise<void>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
}

export function useAuth(): UseAuthReturn {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Ініціалізація при завантаженні
    useEffect(() => {
        const initializeAuth = async () => {
            try {
                // Перевіряємо, чи є збережений користувач
                const storedUser = apiClient.getStoredUser();
                if (storedUser && apiClient.isAuthenticated()) {
                    setUser(storedUser);
                    // Не намагаємося оновити дані користувача при ініціалізації
                    // щоб уникнути помилок при запуску
                }
            } catch (error) {
                console.error("Помилка ініціалізації авторизації:", error);
                // Очищуємо дані при помилці
                localStorage.removeItem("auth_token");
                localStorage.removeItem("user");
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };

        initializeAuth();
    }, []);

    const login = useCallback(
        async (credentials: { email: string; password: string }) => {
            try {
                const response = await apiClient.login(credentials);
                if (response.success && response.user) {
                    setUser(response.user);
                }
            } catch (error) {
                console.error("Помилка входу:", error);
                throw error;
            }
        },
        [],
    );

    const register = useCallback(
        async (userData: {
            name: string;
            email: string;
            password: string;
            password_confirmation: string;
        }) => {
            try {
                const response = await apiClient.register(userData);
                if (response.success && response.user) {
                    setUser(response.user);
                }
            } catch (error) {
                console.error("Помилка реєстрації:", error);
                throw error;
            }
        },
        [],
    );

    const logout = useCallback(async () => {
        try {
            await apiClient.logout();
        } catch (error) {
            console.error("Помилка виходу:", error);
        } finally {
            setUser(null);
        }
    }, []);

    const refreshUser = useCallback(async () => {
        try {
            if (!apiClient.isAuthenticated()) {
                setUser(null);
                return;
            }

            const response = await apiClient.getCurrentUser();
            if (response.success && response.user) {
                setUser(response.user);
                localStorage.setItem("user", JSON.stringify(response.user));
            }
        } catch (error) {
            console.error("Помилка оновлення користувача:", error);
            if (
                (error as any).response?.status === 401 ||
                (error as any).response?.status === 500
            ) {
                await logout();
            }
        }
    }, [logout]);

    return {
        user,
        isAuthenticated: !!user && apiClient.isAuthenticated(),
        isLoading,
        login,
        register,
        logout,
        refreshUser,
    };
}
