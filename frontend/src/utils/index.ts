/**
 * Utility Functions
 * Загальні утилітарні функції для використання по всьому додатку
 */

/**
 * Форматує число як ціну в гривнях
 */
export const formatPrice = (price: number): string => {
  return `${price} грн`;
};

/**
 * Форматує дату в локальний формат
 */
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleString('uk-UA');
};

/**
 * Обрізає текст до певної довжини з додаванням "..."
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

/**
 * Перевіряє чи є значення порожнім
 */
export const isEmpty = (value: any): boolean => {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
};

/**
 * Безпечне отримання значення з localStorage
 */
export const getLocalStorage = (key: string): string | null => {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(key);
  } catch (error) {
    console.error(`Error reading from localStorage: ${error}`);
    return null;
  }
};

/**
 * Безпечне встановлення значення в localStorage
 */
export const setLocalStorage = (key: string, value: string): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    console.error(`Error writing to localStorage: ${error}`);
  }
};

/**
 * Безпечне видалення значення з localStorage
 */
export const removeLocalStorage = (key: string): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing from localStorage: ${error}`);
  }
};

/**
 * Дебаунс функція
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Генерує URL для зображення
 */
export const getImageUrl = (path: string | null | undefined): string => {
  if (!path) return '/placeholder.png';
  if (path.startsWith('http')) return path;
  if (path.startsWith('/')) return path;
  return `${process.env.NEXT_PUBLIC_STORAGE_URL || ''}${path}`;
};

