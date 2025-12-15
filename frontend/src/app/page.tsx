"use client";

import { useEffect, useState } from "react";
import { CircularProgress, Alert, Box, Pagination } from "@mui/material"; 
import BookGrid from "@/components/BookGrid";
import SearchFilter from "@/components/SearchFilter";
import api from "@/lib/api";
import { Book, Genre, Publisher } from "@/types";

interface PaginatedResponse<T> {
  current_page: number;
  data: T[];
  last_page: number;
}
type BooksState = PaginatedResponse<Book> | null;

interface Filters {
    query?: string;
    genre_id?: number;
    publisher_id?: number;
}

export default function Home() {
  const [paginatedBooks, setPaginatedBooks] = useState<BooksState>(null); 
  const [genres, setGenres] = useState<Genre[]>([]);
  const [publishers, setPublishers] = useState<Publisher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [currentFilters, setCurrentFilters] = useState<Filters>({});

  const fetchBooks = (filters: Filters, page: number = 1) => {
    setLoading(true);
    setError(null);
    setCurrentFilters(filters);

    const params: Record<string, any> = { page };
    if (filters.query) params.query = filters.query;
    if (filters.genre_id) params.genre_id = filters.genre_id;
    if (filters.publisher_id) params.publisher_id = filters.publisher_id;

    api.get("/books", { params })
      .then(res => {
        setPaginatedBooks(res.data as PaginatedResponse<Book>); 
      })
      .catch(err => {
        console.error(err);
        setError("Помилка пошуку");
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    Promise.all([
      api.get("/genres"),
      api.get("/publishers")
    ])
      .then(([genresRes, publishersRes]) => {
        setGenres(genresRes.data);
        setPublishers(publishersRes.data);
      })
      .catch(err => {
        console.error('Full error:', err);
        setError("Помилка завантаження основних даних");
      });

    fetchBooks({}, 1);
  
  }, []);

  const handleSearch = (query: string, genreId?: number, publisherId?: number) => {
    const filters: Filters = { query, genre_id: genreId, publisher_id: publisherId };
    fetchBooks(filters, 1);
  };
  
  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    fetchBooks(currentFilters, page);
  };


  if (loading && !paginatedBooks) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }
  
  const booksToDisplay = paginatedBooks?.data || [];
  const currentPage = paginatedBooks?.current_page || 1;
  const lastPage = paginatedBooks?.last_page || 1;
  
  return (
    <div>
      <SearchFilter
        genres={genres}
        publishers={publishers}
        onSearch={handleSearch}
      />
      
      {/* Компонент пагінації (зверху) */}
      {lastPage > 1 && (
        <Box display="flex" justifyContent="center" mt={4} mb={4}>
          <Pagination
            count={lastPage}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      )}

      {/* Передаємо лише масив книг */}
      <BookGrid books={booksToDisplay} /> 
      
      {/* Компонент пагінації (знизу) */}
      {lastPage > 1 && (
        <Box display="flex" justifyContent="center" mt={4} mb={4}>
          <Pagination
            count={lastPage}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      )}
    </div>
  );
}