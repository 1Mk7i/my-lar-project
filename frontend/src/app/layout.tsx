// app/layout.tsx

import { ThemeRegistry, Header, Footer } from "@/components";
import { AuthProvider } from "@/context/AuthContext"; // <-- Імпортуємо провайдер
import { Box } from "@mui/material";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk">
      <body suppressHydrationWarning={true}> 
        <ThemeRegistry>
          {/* Обгортаємо весь UI в AuthProvider */}
          <AuthProvider> 
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              minHeight: '100vh',
              backgroundColor: 'background.default'
            }}>
              <Header />
              <Box component="main" sx={{ flexGrow: 1 }}>
                {children}
              </Box>
              <Footer />
            </Box>
          </AuthProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}