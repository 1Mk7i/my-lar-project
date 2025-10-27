import { BaseApiService } from './base.service'
import { API_ENDPOINTS } from '../config'
import { BooksResponse, Book } from '../types'

export class BooksService extends BaseApiService {
  async getBooks(params?: {
    search?: string
    status?: string
    language?: string
    sort_by?: string
    sort_order?: string
  }): Promise<BooksResponse> {
    return this.get<BooksResponse>(API_ENDPOINTS.books.list, params)
  }

  async getBook(id: number): Promise<{ success: boolean; book: Book }> {
    return this.get(API_ENDPOINTS.books.show(id))
  }
}

export const booksService = new BooksService()
