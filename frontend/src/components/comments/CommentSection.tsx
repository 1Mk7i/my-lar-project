// src/components/CommentSection.tsx

"use client";

import React, { useState, useEffect } from "react";
import { Comment, PaginatedResponse } from "@/types";
import { Box, Typography, CircularProgress, Alert, Pagination, Snackbar } from "@mui/material";
import api from "@/lib/api";
import CommentCard from "./CommentCard";
import CommentForm from "./CommentForm";
import ConfirmDialog from "../common/ConfirmDialog";
import { useAuth } from "@/context/AuthContext"; 

interface CommentSectionProps {
    bookId: number | string;
}

export default function CommentSection({ bookId }: CommentSectionProps) {
    const { user, token } = useAuth(); 
    
    const [comments, setComments] = useState<Comment[]>([]);
    // Налаштування пагінації за замовчуванням
    const [pagination, setPagination] = useState<{ current_page: number; last_page: number; total: number }>({ current_page: 1, last_page: 1, total: 0 }); 
    const [loading, setLoading] = useState(true);
    const [createLoading, setCreateLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" as "success" | "error" });

    const fetchComments = (page: number) => {
        setLoading(true);
        setError(null);

        api.get(`/books/${bookId}/comments`, { params: { page } })
            .then(res => {
                const data = res.data as PaginatedResponse<Comment>;
                setComments(data.data);
                setPagination({
                    current_page: data.current_page,
                    last_page: data.last_page,
                    total: data.total,
                });
            })
            .catch(err => {
                console.error("Помилка завантаження коментарів:", err);
                const message = err.response?.data?.message || err.message || "Невідома помилка API";
                setError(`Не вдалося завантажити коментарі: ${message}`);
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchComments(1);
    }, [bookId]);

    const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
        fetchComments(page);
    };

    const handleSnackbarClose = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    /**
     * Створення нового коментаря
     */
    const handleCreate = async (content: string, rating: number | null) => {
        if (!user || !token) { 
            setSnackbar({ open: true, message: "Будь ласка, увійдіть, щоб залишити коментар.", severity: "error" });
            return;
        }
        setCreateLoading(true);
        try {
            const res = await api.post(
                `/books/${bookId}/comments`, 
                { content, rating },
                {
                    headers: {
                        'Authorization': `Bearer ${token}` 
                    }
                }
            );
            
            // Якщо ми на першій сторінці, додаємо коментар. Інакше перезавантажуємо сторінку 1.
            if (pagination.current_page === 1) {
                setComments(prev => [res.data as Comment, ...prev.slice(0, 4)]); 
            } else {
                 fetchComments(1);
            }
            setSnackbar({ open: true, message: "Коментар успішно додано!", severity: "success" });
            
        } catch (err: any) {
            console.error("Помилка створення коментаря:", err);
            // Додаємо більш інформативне повідомлення про помилку, якщо вона є
            const msg = err.response?.data?.message || "Помилка при створенні коментаря. Перевірте автентифікацію.";
            setSnackbar({ open: true, message: msg, severity: "error" });
        } finally {
            setCreateLoading(false);
        }
    };
    
    /**
     * Оновлення існуючого коментаря
     */
    const handleUpdate = async (commentId: number, content: string, rating: number | null): Promise<void> => {
        if (!token) throw new Error("Відсутній токен автентифікації.");
        try {
            const res = await api.put(
                `/books/${bookId}/comments/${commentId}`, 
                { content, rating },
                {
                    headers: {
                        'Authorization': `Bearer ${token}` 
                    }
                }
            );
            
            setComments(prev => 
                prev.map(c => (c.id === commentId ? (res.data as Comment) : c))
            );
            setSnackbar({ open: true, message: "Коментар успішно оновлено!", severity: "success" });
        } catch (err: any) {
             console.error("Помилка оновлення коментаря:", err);
             const msg = err.response?.data?.message || "Помилка при оновленні коментаря.";
             setSnackbar({ open: true, message: msg, severity: "error" });
             throw err; 
        }
    };

    const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; commentId: number | null }>({ 
        open: false, 
        commentId: null 
    });

    /**
     * Видалення коментаря
     */
    const handleDeleteClick = (commentId: number) => {
        setDeleteConfirm({ open: true, commentId });
    };

    const handleDeleteConfirm = async () => {
        if (!deleteConfirm.commentId) return;
        const commentId = deleteConfirm.commentId;
        setDeleteConfirm({ open: false, commentId: null });

        if (!token) {
            setSnackbar({ open: true, message: "Помилка автентифікації при видаленні.", severity: "error" });
            return;
        }

        try {
            await api.delete(
                `/books/${bookId}/comments/${commentId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}` 
                    }
                }
            );
            
            setComments(prev => prev.filter(c => c.id !== commentId));
            
            if (comments.length === 1 && pagination.current_page > 1) {
                fetchComments(pagination.current_page - 1);
            } else {
                fetchComments(pagination.current_page);
            }
            
            setSnackbar({ open: true, message: "Коментар успішно видалено.", severity: "success" });
        } catch (err: any) {
             console.error("Помилка видалення коментаря:", err);
             const msg = err.response?.data?.message || "Помилка при видаленні коментаря.";
             setSnackbar({ open: true, message: msg, severity: "error" });
        }
    };


    const currentUserId = user?.id || null;
    // Оскільки ми оновили бекенд, тепер використовуємо user.role?.id
    const currentUserRoleId = user?.role?.id || null; 
    
    return (
        <Box sx={{ mt: 5 }}>
            <Typography 
                variant="h4" 
                component="h2" 
                gutterBottom
                sx={{
                    fontWeight: 'bold',
                    color: 'primary.main',
                    mb: 3,
                    pb: 2,
                    borderBottom: '2px solid',
                    borderColor: 'primary.main'
                }}
            >
                Коментарі та відгуки ({pagination.total})
            </Typography>

            {/* Форма додавання коментаря */}
            {user ? (
                <CommentForm
                    isEditing={false}
                    onSubmit={handleCreate}
                    loading={createLoading}
                />
            ) : (
                <Alert severity="info" sx={{ mb: 3 }}>
                    Увійдіть, щоб залишити свій коментар та оцінку.
                </Alert>
            )}
            
            {loading && (
                <Box display="flex" justifyContent="center" py={4}>
                    <CircularProgress size={30} />
                </Box>
            )}
            
            {error && <Alert severity="error">{error}</Alert>}
            
            {/* Відображення коментарів */}
            <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
                {comments.map(comment => (
                    <CommentCard 
                        key={comment.id} 
                        comment={comment} 
                        currentUserId={currentUserId}
                        currentUserRoleId={currentUserRoleId}
                        onDelete={handleDeleteClick} 
                        onUpdate={handleUpdate} 
                    />
                ))}
            </Box>

            {/* Пагінація */}
            {pagination.last_page > 1 && (
                <Box display="flex" justifyContent="center" mt={4}>
                    <Pagination
                        count={pagination.last_page}
                        page={pagination.current_page}
                        onChange={handlePageChange}
                        color="primary"
                    />
                </Box>
            )}

            {/* Snackbar для повідомлень */}
            <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>

            {/* Модалка підтвердження видалення */}
            <ConfirmDialog
                open={deleteConfirm.open}
                title="Видалити коментар?"
                message="Ви впевнені, що хочете видалити цей коментар? Цю дію неможливо скасувати."
                confirmText="Видалити"
                cancelText="Скасувати"
                onConfirm={handleDeleteConfirm}
                onCancel={() => setDeleteConfirm({ open: false, commentId: null })}
                severity="error"
            />
        </Box>
    );
}