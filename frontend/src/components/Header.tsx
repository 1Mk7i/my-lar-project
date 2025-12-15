// src/components/Header.tsx

"use client";

import { AppBar, Toolbar, Button, Avatar, Box, Menu, MenuItem } from "@mui/material";
import { useState } from "react";
import ModalLogin from "./ModalLogin";
import ModalRegister from "./ModalRegister";
import { useAuth } from "@/context/AuthContext"; 
import Link from 'next/link';
import { useRouter } from "next/navigation"; 
import api from "@/lib/api";

export default function Header() {
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);
  
  const { user, logout, isLoading, isAuthInitialized } = useAuth(); 
  const router = useRouter();

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  // 🚩 ЛОГІКА: СТВОРИТИ КНИГУ (викликає API POST)
  const handleCreateBook = async () => {
    handleMenuClose();
    
    try {
        const response = await api.post('/books'); 
        const newBookId = response.data.book_id;
        router.push(`/books/${newBookId}/edit`); 

    } catch (error) {
        console.error("Помилка при створенні чернетки книги:", error);
    }
  };
  
  const handleLogout = () => {
      logout();
      handleMenuClose();
  };

  if (!isAuthInitialized) {
      return <AppBar position="static"><Toolbar sx={{ justifyContent: 'space-between' }} /></AppBar>; 
  }

  // Адмін (3) або Автор (2) може створювати книги
  const canCreateBook = user && (user.role_id === 3 || user.role_id === 2); 

  return (
    <AppBar position="static">
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        
        <Link href="/" passHref style={{ textDecoration: 'none', color: 'white'}}>
            <Button color="inherit" sx={{ fontSize: '1.1rem', fontWeight: 'bold' }}>
                BookStore
            </Button>
        </Link>
        
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {!user ? (
            <>
              <Button color="inherit" onClick={() => setLoginOpen(true)} disabled={isLoading}>Увійти</Button>
              <Button color="inherit" onClick={() => setRegisterOpen(true)} disabled={isLoading}>Реєстрація</Button>
            </>
          ) : (
            <Box display="flex" alignItems="center" gap={2}>
              <Box
                onClick={handleMenuClick}
                sx={{
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1, 
                  cursor: 'pointer',
                  p: 1, 
                  borderRadius: 1,
                  '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
                }}
              >
                <Avatar src={user.avatar || undefined} alt={user.name} />
                <span style={{ color: 'white' }}>{user.name}</span>
              </Box>

              <Menu
                anchorEl={anchorEl}
                open={menuOpen}
                onClose={handleMenuClose}
                onClick={handleMenuClose}
                PaperProps={{
                  elevation: 0,
                  sx: {
                    overflow: 'visible',
                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                    mt: 1.5,
                  },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                {/* Пункт 1: Створити книгу */}
                {canCreateBook && (
                    <MenuItem onClick={handleCreateBook}>
                        Створити книгу
                    </MenuItem>
                )}
                
                {/* Пункт 2: Вийти */}
                <MenuItem onClick={handleLogout}>
                    Вийти
                </MenuItem>
              </Menu>
              
            </Box>
          )}
        </Box>
        
      </Toolbar>
      <ModalLogin 
          open={loginOpen} 
          onClose={() => setLoginOpen(false)} 
          onSuccess={() => setLoginOpen(false)} 
      />
      <ModalRegister 
          open={registerOpen} 
          onClose={() => setRegisterOpen(false)} 
          onSuccess={() => setRegisterOpen(false)} 
      />
    </AppBar>
  );
}