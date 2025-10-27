// lib/api/types.ts
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface Book {
  id: number
  title: string
  author: string
  description: string
  isbn: string
  year: number
  cover_image: string
  price: number
  pages: number
  language: string
  status: 'available' | 'out_of_stock'
}

export interface BooksResponse {
  success: boolean
  books: Book[]
  count: number
  filters?: {
    search?: string
    status?: string
    language?: string
    sort_by?: string
    sort_order?: string
  }
}

export interface TestConnectionResponse {
  message: string
  status: string
  timestamp: string
}
