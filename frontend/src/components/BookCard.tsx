"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box
} from "@mui/material";
import Chip from "@mui/material/Chip";
import { Book } from "@/types";

type BookCardProps = {
  book: Book;
};

export default function BookCard({ book }: BookCardProps) {
  return (
    <Link
      href={`/books/${book.id}`}
      style={{ textDecoration: "none" }}
    >
      <Card sx={{ position: "relative", cursor: "pointer" }}>
        {!!book.is_blocked && (
          <Chip
            label="Заблоковано"
            color="error"
            size="small"
            sx={{ position: "absolute", top: 8, right: 8, zIndex: 1 }}
          />
        )}

        <CardMedia
          component="img"
          height="200"
          image={book.cover || "/placeholder.png"}
          alt={book.title}
        />

        <CardContent>
          <Typography variant="h6">
            {book.title} ({book.year})
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Автор: {book.author?.user?.name || "Невідомий автор"}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Видавництво: {book.publisher.name}
          </Typography>

          <Box sx={{ mt: 1, display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            {book.genres.map(genre => (
              <Chip key={genre.id} label={genre.name} size="small" />
            ))}
          </Box>

          <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
            {book.price} грн
          </Typography>
        </CardContent>
      </Card>
    </Link>
  );
}
