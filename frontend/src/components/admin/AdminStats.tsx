"use client";

import { useState, useEffect } from "react";
import { Box, Typography, Grid, Paper, CircularProgress } from "@mui/material";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import PeopleIcon from '@mui/icons-material/People';
import BookIcon from '@mui/icons-material/Book';
import CommentIcon from '@mui/icons-material/Comment';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

export default function AdminStats() {
  const { token } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data);
    } catch (err: any) {
      console.error("Помилка завантаження статистики:", err);
      // Якщо помилка, встановлюємо значення за замовчуванням
      setStats({
        users: 0,
        books: 0,
        comments: 0,
        orders: 0,
        active_users: 0,
        blocked_users: 0,
        blocked_books: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Box display="flex" justifyContent="center" p={4}><CircularProgress /></Box>;
  }

  const statCards = [
    { title: "Всього користувачів", value: stats?.users || 0, icon: <PeopleIcon />, color: "primary" },
    { title: "Активні користувачі", value: stats?.active_users || 0, icon: <PeopleIcon />, color: "success" },
    { title: "Заблоковані користувачі", value: stats?.blocked_users || 0, icon: <PeopleIcon />, color: "error" },
    { title: "Всього книг", value: stats?.books || 0, icon: <BookIcon />, color: "info" },
    { title: "Заблоковані книги", value: stats?.blocked_books || 0, icon: <BookIcon />, color: "warning" },
    { title: "Коментарі", value: stats?.comments || 0, icon: <CommentIcon />, color: "secondary" },
    { title: "Замовлення", value: stats?.orders || 0, icon: <ShoppingCartIcon />, color: "success" },
  ];

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
        Статистика системи
      </Typography>
      
      <Grid container spacing={3}>
        {statCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <Paper 
              elevation={3} 
              sx={{ 
                p: 3, 
                borderRadius: 2,
                textAlign: 'center',
                border: `2px solid`,
                borderColor: `${card.color}.main`
              }}
            >
              <Box sx={{ color: `${card.color}.main`, mb: 1, fontSize: '3rem' }}>
                {card.icon}
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                {card.value}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {card.title}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

