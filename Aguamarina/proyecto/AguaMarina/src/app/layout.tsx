"use client";

import Footer from "@/components/Clients/Footer";
import Header from "@/components/Clients/Header";
import ScrollToTop from "@/components/Clients/ScrollToTop";
// import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import "@/css/Clientes/index.css";
import "@/css/Clientes/prism-vsc-dark-plus.css";
import { useEffect, useState } from "react";
import PreLoader from "@/components/Clients/Common/PreLoader";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 100);
  }, []);

  return (
    <html suppressHydrationWarning={true} /* className="!scroll-smooth" */ lang="en">

      <head />

      <body>
        <AuthProvider>
          <CartProvider>
            {children}  
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
