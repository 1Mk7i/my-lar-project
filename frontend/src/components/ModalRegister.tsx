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
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', 
        bgcolor: 'background.paper', p: 4, width: 350, borderRadius: 1 
      }}>
        <Typography variant="h6" gutterBottom>Реєстрація</Typography>
        
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <TextField label="Ім'я" fullWidth margin="normal" value={name} onChange={(e) => setName(e.target.value)} />
        <TextField label="Email" type="email" fullWidth margin="normal" value={email} onChange={(e) => setEmail(e.target.value)} />
        <TextField 
            label="Пароль" 
            type="password" 
            fullWidth margin="normal" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
        />
        <TextField 
            label="Повтор паролю" 
            type="password" 
            fullWidth margin="normal" 
            value={passwordConfirmation} 
            onChange={(e) => setPasswordConfirmation(e.target.value)} 
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
          {isSubmitting ? 'Завантаження...' : 'Зареєструватися'}
        </Button>
      </Box>
    </Modal>
  );
}