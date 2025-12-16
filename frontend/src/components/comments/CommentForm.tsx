// src/components/CommentForm.tsx

"use client";

import React, { useState, useEffect } from "react";
import { Box, TextField, Button, Rating, Typography, Paper } from "@mui/material";

interface CommentFormProps {
    initialContent?: string;
    initialRating?: number | null;
    isEditing: boolean;
    onSubmit: (content: string, rating: number | null) => void;
    onCancel?: () => void;
    loading: boolean;
}

export default function CommentForm({
    initialContent = "",
    initialRating = null,
    isEditing,
    onSubmit,
    onCancel,
    loading,
}: CommentFormProps) {
    const [content, setContent] = useState(initialContent);
    const [rating, setRating] = useState<number | null>(initialRating);

    // Оновлення полів, коли змінюються початкові значення (при редагуванні)
    useEffect(() => {
        setContent(initialContent);
        setRating(initialRating);
    }, [initialContent, initialRating]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Дозволяємо надсилання, навіть якщо рейтинг відсутній (nullable)
        if (content.trim()) {
            onSubmit(content.trim(), rating);
        }
    };

    return (
        <Paper 
            elevation={isEditing ? 3 : 2} 
            sx={{ 
                p: 3, 
                mb: 3,
                borderRadius: 2,
                backgroundColor: 'background.paper',
                border: isEditing ? '2px solid' : '1px solid',
                borderColor: isEditing ? 'primary.main' : 'divider'
            }}
        >
            <Typography 
                variant="h6" 
                gutterBottom
                sx={{
                    fontWeight: 'bold',
                    color: 'primary.main',
                    mb: 2
                }}
            >
                {isEditing ? "Редагувати коментар" : "Залишити коментар та відгук"}
            </Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Ваш коментар"
                    multiline
                    rows={4}
                    fullWidth
                    variant="outlined"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    margin="normal"
                    required
                    disabled={loading}
                />
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Typography component="legend" sx={{ mr: 1 }}>
                        Ваша оцінка:
                    </Typography>
                    <Rating
                        name="book-rating"
                        value={rating}
                        onChange={(event, newValue) => {
                            setRating(newValue);
                        }}
                        precision={1}
                        max={5}
                        disabled={loading}
                    />
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                    {isEditing && onCancel && (
                        <Button
                            variant="outlined"
                            onClick={onCancel}
                            disabled={loading}
                        >
                            Скасувати
                        </Button>
                    )}
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={loading || content.trim().length === 0}
                        sx={{
                            px: 3,
                            fontWeight: 'bold',
                            boxShadow: 2,
                            '&:hover': {
                                boxShadow: 4
                            }
                        }}
                    >
                        {loading ? 'Надсилання...' : (isEditing ? 'Зберегти зміни' : 'Опублікувати')}
                    </Button>
                </Box>
            </form>
        </Paper>
    );
}