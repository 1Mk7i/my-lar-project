// lib/api-client.ts
import axios, {
    AxiosInstance,
    AxiosResponse,
    InternalAxiosRequestConfig,
} from "axios";

interface LoginResponse {
    success: boolean;
    user: any;
    access_token: string;
    token_type: string;
}

interface RegisterResponse {
    success: boolean;
    user: any;
    access_token: string;
    token_type: string;
}

interface UserResponse {
    success: boolean;
    user: any;
}

interface LogoutResponse {
    success: boolean;
    message: string;
}

class ApiClient {
    private client: AxiosInstance;

    constructor() {
        this.client = axios.create({
            baseURL:
                process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api",
            timeout: 10000,
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "X-Requested-With": "XMLHttpRequest",
            },
            withCredentials: true,
        });

        this.setupInterceptors();
    }

    private setupInterceptors() {
        // Request interceptor
        this.client.interceptors.request.use(
            (config: InternalAxiosRequestConfig) => {
                console.log(
                    `🚀 ${config.method?.toUpperCase()} ${config.url}`,
                    config.params || "",
                );
                return config;
            },
            (error) => {
                console.error("❌ Request error:", error);
                return Promise.reject(error);
            },
        );

        // Response interceptor
        this.client.interceptors.response.use(
            (response: AxiosResponse) => {
                console.log(`✅ ${response.status} ${response.config.url}`);
                return response;
            },
            (error) => {
                console.error(
                    `❌ API Error ${error.response?.status} ${error.config?.url}:`,
                    {
                        status: error.response?.status,
                        statusText: error.response?.statusText,
                        data: error.response?.data,
                        headers: error.response?.headers,
                        config: {
                            url: error.config?.url,
                            method: error.config?.method,
                            baseURL: error.config?.baseURL,
                        },
                    },
                );

                // Більш детальна обробка помилок
                if (error.response?.status === 500) {
                    console.error("🔥 Серверна помилка 500. Перевірте:");
                    console.error("1. Чи запущений Laravel сервер?");
                    console.error(
                        "2. Чи є помилки в storage/logs/laravel.log?",
                    );
                    console.error("3. Чи правильно налаштована база даних?");
                }

                return Promise.reject(error);
            },
        );
    }

    // Generic methods
    async get<T>(url: string, params?: any): Promise<T> {
        try {
            const response: AxiosResponse<T> = await this.client.get(url, {
                params,
            });
            return response.data;
        } catch (error) {
            console.error(`❌ GET ${url} failed:`, error);
            throw error;
        }
    }

    async post<T>(url: string, data?: any): Promise<T> {
        try {
            const response: AxiosResponse<T> = await this.client.post(
                url,
                data,
            );
            return response.data;
        } catch (error) {
            console.error(`❌ POST ${url} failed:`, error);
            throw error;
        }
    }

    // Authentication methods
    async login(credentials: {
        email: string;
        password: string;
    }): Promise<any> {
        try {
            console.log("🔐 Надсилання запиту на вхід...");
            const response = await this.post<LoginResponse>(
                "/auth/login",
                credentials,
            );

            if (response.access_token) {
                // Зберігаємо токен в localStorage
                localStorage.setItem("auth_token", response.access_token);
                localStorage.setItem("user", JSON.stringify(response.user));

                // Додаємо токен до заголовків для майбутніх запитів
                this.client.defaults.headers.common["Authorization"] =
                    `Bearer ${response.access_token}`;
            }

            return response;
        } catch (error) {
            console.error("❌ Login failed:", error);
            throw error;
        }
    }

    async logout(): Promise<any> {
        try {
            console.log("🚪 Вихід з системи...");
            await this.post<LogoutResponse>("/auth/logout");

            // Очищаємо токен
            localStorage.removeItem("auth_token");
            localStorage.removeItem("user");
            delete this.client.defaults.headers.common["Authorization"];

            return { success: true };
        } catch (error) {
            console.error("❌ Logout failed:", error);

            // Навіть якщо запит не вдався, очищаємо локальні дані
            localStorage.removeItem("auth_token");
            localStorage.removeItem("user");
            delete this.client.defaults.headers.common["Authorization"];

            throw error;
        }
    }

    async register(userData: {
        name: string;
        email: string;
        password: string;
        password_confirmation: string;
    }): Promise<any> {
        try {
            console.log("📝 Реєстрація користувача...");
            const response = await this.post<RegisterResponse>(
                "/auth/register",
                userData,
            );

            if (response.access_token) {
                localStorage.setItem("auth_token", response.access_token);
                localStorage.setItem("user", JSON.stringify(response.user));
                this.client.defaults.headers.common["Authorization"] =
                    `Bearer ${response.access_token}`;
            }

            return response;
        } catch (error) {
            console.error("❌ Registration failed:", error);
            throw error;
        }
    }

    async getCurrentUser(): Promise<any> {
        try {
            console.log("👤 Отримання поточного користувача...");
            return await this.get<UserResponse>("/auth/user");
        } catch (error) {
            console.error("❌ Get current user failed:", error);
            throw error;
        }
    }

    // Метод для перевірки чи користувач авторизований
    isAuthenticated(): boolean {
        const token = localStorage.getItem("auth_token");
        return !!token;
    }

    // Метод для отримання збереженого користувача
    getStoredUser(): any {
        const user = localStorage.getItem("user");
        return user ? JSON.parse(user) : null;
    }

    // Метод для ініціалізації токена при завантаженні додатка
    initializeAuth(): void {
        const token = localStorage.getItem("auth_token");
        if (token) {
            this.client.defaults.headers.common["Authorization"] =
                `Bearer ${token}`;
        }
    }

    // Books methods
    async getBooks(): Promise<any> {
        return this.get("/modules/books");
    }
}

export const apiClient = new ApiClient();

// Ініціалізуємо авторизацію при створенні клієнта
if (typeof window !== "undefined") {
    apiClient.initializeAuth();
}
