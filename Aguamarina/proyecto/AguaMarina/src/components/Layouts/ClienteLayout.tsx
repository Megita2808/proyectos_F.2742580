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
import LoaderFullScreen from "../Loaders/LoaderFullScreen";

  export default function ClienteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState<boolean>(true);

  return (
    <html suppressHydrationWarning={true} /* className="!scroll-smooth" */ lang="en">
      <head>
        <link rel="icon" href="/images/favicon.ico" />

      </head>

      <body>
            <ThemeProvider
              attribute="class"
              enableSystem={false}
              defaultTheme="light"
            >
                <div>
                  <Header setLoadingLayout={setLoading}/>
                  {children}
                  <Footer />
                  <ScrollToTop />
                  {loading ? (
                    <LoaderFullScreen />
                  ): <></>}
                </div>
            </ThemeProvider>
      </body>
    </html>
  );
}