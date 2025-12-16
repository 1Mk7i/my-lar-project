// src/components/SearchFilter.tsx

"use client";

import { useState, useEffect } from "react";
import { Box, TextField, MenuItem, Stack, Button, FormControl, InputLabel, Select } from "@mui/material";
import { Genre, Publisher } from "@/types";
import SearchIcon from '@mui/icons-material/Search';
import { SEARCH, PAGINATION } from "@/constants";

interface SearchFilterProps {
  genres?: Genre[];
  publishers?: Publisher[];
  onSearch: (query: string, genreId?: number, publisherId?: number) => void;
  itemsPerPage?: number;
  onItemsPerPageChange?: (items: number) => void;
}

export default function SearchFilter({ 
  genres = [], 
  publishers = [], 
  onSearch,
  itemsPerPage,
  onItemsPerPageChange
}: SearchFilterProps) {
  const [query, setQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<number | "">("");
  const [selectedPublisher, setSelectedPublisher] = useState<number | "">("");

  // Debounce для пошуку
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(
        query,
        selectedGenre === "" ? undefined : selectedGenre,
        selectedPublisher === "" ? undefined : selectedPublisher
      );
    }, SEARCH.DEBOUNCE_DELAY);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, selectedGenre, selectedPublisher]);

  const handleSearch = () => {
    onSearch(
      query,
      selectedGenre === "" ? undefined : selectedGenre,
      selectedPublisher === "" ? undefined : selectedPublisher
    );
  };

  return (
    <Box 
      sx={{ 
        m: 3, 
        mb: 4,
        p: 3,
        backgroundColor: 'background.paper',
        borderRadius: 3,
        boxShadow: 2
      }}
    > 
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="center">
        <TextField
          label="Пошук книг"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSearch();
            }
          }}
          size="medium"
          fullWidth
          variant="outlined"
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              backgroundColor: 'background.default'
            }
          }}
        />

        <TextField
          select
          label="Жанр"
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(Number(e.target.value))}
          size="medium"
          fullWidth
          variant="outlined"
          sx={{
            '& .MuiOutlinedInput-root': {
              backgroundColor: 'background.default'
            }
          }}
        >
          <MenuItem value="">Усі жанри</MenuItem>
          {genres.map((genre) => (
            <MenuItem key={genre.id} value={genre.id}>
              {genre.name}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          label="Видавництво"
          value={selectedPublisher}
          onChange={(e) => setSelectedPublisher(Number(e.target.value))}
          size="medium"
          fullWidth
          variant="outlined"
          sx={{
            '& .MuiOutlinedInput-root': {
              backgroundColor: 'background.default'
            }
          }}
        >
          <MenuItem value="">Усі видавництва</MenuItem>
          {publishers.map((pub) => (
            <MenuItem key={pub.id} value={pub.id}>
              {pub.name}
            </MenuItem>
          ))}
        </TextField>

        {onItemsPerPageChange && (
          <FormControl fullWidth size="medium">
            <InputLabel>На сторінці</InputLabel>
            <Select
              value={itemsPerPage || 12}
              label="На сторінці"
              onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
              sx={{
                backgroundColor: 'background.default'
              }}
            >
              {PAGINATION.ITEMS_PER_PAGE_OPTIONS.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        <Button 
          variant="contained" 
          fullWidth 
          onClick={handleSearch}
          size="large"
          startIcon={<SearchIcon />}
          sx={{
            py: 1.5,
            fontSize: '1rem',
            fontWeight: 'bold',
            boxShadow: 3,
            '&:hover': {
              boxShadow: 5
            }
          }}
        >
          Знайти
        </Button>
      </Stack>
    </Box>
  );
}