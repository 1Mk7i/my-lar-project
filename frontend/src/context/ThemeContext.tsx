"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ThemeProvider, CssBaseline, createTheme, PaletteMode } from '@mui/material';
import { STORAGE_KEYS } from '@/constants';
import { getLocalStorage, setLocalStorage } from '@/utils';

interface ThemeContextType {
  mode: PaletteMode;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeContextProvider = ({ children }: { children: ReactNode }) => {
  // Використовуємо функцію ініціалізації, щоб уникнути hydration mismatch
  // На сервері завжди буде 'light', на клієнті - значення з localStorage
  const [mode, setMode] = useState<PaletteMode>(() => {
    // На сервері завжди повертаємо 'light'
    if (typeof window === 'undefined') {
      return 'light';
    }
    // На клієнті перевіряємо localStorage
    const savedMode = getLocalStorage(STORAGE_KEYS.THEME_MODE) as PaletteMode;
    return savedMode || 'light';
  });

  // Синхронізуємо з localStorage при зміні
  useEffect(() => {
    const savedMode = getLocalStorage(STORAGE_KEYS.THEME_MODE) as PaletteMode;
    if (savedMode && savedMode !== mode) {
      setMode(savedMode);
    }
  }, []);

  const toggleTheme = () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    setMode(newMode);
    setLocalStorage(STORAGE_KEYS.THEME_MODE, newMode);
  };

  const theme = createTheme({
    palette: {
      mode,
    },
  });

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeContextProvider');
  }
  return context;
};

