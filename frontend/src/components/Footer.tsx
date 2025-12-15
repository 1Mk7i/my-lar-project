"use client";

import { Box, Container, Typography, Link, Stack } from "@mui/material";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#f5f5f5",
        py: 4,
        mt: 'auto',
        borderTop: "1px solid #e0e0e0",
      }}
    >
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
        >
          <Typography variant="body2" color="text.secondary">
            © 2025 BookStore. Всі права захищені.
          </Typography>
          <Stack direction="row" spacing={2}>
            <Link href="#" underline="hover" color="inherit">
              Про нас
            </Link>
            <Link href="#" underline="hover" color="inherit">
              Контакти
            </Link>
            <Link href="#" underline="hover" color="inherit">
              Політика конфіденційності
            </Link>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
