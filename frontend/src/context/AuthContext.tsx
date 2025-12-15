// src/context/AuthContext.tsx

"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types'; 
import api from '@/lib/api'; 

// --- 1. Визначення типів ---

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, password_confirmation: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  isAuthInitialized: boolean; // Вказує, чи LocalStorage прочитано
}

// --- 2. Створення Context ---

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// --- 3. Провайдер Context ---

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthInitialized, setIsAuthInitialized] = useState(false);

  // Ініціалізація: Завантаження токена та користувача з Local Storage
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('user');

    if (storedToken) {
      setToken(storedToken);
      api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      
      if (storedUser) {
        try {
            setUser(JSON.parse(storedUser));
        } catch (e) {
            console.error("Failed to parse stored user data:", e);
            // Якщо не вдалося розібрати, очищаємо все
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
        }
      }
    }
    
    // Встановлюємо ініціалізацію в true після того, як Local Storage прочитано
    setIsAuthInitialized(true); 
  }, []);

  // Оновлення Axios та Local Storage при зміні токена/користувача
  useEffect(() => {
    if (token) {
      localStorage.setItem('authToken', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      localStorage.removeItem('authToken');
      delete api.defaults.headers.common['Authorization'];
    }
    
    if (user) {
        // Зберігаємо повний об'єкт користувача
        localStorage.setItem('user', JSON.stringify(user)); 
    } else {
        localStorage.removeItem('user');
    }
    
  }, [token, user]);


  // --- Логіка ВХОДУ ---
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await api.post('/login', { email, password });
      
      const newToken = response.data.token;
      
      // Забезпечуємо, що ми беремо повні дані з бекенду (включаючи роль: 3)
      const userData: User = { 
          ...response.data.user,
          role: response.data.user.role || { id: 2, name: 'User' } 
      }; 

      setToken(newToken);
      setUser(userData);

    } catch (error) {
      console.error("Login failed:", error);
      throw error; 
    } finally {
        setIsLoading(false);
    }
  };


  // --- Логіка РЕЄСТРАЦІЇ ---
  const register = async (name: string, email: string, password: string, password_confirmation: string) => {
    setIsLoading(true);
    try {
      const response = await api.post('/register', { name, email, password, password_confirmation });
      
      const newToken = response.data.token;
      const userData: User = { 
          ...response.data.user,
          role: response.data.user.role || { id: 2, name: 'User' } 
      };

      setToken(newToken);
      setUser(userData);
      
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    } finally {
        setIsLoading(false);
    }
  };


  // --- Логіка ВИХОДУ ---
  const logout = async () => {
    try {
        await api.post('/logout'); 
    } catch (e) {
        console.warn("Logout API call failed, but clearing local state anyway.", e);
    }
    setToken(null);
    setUser(null); 
  };

  const contextValue: AuthContextType = {
    user,
    token,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    isLoading,
    isAuthInitialized,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// --- 4. Хук для використання Context ---

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};