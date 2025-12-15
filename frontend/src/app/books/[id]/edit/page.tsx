// app/books/[id]/edit/page.tsx

"use client";

import { useState, useEffect } from "react";
import { useParams, notFound, useRouter } from "next/navigation";
import { Book, Genre, Publisher, Author } from "@/types";
import { Box, CircularProgress, Alert, Typography } from "@mui/material";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api"; // Припускаємо, що Axios налаштований у src/lib/api.ts
import EditBookForm from "./EditBookForm"; // Компонент, який ми створимо далі

// Визначаємо базовий URL API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";

// Тип для всіх даних, необхідних формі
interface EditData {
    book: Book;
    genres: Genre[];
    publishers: Publisher[];
    authors: Author[];
}

export default function EditBookPage() {
    const { user, isLoading: isAuthLoading } = useAuth();
    const params = useParams();
    const router = useRouter();
    const bookId = params.id; 

    const [data, setData] = useState<EditData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // 1. Завантаження всіх необхідних даних
    useEffect(() => {
        if (!bookId || Array.isArray(bookId)) {
            setError("Некоректний ідентифікатор книги.");
            setLoading(false);
            return;
        }

        const fetchAllData = async () => {
            try {
                // Використовуємо Promise.all для паралельного завантаження
                const [bookRes, genresRes, publishersRes, authorsRes] = await Promise.all([
                    api.get(`/books/${bookId}`),
                    api.get('/genres'),
                    api.get('/publishers'),
                    api.get('/authors'),
                ]);

                const bookData: Book = bookRes.data;
                const userRole = user?.role.id;

                // Перевірка прав доступу на фронтенді
                const canEdit = 
                    userRole === 3 || // Адмін
                    (userRole === 2 && bookData.author?.user.id === user?.id); // Автор своєї книги

                if (!canEdit) {
                    // Якщо користувач не має прав, перенаправляємо
                    router.replace(`/books/${bookId}`);
                    return;
                }

                setData({
                    book: bookData,
                    genres: genresRes.data,
                    publishers: publishersRes.data,
                    authors: authorsRes.data,
                });
                
            } catch (err: any) {
                if (err.response?.status === 404) {
                    return notFound();
                }
                console.error("Помилка завантаження даних для форми:", err);
                setError("Не вдалося завантажити дані для редагування.");
            } finally {
                setLoading(false);
            }
        };

        // Запускаємо завантаження лише після ініціалізації автентифікації
        if (!isAuthLoading && user) {
             fetchAllData();
        } else if (!isAuthLoading && !user) {
             // Якщо користувач не автентифікований, перенаправляємо його
             router.replace(`/books/${bookId}`); 
        }

    }, [bookId, isAuthLoading, user, router]);


    // 2. Екрани завантаження та помилок
    if (loading || isAuthLoading) {
        return (
            <Box display="flex" justifyContent="center" mt={4}>
                <CircularProgress />
            </Box>
        );
    }
    
    if (error) {
        return <Alert severity="error">{error}</Alert>;
    }
    
    // 3. Рендеринг форми
    if (data) {
        return (
            <Box sx={{ p: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Редагування книги: {data.book.title}
                </Typography>
                <EditBookForm 
                    initialData={data.book}
                    allGenres={data.genres}
                    allPublishers={data.publishers}
                    allAuthors={data.authors}
                />
            </Box>
        );
    }

    return null; 
}