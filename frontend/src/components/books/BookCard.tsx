"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  CardActionArea
} from "@mui/material";
import Chip from "@mui/material/Chip";
import { Book } from "@/types";

type BookCardProps = {
  book: Book;
};

export default function BookCard({ book }: BookCardProps) {
  return (
    <Card 
      sx={{ 
        position: "relative", 
        cursor: "pointer",
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: 8
        },
        boxShadow: 2
      }}
    >
      <Link
        href={`/books/${book.id}`}
        style={{ textDecoration: "none", flex: 1, display: 'flex', flexDirection: 'column' }}
      >
        <CardActionArea sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
          {!!book.is_blocked && (
            <Chip
              label="Заблоковано"
              color="error"
              size="small"
              sx={{ 
                position: "absolute", 
                top: 8, 
                right: 8, 
                zIndex: 1,
                fontWeight: 'bold'
              }}
            />
          )}

          <CardMedia
            component="img"
            height="280"
            image={book.cover || "/placeholder.png"}
            alt={book.title}
            sx={{
              objectFit: 'cover',
              backgroundColor: 'grey.200'
            }}
          />

          <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 'bold',
                mb: 1,
                minHeight: '3em',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}
            >
              {book.title}
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              {book.year && `(${book.year})`}
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              <strong>Автор:</strong> {book.author?.user?.name || "Невідомий автор"}
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
              <strong>Видавництво:</strong> {book.publisher?.name || "Невідомо"}
            </Typography>

            <Box sx={{ mt: 'auto', mb: 2, display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {book.genres?.slice(0, 3).map(genre => (
                <Chip 
                  key={genre.id} 
                  label={genre.name} 
                  size="small" 
                  color="primary"
                  variant="outlined"
                  sx={{ fontSize: '0.7rem' }}
                />
              ))}
              {book.genres && book.genres.length > 3 && (
                <Chip 
                  label={`+${book.genres.length - 3}`} 
                  size="small" 
                  variant="outlined"
                  sx={{ fontSize: '0.7rem' }}
                />
              )}
            </Box>

            <Typography 
              variant="h5" 
              color="primary" 
              sx={{ 
                mt: 'auto',
                fontWeight: 'bold',
                pt: 1,
                borderTop: '1px solid',
                borderColor: 'divider'
              }}
            >
              {book.price || 0} грн
            </Typography>
          </CardContent>
        </CardActionArea>
      </Link>
    </Card>
  );
}
