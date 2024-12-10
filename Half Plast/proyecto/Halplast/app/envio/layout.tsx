"use client";
import '@/styles/globals.css';
import 'sweetalert2/dist/sweetalert2.min.css';
import { useState, useEffect, ReactNode } from "react";
import Navbar from '@/components/layaout/Navbar';

export default function RootLayout({ children }: { children: ReactNode }) {

  return (
    <main>
      <Navbar />
      <div style={{backgroundColor:'white'}}>
        {children}
      </div>
    </main>
  );
}
