"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const CheckCart = () => {
  const router = useRouter();

  useEffect(() => {
    // Solo se ejecutará en el cliente, después de que el componente se haya montado
    const carrito = localStorage.getItem('cart');
    if (!carrito) {
      // Si no hay productos en el carrito, redirige a la página principal
      router.push('/'); // Redirigir a la página principal
      alert('No hay productos en el carrito');
    }
  }, [router]); // La dependencia 'router' garantiza que el código solo se ejecute después de que el componente se haya montado

  return null; // Este componente no renderiza nada, solo realiza la verificación y redirección
};

export default CheckCart;
