// src/components/ModalLogin.tsx

"use client";

import { Modal, Box, Typography, TextField, Button, Alert } from "@mui/material";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void; // Новий пропс
}

export default function ModalLogin({ open, onClose, onSuccess }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login } = useAuth();
  
  const handleSubmit = async () => {
    setError(null);
    setIsSubmitting(true);
    
    try {
        await login(email, password);
        onSuccess(); // Закриваємо модалку при успіху

        // Очищення полів
        setEmail('');
        setPassword('');
        
    } catch (err: any) {
        // Обробка помилок з бекенда (наприклад, 401 Unauthorized)
        const errorMessage = err.response?.data?.message || "Помилка входу. Перевірте email та пароль.";
        setError(errorMessage);
    } finally {
        setIsSubmitting(false);
    }
  };
  
  // Додаткова логіка для скидання стану при закритті модалки
  const handleClose = () => {
      onClose();
      setEmail('');
      setPassword('');
      setError(null);
  }

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={{ 
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', 
        bgcolor: 'background.paper', p: 4, width: 350, borderRadius: 1 
      }}>
        <Typography variant="h6" gutterBottom>Увійти</Typography>
        
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        
        <TextField 
          label="Email" 
          type="email"
          fullWidth margin="normal" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField 
          label="Пароль" 
          type="password" 
          fullWidth margin="normal" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => {
              if (e.key === 'Enter' && !isSubmitting) handleSubmit();
          }}
        />
        <Button 
          variant="contained" 
          fullWidth 
          onClick={handleSubmit} 
          disabled={isSubmitting}
          sx={{ mt: 2 }}
        >
          {isSubmitting ? 'Завантаження...' : 'Увійти'}
        </Button>
      </Box>
    </Modal>
  );
}