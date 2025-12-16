"use client";

import { useState, useEffect } from "react";
import { useParams, notFound } from "next/navigation";
import { Book } from "@/types";
import { Typography, Button, Box, CircularProgress, Alert, Snackbar, Chip } from "@mui/material";
import { useAuth } from "@/context/AuthContext"; 
import Link from "next/link"; 
import PersonIcon from '@mui/icons-material/Person';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import CreateIcon from '@mui/icons-material/Create';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { CommentSection } from "@/components";
import api from "@/lib/api";

// Індикатор статусу користувача
const UserStatusIndicator = ({ user, bookAuthorId }: { user: any, bookAuthorId: number | undefined }) => {
    if (!user) return <Alert severity="warning" sx={{ mb: 3 }}>Ви не автентифіковані. Доступне лише читання.</Alert>;
    
    const isAdmin = user.role?.id === 3;
    const isAuthor = user.role?.id === 2;
    const isBookOwner = bookAuthorId && user.id === bookAuthorId;

    return (
        <Alert 
            severity={isAdmin || isBookOwner ? "success" : "info"} 
            icon={isAdmin ? <AdminPanelSettingsIcon /> : <PersonIcon />} 
            sx={{ mb: 3 }}
        >
            <Typography variant="body2">Увійшли як: <strong>{user.name}</strong></Typography>
            <Typography variant="body2">
                {isAdmin ? "Адміністратор - повний доступ." : isBookOwner ? "Ви автор цієї книги." : "Перегляд книги."}
            </Typography>
        </Alert>
    );
};

export default function BookPage() {
  const { user, token, isAuthInitialized } = useAuth(); 
  const params = useParams(); 
  const bookId = params.id; 

  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" as "success" | "error" });

  useEffect(() => {
    if (!bookId) return;
    api.get(`/books/${bookId}`)
      .then(res => setBook(res.data))
      .catch(err => err.response?.status === 404 ? notFound() : console.error(err))
      .finally(() => setLoading(false));
  }, [bookId]);

  const handleAddToCart = async () => {
    if (!token || !book) return;
    setAddingToCart(true);
    try {
        await api.post(`/cart/add`, { book_id: book.id, quantity: 1 }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setSnackbar({ open: true, message: "Додано до кошика!", severity: "success" });
    } catch (err: any) {
        console.error("Помилка додавання до кошика:", err);
        const errorMessage = err.response?.data?.message || 
                            err.response?.data?.error || 
                            err.message || 
                            "Помилка додавання до кошика";
        setSnackbar({ open: true, message: errorMessage, severity: "error" });
    } finally {
        setAddingToCart(false);
    }
  };

  if (loading || !isAuthInitialized) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;
  if (!book) return null;

  const canEdit = user?.role?.id === 3 || (user?.role?.id === 2 && book.author?.user?.id === user?.id);

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: '1200px', mx: 'auto' }}>
      <UserStatusIndicator user={user} bookAuthorId={book.author?.user?.id} />
      
      {canEdit && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
          <Button component={Link} href={`/books/${book.id}/edit`} variant="contained" color="secondary" startIcon={<CreateIcon />}>
            Редагувати
          </Button>
        </Box>
      )}

      {/* ЗАМІСТЬ GRID ВИКОРИСТОВУЄМО CSS GRID ЧЕРЕЗ BOX (уникаємо помилок типів) */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', md: '1fr 2fr' }, 
        gap: 4,
        mb: 6
      }}>
        {/* Обкладинка */}
        <Box sx={{ textAlign: 'center' }}>
          <Box
            component="img"
            src={book.cover || "/placeholder.png"}
            alt={book.title}
            sx={{ 
              width: '100%', 
              maxWidth: '400px', 
              borderRadius: 3, 
              boxShadow: 6,
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'scale(1.02)'
              }
            }}
          />
        </Box>

        {/* Інформація */}
        <Box>
          <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 2, color: 'primary.main' }}>
            {book.title}
          </Typography>
          
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              <strong>Автор:</strong> {book.author?.user?.name || "Невідомий"}
            </Typography>
            {book.year && (
              <Typography variant="body1" color="text.secondary" gutterBottom>
                <strong>Рік видання:</strong> {book.year}
              </Typography>
            )}
            {book.publisher && (
              <Typography variant="body1" color="text.secondary" gutterBottom>
                <strong>Видавництво:</strong> {book.publisher.name}
              </Typography>
            )}
            {book.genres && book.genres.length > 0 && (
              <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {book.genres.map(genre => (
                  <Chip 
                    key={genre.id} 
                    label={genre.name} 
                    size="small" 
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Box>
            )}
          </Box>
          
          <Typography 
            variant="body1" 
            sx={{ 
              my: 3, 
              lineHeight: 1.8,
              fontSize: '1.1rem',
              color: 'text.primary'
            }}
          >
            {book.description || 'Опис відсутній'}
          </Typography>
          
          <Box sx={{ mb: 3 }}>
            <Typography variant="h4" color="primary" sx={{ fontWeight: 'bold', mb: 3 }}>
              {book.price || 0} грн
            </Typography>
            
            {user ? (
              <Button 
                  variant="contained" 
                  size="large" 
                  onClick={handleAddToCart}
                  disabled={addingToCart}
                  startIcon={addingToCart ? <CircularProgress size={20} color="inherit" /> : <ShoppingCartIcon />}
                  sx={{ 
                    px: 6, 
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    boxShadow: 4,
                    '&:hover': {
                      boxShadow: 6,
                      transform: 'translateY(-2px)',
                      transition: 'all 0.3s ease'
                    }
                  }}
              >
                {addingToCart ? 'Додавання...' : 'Додати до кошика'}
              </Button>
            ) : (
              <Alert severity="info" sx={{ mt: 2 }}>
                Увійдіть, щоб купувати книги.
              </Alert>
            )}
          </Box>
        </Box>
      </Box>

      <Box sx={{ mt: 8 }}>
        <CommentSection bookId={book.id} />
      </Box>

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}