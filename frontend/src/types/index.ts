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
