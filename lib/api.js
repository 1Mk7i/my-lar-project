const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers,
      },
      credentials: 'include', // Для кук аутентифікації
      ...options,
    };

    // Додаємо токен, якщо є
    if (this.token) {
      config.headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, config);
      
      // Якщо неавторизований, пробуємо оновити токен
      if (response.status === 401) {
        await this.refreshToken();
        // Повторюємо запит з новим токеном
        return this.request(endpoint, options);
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async login(email, password) {
    const response = await this.request('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (response.token) {
      this.setToken(response.token);
    }

    return response;
  }

  async register(userData) {
    const response = await this.request('/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    if (response.token) {
      this.setToken(response.token);
    }

    return response;
  }

  async logout() {
    await this.request('/logout', { method: 'POST' });
    this.clearToken();
  }

  setToken(token) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }

  async refreshToken() {
    try {
      // Спочатку отримуємо CSRF cookie
      await fetch(`${this.baseURL}/sanctum/csrf-cookie`, {
        credentials: 'include',
      });

      // Потім пробуємо оновити токен
      const response = await this.request('/api/refresh-token', {
        method: 'POST',
      });

      if (response.token) {
        this.setToken(response.token);
      }
    } catch (error) {
      this.clearToken();
      window.location.href = '/login'; // Перенаправляємо на логін
      throw error;
    }
  }

  // Методи для книг
  async getBooks() {
    return this.request('/api/books');
  }

  async getBook(id) {
    return this.request(`/api/books/${id}`);
  }
}

export const apiClient = new ApiClient();