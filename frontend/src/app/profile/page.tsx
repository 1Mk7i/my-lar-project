"use client";

import { 
  Typography, 
  Button, 
  Box, 
  Container, 
  Paper, 
  Avatar, 
  Divider, 
  Stack, 
  Chip,
  TextField,
  Switch,
  FormControlLabel,
  Tabs,
  Tab,
  Alert,
  Snackbar,
  IconButton,
  Input
} from "@mui/material";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import PersonIcon from '@mui/icons-material/Person';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import CreateIcon from '@mui/icons-material/Create';
import LogoutIcon from '@mui/icons-material/Logout';
import DeleteIcon from '@mui/icons-material/Delete';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useRouter } from "next/navigation";
import api from "@/lib/api";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

export default function Profile() {
  const { user, logout, token } = useAuth();
  const { mode, toggleTheme } = useTheme();
  const router = useRouter();
  const [tabValue, setTabValue] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" as "success" | "error" });

  // Profile editing states
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(user?.name || "");
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({ current: "", new: "", confirm: "" });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  if (!user) {
    return (
      <Container sx={{ mt: 5 }}>
        <Typography variant="h5" color="text.secondary">
          Будь ласка, увійдіть, щоб переглянути профіль.
        </Typography>
      </Container>
    );
  }

  const isAdmin = user.role?.id === 3;
  const isAuthor = user.role?.id === 2;

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleSaveName = async () => {
    try {
      await api.put('/user/profile', { name: editedName }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsEditingName(false);
      setSnackbar({ open: true, message: "Ім'я успішно оновлено!", severity: "success" });
      window.location.reload(); // Reload to get updated user data
    } catch (err: any) {
      setSnackbar({ open: true, message: err.response?.data?.message || "Помилка оновлення імені", severity: "error" });
    }
  };

  const handleSavePassword = async () => {
    if (passwordData.new !== passwordData.confirm) {
      setSnackbar({ open: true, message: "Нові паролі не співпадають", severity: "error" });
      return;
    }
    try {
      await api.put('/user/password', passwordData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsEditingPassword(false);
      setPasswordData({ current: "", new: "", confirm: "" });
      setSnackbar({ open: true, message: "Пароль успішно змінено!", severity: "success" });
    } catch (err: any) {
      setSnackbar({ open: true, message: err.response?.data?.message || "Помилка зміни пароля", severity: "error" });
    }
  };

  const handleAvatarUpload = async () => {
    if (!avatarFile) return;
    const formData = new FormData();
    formData.append('avatar', avatarFile);
    try {
      await api.post('/user/avatar', formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setSnackbar({ open: true, message: "Аватар успішно оновлено!", severity: "success" });
      setAvatarFile(null);
      setAvatarPreview(null);
      window.location.reload();
    } catch (err: any) {
      setSnackbar({ open: true, message: err.response?.data?.message || "Помилка завантаження аватара", severity: "error" });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 6 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
        Профіль користувача
      </Typography>

      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} sx={{ mb: 3 }}>
          <Tab label="Загальна інформація" />
          <Tab label="Налаштування" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <Stack spacing={4}>
            {/* Аватар та основна інформація */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
              <Box sx={{ position: 'relative' }}>
                <Avatar 
                  src={avatarPreview || user.avatar || undefined}
                  sx={{ 
                    width: 120, 
                    height: 120, 
                    bgcolor: 'primary.main',
                    fontSize: '3rem',
                    fontWeight: 'bold'
                  }}
                >
                  {user.name?.[0]?.toUpperCase() || 'U'}
                </Avatar>
                <IconButton
                  component="label"
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    bgcolor: 'primary.main',
                    color: 'white',
                    '&:hover': { bgcolor: 'primary.dark' }
                  }}
                >
                  <CloudUploadIcon />
                  <Input
                    type="file"
                    sx={{ display: 'none' }}
                    inputProps={{ accept: 'image/*' }}
                    onChange={handleFileChange}
                  />
                </IconButton>
              </Box>
              {avatarFile && (
                <Box>
                  <Button variant="contained" onClick={handleAvatarUpload} sx={{ mr: 1 }}>
                    Зберегти аватар
                  </Button>
                  <Button variant="outlined" onClick={() => { setAvatarFile(null); setAvatarPreview(null); }}>
                    Скасувати
                  </Button>
                </Box>
              )}
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  {isEditingName ? (
                    <>
                      <TextField
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}
                        size="small"
                        sx={{ mr: 1 }}
                      />
                      <IconButton onClick={handleSaveName} color="primary">
                        <SaveIcon />
                      </IconButton>
                      <IconButton onClick={() => { setIsEditingName(false); setEditedName(user.name || ""); }} color="inherit">
                        <CancelIcon />
                      </IconButton>
                    </>
                  ) : (
                    <>
                      <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                        {user.name}
                      </Typography>
                      <IconButton onClick={() => setIsEditingName(true)} size="small">
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </>
                  )}
                </Box>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                  {user.email}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
                  {isAdmin && (
                    <Chip 
                      icon={<AdminPanelSettingsIcon />}
                      label="Адміністратор" 
                      color="error" 
                      sx={{ fontWeight: 'bold' }}
                    />
                  )}
                  {isAuthor && (
                    <Chip 
                      icon={<CreateIcon />}
                      label="Автор" 
                      color="success" 
                      sx={{ fontWeight: 'bold' }}
                    />
                  )}
                  {!isAdmin && !isAuthor && (
                    <Chip 
                      icon={<PersonIcon />}
                      label="Користувач" 
                      color="primary" 
                      sx={{ fontWeight: 'bold' }}
                    />
                  )}
                </Box>
              </Box>
            </Box>

            <Divider />

            {/* Дії */}
            <Box>
              <Typography variant="h6" gutterBottom sx={{ mb: 2, fontWeight: 'bold' }}>
                Дії
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Button 
                  variant="outlined" 
                  color="primary"
                  startIcon={<LogoutIcon />}
                  onClick={handleLogout}
                  sx={{ flex: 1 }}
                >
                  Вийти
                </Button>
                <Button 
                  variant="contained" 
                  color="error"
                  startIcon={<DeleteIcon />}
                  sx={{ flex: 1 }}
                  disabled
                >
                  Видалити акаунт
                </Button>
              </Stack>
            </Box>
          </Stack>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Stack spacing={4}>
            {/* Тема */}
            <Box>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
                Тема інтерфейсу
              </Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={mode === 'dark'}
                    onChange={toggleTheme}
                    icon={<LightModeIcon />}
                    checkedIcon={<DarkModeIcon />}
                  />
                }
                label={mode === 'dark' ? 'Темна тема' : 'Світла тема'}
              />
            </Box>

            <Divider />

            {/* Зміна пароля */}
            <Box>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
                Зміна пароля
              </Typography>
              {isEditingPassword ? (
                <Stack spacing={2}>
                  <TextField
                    label="Поточний пароль"
                    type="password"
                    fullWidth
                    value={passwordData.current}
                    onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })}
                  />
                  <TextField
                    label="Новий пароль"
                    type="password"
                    fullWidth
                    value={passwordData.new}
                    onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })}
                  />
                  <TextField
                    label="Підтвердити новий пароль"
                    type="password"
                    fullWidth
                    value={passwordData.confirm}
                    onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })}
                  />
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button variant="contained" onClick={handleSavePassword}>
                      Зберегти
                    </Button>
                    <Button variant="outlined" onClick={() => { setIsEditingPassword(false); setPasswordData({ current: "", new: "", confirm: "" }); }}>
                      Скасувати
                    </Button>
                  </Box>
                </Stack>
              ) : (
                <Button variant="outlined" onClick={() => setIsEditingPassword(true)}>
                  Змінити пароль
                </Button>
              )}
            </Box>
          </Stack>
        </TabPanel>
      </Paper>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Container>
  );
}
