// src/types.ts

export interface Role {
  id: number;
  name: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role_id: number; 
  role: Role;
  avatar: string;
  // Якщо ми завантажуємо профіль автора разом з користувачем
  author?: Author | null; 
}

export interface Publisher {
  id: number;
  name: string;
}

export interface Author {
  id: number;
  user: User;
}

export interface Genre {
  id: number;
  name: string;
}

export interface Book {
  id: number;
  title: string;
  author: Author;
  publisher: Publisher;
  genres: Genre[];
  year: string;
  description: string;
  cover: string;
  price: number;
  is_blocked: boolean;
}

// 🚩 НОВИЙ ТИП: Модель коментаря
export interface Comment {
    id: number;
    user_id: number;
    book_id: number;
    content: string;
    rating: number | null; // Рейтинг від 1 до 5
    parent_id: number | null; // Для відповідей на коментарі
    created_at: string;
    
    // Завантажений зв'язок з користувачем (включаючи роль та потенційно профіль автора)
    user: User; 
}

// 🚩 НОВИЙ ТИП: Структура відповіді для пагінованих списків
export interface PaginatedResponse<T> {
    current_page: number;
    data: T[]; // Масив основних елементів (наприклад, Book[] або Comment[])
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: { url: string | null; label: string; active: boolean; }[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
}