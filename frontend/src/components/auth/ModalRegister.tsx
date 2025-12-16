// src/components/ModalRegister.tsx

"use client";

import { Modal, Box, Typography, TextField, Button, Alert } from "@mui/material";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void; // Новий пропс
}

export default function ModalRegister({ open, onClose, onSuccess }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register } = useAuth();

  const handleSubmit = async () => {
    setError(null);
    setIsSubmitting(true);
    
    // Перевірка на рівні клієнта для підтвердження паролю
    if (password !== passwordConfirmation) {
        setError("Паролі не співпадають.");
        setIsSubmitting(false);
        return;
    }
    
    try {
        await register(name, email, password, passwordConfirmation);
        onSuccess(); // Закриваємо модалку при успіху

        // Очищення полів
        setName('');
        setEmail('');
        setPassword('');
        setPasswordConfirmation('');
        
    } catch (err: any) {
        // Обробка помилок валідації з бекенда (422)
        let errorMessage = "Помилка реєстрації.";
        if (err.response?.data?.errors) {
            // Збираємо всі помилки валідації в один рядок
            errorMessage = Object.values(err.response.data.errors).flat().join(' ');
        } else if (err.response?.data?.message) {
            errorMessage = err.response.data.message;
        }
        setError(errorMessage);
    } finally {
        setIsSubmitting(false);
    }
  };
  
  const handleClose = () => {
      onClose();
      // Скидання стану
      setName('');
      setEmail('');
      setPassword('');
      setPasswordConfirmation('');
      setError(null);
  }

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={{ 
        position: 'absolute', 
        top: '50%', 
        left: '50%', 
        transform: 'translate(-50%, -50%)', 
        bgcolor: 'background.paper', 
        p: 4, 
        width: { xs: '90%', sm: 400 },
        borderRadius: 3,
        boxShadow: 24,
        outline: 'none',
        maxHeight: '90vh',
        overflow: 'auto'
      }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3, textAlign: 'center' }}>
          Створити акаунт
        </Typography>
        
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <TextField 
          label="Ім'я" 
          fullWidth 
          margin="normal" 
          value={name} 
          onChange={(e) => setName(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField 
          label="Email" 
          type="email" 
          fullWidth 
          margin="normal" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField 
            label="Пароль" 
            type="password" 
            fullWidth 
            margin="normal" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mb: 2 }}
        />
        <TextField 
            label="Повтор паролю" 
            type="password" 
            fullWidth 
            margin="normal" 
            value={passwordConfirmation} 
            onChange={(e) => setPasswordConfirmation(e.target.value)} 
            onKeyDown={(e) => {
                if (e.key === 'Enter' && !isSubmitting) handleSubmit();
            }}
            sx={{ mb: 3 }}
        />
        <Button 
          variant="contained" 
          fullWidth 
          onClick={handleSubmit} 
          disabled={isSubmitting}
          size="large"
          sx={{ 
            mt: 2,
            py: 1.5,
            fontSize: '1rem',
            fontWeight: 'bold',
            boxShadow: 3,
            '&:hover': {
              boxShadow: 5
            }
          }}
        >
          {isSubmitting ? 'Завантаження...' : 'Зареєструватися'}
        </Button>
      </Box>
    </Modal>
  );
}