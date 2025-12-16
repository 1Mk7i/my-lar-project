"use client";

import { Box, Typography, Paper, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export default function AdminRules() {
  const rules = [
    "Повний доступ до управління користувачами: перегляд, редагування, видалення",
    "Управління книгами: додавання, редагування, видалення будь-яких книг",
    "Можливість змінювати ролі користувачів (Користувач, Автор, Адміністратор)",
    "Блокування та розблокування користувачів",
    "Видалення коментарів будь-яких користувачів",
    "Перегляд статистики системи",
    "Модерація контенту"
  ];

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
        Права та обов'язки адміністратора
      </Typography>
      
      <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
        <List>
          {rules.map((rule, index) => (
            <ListItem key={index}>
              <ListItemIcon>
                <CheckCircleIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary={rule} />
            </ListItem>
          ))}
        </List>
      </Paper>

      <Box sx={{ mt: 4, p: 3, bgcolor: 'warning.light', borderRadius: 2 }}>
        <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1 }}>
          ⚠️ Увага
        </Typography>
        <Typography variant="body2">
          Адміністратор має повний доступ до системи. Будьте обережні при виконанні дій, 
          особливо при видаленні даних, оскільки ці дії незворотні.
        </Typography>
      </Box>
    </Box>
  );
}

