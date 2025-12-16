"use client";

import { useEffect, useState, useCallback } from "react";
import { Typography, Button, Table, TableBody, TableCell, TableHead, TableRow, IconButton, Box, Container, CircularProgress, Alert } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function Cart() {
  const { token, isAuthInitialized, user } = useAuth();
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCart = useCallback(async () => {
    // 🚩 ПЕРЕВІРКА: Не робимо запит, якщо токена ще немає
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

  const removeItem = async (id: number) => {
    try {
        await api.delete(`/cart/items/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        fetchCart();
    } catch (err) {
        alert("Не вдалося видалити товар");
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

  const totalPrice = cart?.items?.reduce((acc: number, item: any) => acc + (item.book.price * item.quantity), 0) || 0;

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>Мій кошик</Typography>
      
      {cart?.items?.length > 0 ? (
        <Box sx={{ mt: 3 }}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell sx={{ fontWeight: 'bold' }}>Назва книги</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Ціна</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Кількість</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Сума</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Дії</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {cart.items.map((item: any) => (
                <TableRow key={item.id} hover>
                  <TableCell>
                    <Link href={`/books/${item.book.id}`} style={{ textDecoration: 'none', color: 'primary.main' }}>
                        {item.book.title}
                    </Link>
                  </TableCell>
                  <TableCell align="right">{item.book.price} грн</TableCell>
                  <TableCell align="center">{item.quantity}</TableCell>
                  <TableCell align="right"><strong>{item.book.price * item.quantity} грн</strong></TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => removeItem(item.id)} color="error" title="Видалити">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          <Box sx={{ mt: 4, p: 3, border: '1px solid #ddd', borderRadius: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fafafa' }}>
            <Typography variant="h5">Загальна вартість: <strong>{totalPrice} грн</strong></Typography>
            <Button variant="contained" color="primary" size="large" sx={{ px: 4 }}>
                Оформити замовлення
            </Button>
          </Box>
        </Box>
      ) : (
        <Box sx={{ textAlign: 'center', mt: 10 }}>
            <Typography variant="h6" color="text.secondary">Ваш кошик поки що порожній.</Typography>
            <Button component={Link} href="/" variant="outlined" sx={{ mt: 2 }}>Перейти до покупок</Button>
        </Box>
      )}
    </Container>
  );
}