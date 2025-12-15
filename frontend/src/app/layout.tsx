// app/layout.tsx

import ThemeRegistry from "@/components/ThemeRegistry";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/context/AuthContext"; // <-- Імпортуємо провайдер

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk">
      <body suppressHydrationWarning={true}> 
        <ThemeRegistry>
          {/* Обгортаємо весь UI в AuthProvider */}
          <AuthProvider> 
            <Header />
            <main>{children}</main>
            <Footer />
          </AuthProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}