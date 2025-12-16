"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Button,
  CircularProgress
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import ConfirmDialog from "../common/ConfirmDialog";

export default function AdminBooks() {
  const { token } = useAuth();
  const router = useRouter();
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; bookId: number | null }>({ 
    open: false, 
    bookId: null 
  });

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const res = await api.get("/books", { params: { per_page: 100 } });
      setBooks(res.data.data || []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm.bookId) return;
    const bookId = deleteConfirm.bookId;
    setDeleteConfirm({ open: false, bookId: null });
    
    try {
      await api.delete(`/books/${bookId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchBooks();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateBook = async () => {
    try {
      const response = await api.post('/books', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const newBookId = response.data.book_id || response.data.id;
      router.push(`/books/${newBookId}/edit`);
    } catch (error) {
      console.error("Помилка при створенні книги:", error);
    }
  };

  if (loading) {
    return <Box display="flex" justifyContent="center" p={4}><CircularProgress /></Box>;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          Управління книгами
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={handleCreateBook}
        >
          Додати книгу
        </Button>
      </Box>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Назва</TableCell>
            <TableCell>Автор</TableCell>
            <TableCell>Ціна</TableCell>
            <TableCell>Дії</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {books.map((book) => (
            <TableRow key={book.id}>
              <TableCell>{book.id}</TableCell>
              <TableCell>{book.title}</TableCell>
              <TableCell>{book.author?.user?.name || "Невідомий"}</TableCell>
              <TableCell>{book.price} грн</TableCell>
              <TableCell>
                <IconButton 
                  color="primary" 
                  onClick={() => router.push(`/books/${book.id}/edit`)}
                >
                  <EditIcon />
                </IconButton>
                <IconButton 
                  color="error" 
                  onClick={() => setDeleteConfirm({ open: true, bookId: book.id })}
                >
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <ConfirmDialog
        open={deleteConfirm.open}
        title="Видалити книгу?"
        message="Ви впевнені, що хочете видалити цю книгу? Цю дію неможливо скасувати."
        confirmText="Видалити"
        cancelText="Скасувати"
        onConfirm={handleDelete}
        onCancel={() => setDeleteConfirm({ open: false, bookId: null })}
        severity="error"
      />
    </Box>
  );
}

