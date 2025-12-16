"use client";

import { useEffect, useState } from "react";
import { CircularProgress, Alert, Box, Pagination, Typography } from "@mui/material"; 
import { BookGrid, SearchFilter } from "@/components";
import api from "@/lib/api";
import { Book, Genre, Publisher, PaginatedResponse } from "@/types";
import { PAGINATION } from "@/constants";

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
  const [itemsPerPage, setItemsPerPage] = useState<number>(PAGINATION.DEFAULT_ITEMS_PER_PAGE);

  const fetchBooks = (filters: Filters, page: number = 1, perPage: number = itemsPerPage) => {
    setLoading(true);
    setError(null);
    setCurrentFilters(filters);

    const params: Record<string, any> = { page, per_page: perPage };
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

  const handleItemsPerPageChange = (items: number) => {
    setItemsPerPage(items);
    fetchBooks(currentFilters, 1, items);
  };

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
    fetchBooks(filters, 1, itemsPerPage);
  };
  
  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    fetchBooks(currentFilters, page, itemsPerPage);
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
    <Box sx={{ minHeight: '100vh' }}>
      <SearchFilter
        genres={genres}
        publishers={publishers}
        onSearch={handleSearch}
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={handleItemsPerPageChange}
      />
      
      {/* Компонент пагінації (зверху) */}
      {lastPage > 1 && (
        <Box display="flex" justifyContent="center" mt={2} mb={4}>
          <Pagination
            count={lastPage}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            size="large"
            sx={{
              '& .MuiPaginationItem-root': {
                fontSize: '1.1rem'
              }
            }}
          />
        </Box>
      )}

      {/* Передаємо лише масив книг */}
      {booksToDisplay.length > 0 ? (
        <BookGrid books={booksToDisplay} />
      ) : (
        <Box sx={{ textAlign: 'center', mt: 10, p: 4 }}>
          <Typography variant="h5" color="text.secondary">
            Книги не знайдено
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
            Спробуйте змінити параметри пошуку
          </Typography>
        </Box>
      )}
      
      {/* Компонент пагінації (знизу) */}
      {lastPage > 1 && (
        <Box display="flex" justifyContent="center" mt={6} mb={4}>
          <Pagination
            count={lastPage}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            size="large"
            sx={{
              '& .MuiPaginationItem-root': {
                fontSize: '1.1rem'
              }
            }}
          />
        </Box>
      )}
    </Box>
  );
}