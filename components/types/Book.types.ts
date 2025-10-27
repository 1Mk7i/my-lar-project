export interface Book {
  id: number
  title: string
  author: string
  description: string
  isbn: string
  year: number
  publication_year?: number
  cover_image: string | null
  price: number
  pages: number
  language: string
  status: 'available' | 'out_of_stock'
}