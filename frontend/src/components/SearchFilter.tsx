// src/components/SearchFilter.tsx

"use client";

import { useState } from "react";
import { Box, TextField, MenuItem, Stack, Button } from "@mui/material";
import { Genre, Publisher } from "@/types";

interface SearchFilterProps {
  genres?: Genre[];
  publishers?: Publisher[];
  onSearch: (query: string, genreId?: number, publisherId?: number) => void;
}

export default function SearchFilter({ genres = [], publishers = [], onSearch }: SearchFilterProps) {
  const [query, setQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<number | "">("");
  const [selectedPublisher, setSelectedPublisher] = useState<number | "">("");

  const handleSearch = () => {
    onSearch(
      query,
      selectedGenre === "" ? undefined : selectedGenre,
      selectedPublisher === "" ? undefined : selectedPublisher
    );
  };

  return (
    // 🚩 ВИПРАВЛЕННЯ: Додано зовнішній відступ (margin)
    <Box sx={{ m: 3, mb: 4 }}> 
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="center">
        <TextField
          label="Пошук"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          size="small"
          fullWidth
          variant="outlined"
        />

        <TextField
          select
          label="Жанр"
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(Number(e.target.value))}
          size="small"
          fullWidth
          variant="outlined"
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
          size="small"
          fullWidth
          variant="outlined"
        >
          <MenuItem value="">Усі видавництва</MenuItem>
          {publishers.map((pub) => (
            <MenuItem key={pub.id} value={pub.id}>
              {pub.name}
            </MenuItem>
          ))}
        </TextField>

        <Button variant="contained" fullWidth onClick={handleSearch}>
          Знайти
        </Button>
      </Stack>
    </Box>
  );
}