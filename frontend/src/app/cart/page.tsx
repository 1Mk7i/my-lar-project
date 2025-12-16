"use client";

import { useEffect, useState, useCallback } from "react";
import { 
  Typography, 
  Button, 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableRow, 
  IconButton, 
  Box, 
  Container, 
  CircularProgress, 
  Alert 
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { ConfirmDialog } from "@/components";

export default function Cart() {
  const { token, isAuthInitialized, user } = useAuth();
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCart = useCallback(async () => {
    if (!token) {
        setLoading(false);
        return;
    }

    try {
      setLoading(true);
      const res = await api.get("/cart", {
        headers: { 
            Authorization: `Bearer ${token}`,
            'Accept': 'application/json' 
        }
      });
      setCart(res.data);
      setError(null);
    } catch (err: any) {
      console.error("Помилка завантаження кошика", err);
      if (err.response?.status === 401) {
          setError("Сесія закінчилася. Будь ласка, переувійдіть в акаунт.");
      } else {
          setError("Не вдалося завантажити кошик.");
      }
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (isAuthInitialized) {
        fetchCart();
    }
  }, [isAuthInitialized, fetchCart]);

  const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; itemId: number | null }>({ 
    open: false, 
    itemId: null 
  });

  const handleRemoveClick = (id: number) => {
    setDeleteConfirm({ open: true, itemId: id });
  };

  const removeItem = async () => {
    if (!deleteConfirm.itemId) return;
    const itemId = deleteConfirm.itemId;
    setDeleteConfirm({ open: false, itemId: null });

    try {
        await api.delete(`/cart/items/${itemId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        fetchCart();
    } catch (err) {
        setError("Не вдалося видалити товар");
    }
  };

  // 1. Стан завантаження автентифікації
  if (!isAuthInitialized || (loading && !cart)) {
    return <Box sx={{display:'flex', justifyContent:'center', mt:10}}><CircularProgress /></Box>;
  }

  // 2. Якщо користувач не увійшов
  if (!user) {
    return (
        <Container sx={{ mt: 5 }}>
            <Alert severity="info">Будь ласка, увійдіть, щоб переглянути свій кошик.</Alert>
        </Container>
    );
  }

  // 3. Якщо виникла помилка (наприклад, 401)
  if (error) {
    return (
        <Container sx={{ mt: 5 }}>
            <Alert severity="error" action={
                <Button color="inherit" size="small" onClick={() => window.location.reload()}>Оновити</Button>
            }>
                {error}
            </Alert>
        </Container>
    );
  }

  const totalPrice = cart?.items?.reduce((acc: number, item: any) => {
    if (item?.book?.price && item?.quantity) {
      return acc + (item.book.price * item.quantity);
    }
    return acc;
  }, 0) || 0;

  const hasItems = cart?.items && Array.isArray(cart.items) && cart.items.length > 0;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
        Мій кошик
      </Typography>
      
      {hasItems ? (
        <Box>
          <Table sx={{ minWidth: 650, backgroundColor: 'background.paper', borderRadius: 2, overflow: 'hidden' }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'primary.main' }}>
                <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Назва книги</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold', color: 'white' }}>Ціна</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold', color: 'white' }}>Кількість</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold', color: 'white' }}>Сума</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold', color: 'white' }}>Дії</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {cart.items.map((item: any) => {
                if (!item?.book) return null;
                const itemTotal = (item.book.price || 0) * (item.quantity || 0);
                return (
                  <TableRow key={item.id} hover sx={{ '&:hover': { backgroundColor: 'action.hover' } }}>
                    <TableCell>
                      <Link 
                        href={`/books/${item.book.id}`} 
                        style={{ textDecoration: 'none', color: 'inherit' }}
                      >
                        <Typography variant="body1" sx={{ fontWeight: 500, '&:hover': { color: 'primary.main' } }}>
                          {item.book.title || 'Без назви'}
                        </Typography>
                      </Link>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body1">{item.book.price || 0} грн</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {item.quantity || 0}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                        {itemTotal} грн
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton 
                        onClick={() => handleRemoveClick(item.id)} 
                        color="error" 
                        title="Видалити"
                        sx={{ '&:hover': { backgroundColor: 'error.light', color: 'white' } }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          
          <Box 
            sx={{ 
              mt: 4, 
              p: 4, 
              border: '2px solid', 
              borderColor: 'primary.main',
              borderRadius: 3, 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              backgroundColor: 'primary.light',
              background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.1) 0%, rgba(25, 118, 210, 0.05) 100%)',
              boxShadow: 3
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              Загальна вартість: <Box component="span" sx={{ color: 'primary.main' }}>{totalPrice} грн</Box>
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              size="large" 
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
              Оформити замовлення
            </Button>
          </Box>
        </Box>
      ) : (
        <Box 
          sx={{ 
            textAlign: 'center', 
            mt: 10,
            p: 6,
            backgroundColor: 'background.paper',
            borderRadius: 3,
            boxShadow: 2
          }}
        >
          <ShoppingCartIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
          <Typography variant="h5" color="text.secondary" gutterBottom>
            Ваш кошик поки що порожній
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Додайте книги до кошика, щоб продовжити покупки
          </Typography>
          <Button 
            component={Link} 
            href="/" 
            variant="contained" 
            color="primary"
            size="large"
            startIcon={<ShoppingCartIcon />}
            sx={{ 
              px: 4,
              py: 1.5,
              fontSize: '1rem',
              fontWeight: 'bold'
            }}
          >
            Перейти до покупок
          </Button>
        </Box>
      )}

      {/* Модалка підтвердження видалення */}
      <ConfirmDialog
        open={deleteConfirm.open}
        title="Видалити товар з кошика?"
        message="Ви впевнені, що хочете видалити цей товар з кошика?"
        confirmText="Видалити"
        cancelText="Скасувати"
        onConfirm={removeItem}
        onCancel={() => setDeleteConfirm({ open: false, itemId: null })}
        severity="warning"
      />
    </Container>
  );
}