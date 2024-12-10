"use client";

import { useEffect, useRef, useState } from "react";
import { Provider } from 'react-redux';
import { store } from '@/redux/store';
import { getCatalogo } from "@/service/api/catalogo/catalogo/TodoCatalogo";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { AuthProvider } from '@/context/AutenticacionContext';
import { Analytics } from "@vercel/analytics/react";

function NetworkMonitor({ children }: { children: React.ReactNode }) {
  const [isOnline, setIsOnline] = useState<boolean>(typeof navigator !== "undefined" ? navigator.onLine : true);

  useEffect(() => {
    const updateNetworkStatus = () => {
      const online = navigator.onLine;
      setIsOnline(online);

      if (!online) {
        console.warn("Sin conexión a internet - Todos los procesos se detendrán.");
      } else {
        console.info("Conexión restaurada - Los procesos continuarán.");
      }
    };
    
    updateNetworkStatus();

    window.addEventListener("online", updateNetworkStatus);
    window.addEventListener("offline", updateNetworkStatus);

    return () => {
      window.removeEventListener("online", updateNetworkStatus);
      window.removeEventListener("offline", updateNetworkStatus);
    };
  }, []);

  if (!isOnline) {
    return (
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "white",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999
      }}>
        <div style={{ textAlign: "center" }}>
          <h1 style={{ color: "red", fontSize: "2rem" }}>Sin conexión a internet</h1>
          <p>Por favor, verifica tu conexión para continuar.</p>
        </div>
      </div>
    );
  }
  return <>{children}</>;
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    const fetchAndStoreCatalogo = async () => {
      try {
        const localCatalogo = localStorage.getItem('catalogo');
        let parsedCatalogo: any = null;
        if (localCatalogo) {
          parsedCatalogo = JSON.parse(localCatalogo);
        }
        const isEmpty = !parsedCatalogo || !Array.isArray(parsedCatalogo.catalogo) || parsedCatalogo.catalogo.length === 0;
        if (isEmpty && !hasFetchedRef.current) {
          const catalogo = await getCatalogo();
          localStorage.setItem('catalogo', JSON.stringify(catalogo));
          hasFetchedRef.current = true;
        }
      } catch (error) {
        console.error("Error al obtener el catálogo:", error);
      }
    };

    const handleStorage = (event: StorageEvent) => {
      if (event.key === 'catalogo') {
        hasFetchedRef.current = false;
        fetchAndStoreCatalogo();
      }
    };

    window.addEventListener('storage', handleStorage);

    const interval = setInterval(() => {
      const localCatalogo = localStorage.getItem('catalogo');
      let parsedCatalogo: any = null;
      if (localCatalogo) {
        try {
          parsedCatalogo = JSON.parse(localCatalogo);
        } catch {
          console.warn("Error al parsear el catálogo local.");
        }
      }
      const isEmpty = !parsedCatalogo || !Array.isArray(parsedCatalogo.catalogo) || parsedCatalogo.catalogo.length === 0;
      if (isEmpty && !hasFetchedRef.current) {
        fetchAndStoreCatalogo();
      }
    }, 5000);

    return () => {
      window.removeEventListener('storage', handleStorage);
      clearInterval(interval);
    };
  }, []);

  return (
    <Provider store={store}>
      <AuthProvider>
        <NetworkMonitor>
          <html lang="en">
            <head>
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
              <title>Halplast - Soluciones de Embalaje</title>
              <meta name="description" content="Líderes en la producción y distribución de film stretch y soluciones de embalaje de alta calidad." />
              <meta name="keywords" content="Halplast, film stretch, embalaje, alta calidad, distribución de embalaje" />
              <meta property="og:image" content="https://raw.githubusercontent.com/castano208/imagenesHalplast/main/logo.png" />
              <link rel="icon" href="https://raw.githubusercontent.com/castano208/imagenesHalplast/main/logo.png" type="image/x-icon" />
            </head>
            <body suppressHydrationWarning={true}>
              <SpeedInsights />
              <div id="root">
                {children}
              </div>
              <Analytics />
            </body>
          </html>
        </NetworkMonitor>
      </AuthProvider>
    </Provider>
  );
}
