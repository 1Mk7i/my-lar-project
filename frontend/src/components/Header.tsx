"use client";

import { 
  AppBar, 
  Toolbar, 
  Button, 
  Avatar, 
  Box, 
  Menu, 
  MenuItem, 
  CircularProgress, 
  IconButton, 
  Badge 
} from "@mui/material"; 
import { useState } from "react";
import ModalLogin from "./ModalLogin";
import ModalRegister from "./ModalRegister";
import { useAuth } from "@/context/AuthContext"; 
import Link from 'next/link';
import { useRouter } from "next/navigation"; 
import api from "@/lib/api";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'; // 🚩 Імпортуємо іконку кошика

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
  
  const canCreateBook = user && (user.role?.id === 3 || user.role?.id === 2); 

  const renderAuthContent = () => {
    if (!isAuthInitialized || isLoading) {
        return <CircularProgress color="inherit" size={24} />;
    }

    if (!user) {
        return (
            <>
                <Button color="inherit" onClick={() => setLoginOpen(true)}>Увійти</Button>
                <Button color="inherit" onClick={() => setRegisterOpen(true)}>Реєстрація</Button>
            </>
        );
    }

    return (
        <Box display="flex" alignItems="center" gap={1}>
            
            {/* 🚩 КНОПКА КОШИКА */}
            <Link href="/cart" passHref>
                <IconButton color="inherit" title="Кошик" sx={{ mr: 1 }}>
                    <ShoppingCartIcon />
                </IconButton>
            </Link>

            <Box
                onClick={handleMenuClick}
                sx={{
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1, 
                    cursor: 'pointer',
                    p: 0.5, 
                    borderRadius: 1,
                    '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
                }}
            >
                <Avatar 
                  src={user.avatar || undefined} 
                  alt={user.name} 
                  sx={{ width: 32, height: 32 }}
                />
                <span style={{ color: 'white', fontWeight: 500 }}>{user.name}</span>
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
                        '&:before': {
                          content: '""',
                          display: 'block',
                          position: 'absolute',
                          top: 0,
                          right: 14,
                          width: 10,
                          height: 10,
                          bgcolor: 'background.paper',
                          transform: 'translateY(-50%) rotate(45deg)',
                          zIndex: 0,
                        },
                    },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                {canCreateBook && (
                    <MenuItem onClick={handleCreateBook}>
                        Створити книгу
                    </MenuItem>
                )}
                <MenuItem onClick={() => router.push('/cart')}>
                    Мій кошик
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                    Вийти
                </MenuItem>
            </Menu>
        </Box>
    );
  };

  return (
    <AppBar position="static">
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Link href="/" passHref style={{ textDecoration: 'none', color: 'white'}}>
            <Button color="inherit" sx={{ fontSize: '1.1rem', fontWeight: 'bold' }}>
                BookStore
            </Button>
        </Link>
        
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {renderAuthContent()}
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