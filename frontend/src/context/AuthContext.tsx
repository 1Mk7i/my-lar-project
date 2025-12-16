// src/context/AuthContext.tsx

"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types'; 
import api from '@/lib/api';
import { STORAGE_KEYS } from '@/constants';
import { getLocalStorage, setLocalStorage, removeLocalStorage } from '@/utils'; 

const isServer = typeof window === 'undefined';

// --- 1. Визначення типів ---
interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, password_confirmation: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  isAuthInitialized: boolean; 
}

// --- 2. Створення Context ---
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// --- 3. Провайдер Context ---

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  // Починаємо з false, і встановлюємо true тільки після завершення клієнтської ініціалізації
  const [isAuthInitialized, setIsAuthInitialized] = useState(false); 

  // Ініціалізація: Завантаження токена та користувача з Local Storage
  useEffect(() => {
    if (!isServer) {
        const storedToken = getLocalStorage(STORAGE_KEYS.AUTH_TOKEN);
        const storedUser = getLocalStorage(STORAGE_KEYS.USER);

        if (storedToken) {
            setToken(storedToken);
            api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
            
            if (storedUser) {
                try {
                    setUser(JSON.parse(storedUser));
                } catch (e) {
                    console.error("Failed to parse stored user data:", e);
                    removeLocalStorage(STORAGE_KEYS.AUTH_TOKEN);
                    removeLocalStorage(STORAGE_KEYS.USER);
                    delete api.defaults.headers.common['Authorization'];
                }
            }
        }
    }
    
    // Встановлюємо ініціалізацію в true, незалежно від того, чи знайшли ми токен,
    // це дозволяє компонентам, як-от Header, рендерити фінальний стан.
    setIsAuthInitialized(true); 
  }, []);

  // ЛОГІКА ТОКЕНА: Оновлення Local Storage та Axios при зміні стану
  useEffect(() => {
    // Виконуємо лише після ініціалізації та лише на клієнті
    if (!isAuthInitialized || isServer) return; 

    if (token) {
      setLocalStorage(STORAGE_KEYS.AUTH_TOKEN, token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`; 
    } else {
      removeLocalStorage(STORAGE_KEYS.AUTH_TOKEN);
      delete api.defaults.headers.common['Authorization'];
    }
    
    if (user) {
        setLocalStorage(STORAGE_KEYS.USER, JSON.stringify(user)); 
    } else {
        removeLocalStorage(STORAGE_KEYS.USER);
    }
    
  }, [token, user, isAuthInitialized]);


  // --- Логіка ВХОДУ ---
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await api.post('/login', { email, password });
      
      const newToken = response.data.token;
      
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