// src/components/CommentCard.tsx

"use client";

import React, { useState } from "react"; 
import { Comment } from "@/types";
import { Box, Paper, Typography, Avatar, Button, Rating } from "@mui/material";
import PersonIcon from '@mui/icons-material/Person';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import CreateIcon from '@mui/icons-material/Create';
import CommentForm from "./CommentForm";

interface CommentCardProps {
    comment: Comment;
    currentUserId: number | null; 
    currentUserRoleId: number | null; 
    onDelete: (commentId: number) => void; // Зроблено обов'язковим
    onUpdate: (commentId: number, content: string, rating: number | null) => Promise<void>; // Новий пропс
}

const MAX_LINES = 3;

export default function CommentCard({ comment, currentUserId, currentUserRoleId, onDelete, onUpdate }: CommentCardProps) {
    const [expanded, setExpanded] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [updateLoading, setUpdateLoading] = useState(false); // Стан завантаження оновлення
    
    const user = comment.user;
    
    const isOwner = currentUserId !== null && user.id === currentUserId;
    const isAdmin = currentUserRoleId === 3; 
    
    // 1. Визначення статусу (Role) та стилю
    let roleText: string;
    let roleColor: string;
    let roleIcon: React.ReactElement; 

    if (user.role && user.role.id === 3) { 
        roleText = 'Admin';
        roleColor = 'error.main'; 
        roleIcon = <AdminPanelSettingsIcon fontSize="small" />;
    } else if (user.role && user.role.id === 2 && user.author) { 
        roleText = 'Author';
        roleColor = 'success.main'; 
        roleIcon = <CreateIcon fontSize="small" />;
    } else {
        roleText = 'User';
        roleColor = 'text.secondary'; 
        roleIcon = <PersonIcon fontSize="small" />;
    }

    // 2. Логіка для розгортання коментаря
    const contentLines = comment.content.split('\n');
    const isExpandable = contentLines.length > MAX_LINES || comment.content.length > 250;
    const displayedContent = expanded ? comment.content : contentLines.slice(0, MAX_LINES).join('\n');

    const canEdit = isOwner; // Тільки власник
    const canDelete = isOwner || isAdmin; // Власник або Адмін
    
    const handleUpdate = async (content: string, rating: number | null) => {
        setUpdateLoading(true);
        try {
            // Викликаємо функцію оновлення з CommentSection
            await onUpdate(comment.id, content, rating);
            setIsEditing(false); // Закриваємо форму після успішного оновлення
        } catch (error) {
            console.error("Помилка при оновленні коментаря:", error);
            // Обробка помилки в CommentSection
        } finally {
            setUpdateLoading(false);
        }
    };
    
    // Якщо ми в режимі редагування, відображаємо форму
    if (isEditing) {
        return (
            <CommentForm
                initialContent={comment.content}
                initialRating={comment.rating}
                isEditing={true}
                onSubmit={handleUpdate}
                onCancel={() => setIsEditing(false)}
                loading={updateLoading}
            />
        );
    }

    // Режим відображення коментаря
    return (
        <Paper 
            elevation={2} 
            sx={{ 
                p: 3, 
                display: 'flex', 
                gap: 3,
                borderRadius: 2,
                backgroundColor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
                transition: 'all 0.3s ease',
                '&:hover': {
                    boxShadow: 4,
                    borderColor: 'primary.main'
                }
            }}
        >
            
            {/* Ліва колонка: Аватар та Автор */}
            <Box sx={{ flexShrink: 0, textAlign: 'center', width: '80px' }}>
                <Avatar sx={{ bgcolor: roleColor, width: 56, height: 56, mx: 'auto' }}>
                    {user.name[0]}
                </Avatar>
                <Typography variant="body2" sx={{ mt: 0.5, fontWeight: 'bold' }}>
                    {user.name}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: roleColor }}>
                    {roleIcon}
                    <Typography variant="caption" sx={{ ml: 0.5, fontWeight: 'bold' }}>
                        [{roleText}]
                    </Typography>
                </Box>
            </Box>

            {/* Права колонка: Вміст */}
            <Box sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {comment.rating !== null && (
                        <Rating name="read-only" value={comment.rating} readOnly size="small" />
                    )}
                    <Typography variant="caption" color="text.secondary">
                        {new Date(comment.created_at).toLocaleString()}
                    </Typography>
                </Box>

                <Typography 
                    variant="body2" 
                    sx={{ 
                        mt: 1, 
                        maxHeight: expanded ? 'none' : `${MAX_LINES * 1.5}em`, 
                        overflow: expanded ? 'visible' : 'hidden',
                        whiteSpace: 'pre-wrap',
                        textOverflow: 'ellipsis',
                    }}
                >
                    {displayedContent}
                    {isExpandable && !expanded && '...'}
                </Typography>

                {/* Кнопка "Розгорнути" */}
                {isExpandable && (
                    <Button 
                        size="small" 
                        onClick={() => setExpanded(!expanded)} 
                        sx={{ mt: 1, p: 0 }}
                    >
                        {expanded ? 'Згорнути' : 'Читати повністю'}
                    </Button>
                )}
                
                {/* Дії: Редагувати / Видалити */}
                {(canEdit || canDelete) && ( 
                    <Box sx={{ mt: 1, display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                        
                        {/* 1. Редагування: Тільки власник */}
                        {canEdit && (
                            <Button size="small" color="primary" onClick={() => setIsEditing(true)}>
                                Редагувати
                            </Button>
                        )}
                        
                        {/* 2. Видалення: Власник АБО Адмін */}
                        {canDelete && (
                            <Button size="small" color="error" onClick={() => onDelete(comment.id)}>
                                Видалити
                            </Button>
                        )}
                    </Box>
                )}
            </Box>
        </Paper>
    );
}