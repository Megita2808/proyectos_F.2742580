"use client";
import "../cssLog/globals.css";
import 'sweetalert2/dist/sweetalert2.min.css';
import React, { useEffect, useState, ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import Loader from "@/components/layaout/elementos/loader";

export default function ClienteLayout({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    document.body.classList.add('global_reset', 'bodyR');

    const existingLink = document.querySelector("link[href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css']");
    
    if (!existingLink) {
      const linkBoxicons = document.createElement('link');
      linkBoxicons.href = 'https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css';
      linkBoxicons.rel = 'stylesheet';
      linkBoxicons.onload = () => setLoading(false);
      document.head.appendChild(linkBoxicons);
    } else {
      setLoading(false);
    }

    return () => {
      document.body.classList.remove('global_reset', 'bodyR');
    };
  }, [pathname]);

  if (loading) {
    return <Loader/>
  }

  return <>{children}</>;
}
