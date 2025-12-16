// components/BookGrid.tsx
"use client";
import { Grid, Box } from "@mui/material"; 
import BookCard from "./BookCard";
import { Book } from "@/types";

interface BookGridProps {
    // Припускаємо, що можуть прийти: або чистий масив, або об'єкт пагінації з властивістю data
    books: Book[] | { data: Book[] } | any; 
}

export default function BookGrid({ books }: BookGridProps) {
    
    let booksArray: Book[] = [];
    
    // Обробка об'єкта пагінації
    if (Array.isArray(books)) {
        booksArray = books;
    } else if (books && typeof books === 'object' && Array.isArray(books.data)) {
        booksArray = books.data;
    } 

    return (
        // Використовуємо Grid Container (без змін)
        <Grid container display="flex" justifyContent="center" spacing={4}>
            {booksArray.map(book => (
                // 🚩 ВИПРАВЛЕННЯ КОНФЛІКТУ: 
                // Використовуємо Box, щоб він діяв як Grid item.
                // Властивості width та padding імітують поведінку Grid item, 
                // але уникають помилки TypeScript у Grid.
                <Box 
                    key={book.id}
                    // Властивості адаптивності, які імітують Grid item
                    sx={{
                        padding: 2, // Відступ 4 одиниці (як spacing={4})
                        width: {
                            xs: '100%',
                            sm: '50%',
                            md: '33.33%',
                            lg: '25%', // 4 картки в рядок
                        },
                    }}
                >
                    <BookCard book={book} />
                </Box>
            ))}
        </Grid>
    );
}