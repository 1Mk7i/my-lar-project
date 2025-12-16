"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  CircularProgress,
  Alert,
  Pagination,
  Snackbar
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Switch, FormControlLabel } from "@mui/material";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import ConfirmDialog from "../common/ConfirmDialog";

export default function AdminUsers() {
  const { token } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, total: 0 });
  const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; userId: number | null }>({ 
    open: false, 
    userId: null 
  });

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  const fetchUsers = async (page: number = 1) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/admin/users?page=${page}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data.data || []);
      setPagination({
        current_page: response.data.current_page,
        last_page: response.data.last_page,
        total: response.data.total,
      });
    } catch (err: any) {
      console.error("Помилка завантаження користувачів:", err);
      setError(err.response?.data?.message || "Не вдалося завантажити користувачів.");
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await api.get('/admin/roles', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRoles(response.data || []);
    } catch (err: any) {
      console.error("Помилка завантаження ролей:", err);
    }
  };

  const handleRoleChange = async (userId: number, newRoleId: number) => {
    try {
      await api.put(`/admin/users/${userId}`, { role_id: newRoleId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchUsers(pagination.current_page);
    } catch (err: any) {
      console.error("Помилка зміни ролі:", err);
      setError(err.response?.data?.message || "Не вдалося змінити роль користувача.");
    }
  };

  const handleBlockToggle = async (userId: number, isBlocked: boolean, blockReason?: string) => {
    try {
      await api.put(`/admin/users/${userId}`, { 
        is_blocked: !isBlocked,
        block_reason: !isBlocked ? (blockReason || 'Заблоковано адміністратором') : null
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchUsers(pagination.current_page);
    } catch (err: any) {
      console.error("Помилка блокування/розблокування:", err);
      setError(err.response?.data?.message || "Не вдалося змінити статус користувача.");
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm.userId) return;
    const userId = deleteConfirm.userId;
    setDeleteConfirm({ open: false, userId: null });
    
    try {
      await api.delete(`/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchUsers(pagination.current_page);
    } catch (err: any) {
      console.error("Помилка видалення користувача:", err);
      setError(err.response?.data?.message || "Не вдалося видалити користувача.");
    }
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    fetchUsers(page);
  };

  if (loading && users.length === 0) {
    return <Box display="flex" justifyContent="center" p={4}><CircularProgress /></Box>;
  }

  if (error && users.length === 0) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
        Управління користувачами
      </Typography>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Ім'я</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Роль</TableCell>
            <TableCell>Статус</TableCell>
            <TableCell>Дії</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.id}</TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <FormControl size="small">
                  <Select
                    value={user.role_id}
                    onChange={(e) => handleRoleChange(user.id, Number(e.target.value))}
                  >
                    {roles.map((role) => (
                      <MenuItem key={role.id} value={role.id}>
                        {role.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </TableCell>
              <TableCell>
                <FormControlLabel
                  control={
                    <Switch
                      checked={!user.is_blocked}
                      onChange={() => handleBlockToggle(user.id, user.is_blocked, user.block_reason)}
                      color="success"
                    />
                  }
                  label={
                    user.is_blocked ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', color: 'error.main' }}>
                        <BlockIcon fontSize="small" sx={{ mr: 0.5 }} />
                        Заблоковано {user.block_reason && `(${user.block_reason})`}
                      </Box>
                    ) : (
                      <Box sx={{ display: 'flex', alignItems: 'center', color: 'success.main' }}>
                        <CheckCircleIcon fontSize="small" sx={{ mr: 0.5 }} />
                        Активний
                      </Box>
                    )
                  }
                />
              </TableCell>
              <TableCell>
                <IconButton 
                  color="error" 
                  onClick={() => setDeleteConfirm({ open: true, userId: user.id })}
                >
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {pagination.last_page > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Pagination
            count={pagination.last_page}
            page={pagination.current_page}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      )}

      {error && (
        <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError(null)}>
          <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
            {error}
          </Alert>
        </Snackbar>
      )}

      <ConfirmDialog
        open={deleteConfirm.open}
        title="Видалити користувача?"
        message="Ви впевнені, що хочете видалити цього користувача? Цю дію неможливо скасувати."
        confirmText="Видалити"
        cancelText="Скасувати"
        onConfirm={handleDelete}
        onCancel={() => setDeleteConfirm({ open: false, userId: null })}
        severity="error"
      />
    </Box>
  );
}

