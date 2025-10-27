export * from './types'
export * from './config'
export { booksService } from './services/books.service'
export { systemService } from './services/system.service'

// Backward compatibility
import { booksService } from './services/books.service'
import { systemService } from './services/system.service'

export const apiClient = {
  testConnection: () => systemService.testConnection(),
  getBooks: (params?: any) => booksService.getBooks(params),
  getBook: (id: number) => booksService.getBook(id),
}
