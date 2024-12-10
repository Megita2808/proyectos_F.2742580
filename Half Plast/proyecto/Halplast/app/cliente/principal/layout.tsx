"use client";
import '@/styles/globals.css';
import 'sweetalert2/dist/sweetalert2.min.css';
import { useState, useEffect, ReactNode } from "react";
import Navbar from '@/components/layaout/Navbar';
import Footer from '@/components/layaout/Footer';
import Header from '@/components/layaout/Header';
import Gallery from '@/components/layaout/elementos/Gallery';

export default function RootLayout({ children }: { children: ReactNode }) {

  return (
    <div id="root">
      <Navbar />
      <Header />
      <main>
        <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
          {children}
        </div>
      </main>
      <Gallery />
      <Footer />
    </div>
  );
}
