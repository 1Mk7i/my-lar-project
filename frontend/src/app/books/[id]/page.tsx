// app/books/[id]/page.tsx

"use client";

import { useState, useEffect } from "react";
import { useParams, notFound } from "next/navigation";
import { Book } from "@/types";
import { Typography, Button, Box, Grid, CircularProgress, Alert } from "@mui/material";
import { useAuth } from "@/context/AuthContext"; 
import Link from "next/link"; 
import PersonIcon from '@mui/icons-material/Person';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import CreateIcon from '@mui/icons-material/Create';

// Визначаємо базовий URL API (має бути NEXT_PUBLIC_...)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";

// Компонент для відображення статусу користувача та налагодження прав доступу
// bookAuthorId: ID користувача, який є автором книги
const UserStatusIndicator = ({ user, bookAuthorId }: { user: any, bookAuthorId: number | undefined }) => {
    if (!user) {
        return (
             <Alert severity="warning" sx={{ mb: 3 }}>
                Ви не автентифіковані. Доступне лише читання.
             </Alert>
        );
    }
    
    let statusText = `Роль: ${user.role.name} (ID: ${user.role.id})`;
    let statusIcon = <PersonIcon />;
    let severity: 'info' | 'success' | 'warning' = 'info';

    if (user.role.id === 3) { // Адмін
        statusText += " - Повний доступ до редагування.";
        statusIcon = <AdminPanelSettingsIcon />;
        severity = 'success';
    } else if (user.role.id === 2) { // Автор
        statusIcon = <CreateIcon />;
        
        // Перевіряємо, чи ID поточного користувача збігається з ID автора книги
        if (bookAuthorId && user.id === bookAuthorId) {
             statusText += " - Ви є автором цієї книги. Доступно редагування.";
             severity = 'success';
        } else {
             statusText += ` - ID автора книги: ${bookAuthorId ?? 'N/A'}. Ви не є автором. Редагування заборонено.`;
             severity = 'warning';
        }
    }

    return (
        <Alert severity={severity} icon={statusIcon} sx={{ mb: 3, wordBreak: 'break-word' }}>
            <Typography variant="body2">
                Увійшли як: **{user.name}** (User ID: {user.id})
            </Typography>
            <Typography variant="body2" sx={{ mt: 0.5 }}>
                {statusText}
            </Typography>
        </Alert>
    );
};


export default function BookPage() {
  
  const { user, isLoading: isAuthLoading } = useAuth(); 
  const params = useParams(); 
  const bookId = params.id; 

  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!bookId || Array.isArray(bookId)) {
        setError("Некоректний ідентифікатор книги.");
        setLoading(false);
        return;
    }

    const apiUrl = `${API_BASE_URL}/books/${bookId}`;

    // Завантаження даних книги
    fetch(apiUrl, {
        headers: { 'Accept': 'application/json' }
    })
    .then(async (res) => {
        if (res.status === 404) {
            throw new Error('404_NOT_FOUND');
        }
        
        if (!res.ok) {
            const errorText = await res.text();
            console.error(`[CSR FETCH] Помилка HTTP ${res.status}: ${errorText}`);
            throw new Error(`Не вдалося завантажити книгу. Статус: ${res.status}`);
        }
        
        return res.json();
    })
    .then((data: Book) => {
        setBook(data);
    })
    .catch((err) => {
        if (err.message === '404_NOT_FOUND') {
            notFound();
        }
        console.error("[CSR FETCH] Критична помилка:", err);
        setError("Виникла помилка під час завантаження книги.");
    })
    .finally(() => {
        setLoading(false);
    });

  }, [bookId]); 

  const userRole = user?.role.id;
  // Отримуємо ID користувача-автора для порівняння та передачі в індикатор
  const bookAuthorUserId = book?.author?.user.id; 

  // Визначення прав на редагування
  const isBookAuthor = userRole === 2 && book && bookAuthorUserId === user?.id;
  
  const canEdit = 
      userRole === 3 || // Адмін
      isBookAuthor;
  
  // --- ЕКРАН ЗАВАНТАЖЕННЯ, ПОМИЛКИ ТА ВІДСУТНОСТІ ДАНИХ ---
  
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
  
  if (!book) {
      return null;
  }
  
  // --- РЕНДЕРИНГ З ДАНИМИ ---
  return (
    <Box sx={{ p: 4 }}>
        
      {/* 🚩 Індикатор статусу користувача */}
      <UserStatusIndicator user={user} bookAuthorId={bookAuthorUserId} />
      
      {/* КНОПКА РЕДАГУВАННЯ - УМОВНЕ ВІДОБРАЖЕННЯ */}
      {canEdit && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
              <Link href={`/books/${book.id}/edit`} style={{ textDecoration: 'none' }}>
                  <Button variant="contained" color="secondary">
                      Редагувати вміст
                  </Button>
              </Link>
          </Box>
      )}

      <Grid container spacing={4}>
        
        {/* Колонка для обкладинки */}
        <Box
          sx={{
            width: { xs: '100%', md: '33.33%' }, 
            padding: '16px', 
            boxSizing: 'border-box', 
          }}
        >
          <img
            src={book.cover || "/placeholder.png"}
            alt={book.title}
            style={{ width: '100%', height: 'auto', maxHeight: '400px', objectFit: 'cover', borderRadius: '8px' }}
          />
        </Box>

        {/* Колонка для інформації */}
        <Box
          sx={{
            width: { xs: '100%', md: '66.66%' }, 
            padding: '16px', 
            boxSizing: 'border-box',
          }}
        >
          <Typography variant="h3" component="h1" gutterBottom>
            {book.title}
          </Typography>
          
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            Автор: **{book.author?.user?.name || "Невідомий"}**
          </Typography>
          
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            Видавництво: **{book.publisher?.name || "Невідоме"}**
          </Typography>

          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Рік видання: {book.year}
          </Typography>

          <Typography variant="body1" paragraph>
            {book.description}
          </Typography>
          
          <Typography variant="h5" color="primary" sx={{ mt: 2, mb: 2 }}>
            Ціна: {book.price} грн
          </Typography>
          
          {user ? (
            <Button 
                variant="contained" 
                color="primary" 
                size="large" 
                sx={{ mt: 2 }}
            >
              Додати до кошика
            </Button>
          ) : (
             <Alert severity="info" sx={{ mt: 2 }}>
                Увійдіть, щоб додати книгу до кошика.
             </Alert>
          )}

        </Box>
      </Grid>
    </Box>
  );
}