import { useState, useEffect } from 'react';

/**
 * Хук для дебаунсу значення
 * @param value - значення для дебаунсу
 * @param delay - затримка в мілісекундах
 * @returns дебаунсне значення
 */
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

