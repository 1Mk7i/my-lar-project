"use client";

import { Box, Container, Typography, Link, Stack, Divider } from "@mui/material";

export default function Footer() {
  return (
    <Box
      component="footer"
      suppressHydrationWarning
      sx={{
        backgroundColor: "primary.main",
        color: 'white',
        py: 4,
        mt: 'auto',
        borderTop: "3px solid",
        borderColor: 'primary.dark'
      }}
    >
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
        >
          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
            © 2025 BookStore. Всі права захищені.
          </Typography>
          <Stack direction="row" spacing={3} suppressHydrationWarning>
            <Link 
              href="#" 
              underline="hover" 
              sx={{ 
                color: 'white',
                '&:hover': {
                  color: 'primary.light'
                }
              }}
            >
              Про нас
            </Link>
            <Link 
              href="#" 
              underline="hover" 
              sx={{ 
                color: 'white',
                '&:hover': {
                  color: 'primary.light'
                }
              }}
            >
              Контакти
            </Link>
            <Link 
              href="#" 
              underline="hover" 
              sx={{ 
                color: 'white',
                '&:hover': {
                  color: 'primary.light'
                }
              }}
            >
              Політика конфіденційності
            </Link>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
