"use client";
import React, { useEffect } from 'react';
import FormularioRegistro from '@/components/cliente/RegistroCliente';

const Login: React.FC = () => {

  useEffect(() => {
    const linkBoxicons = document.createElement('link');
    linkBoxicons.href = 'https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css';
    linkBoxicons.rel = 'stylesheet';
    document.head.appendChild(linkBoxicons);

    return () => {
      document.head.removeChild(linkBoxicons);
    };
  }, []);

  return (
    <FormularioRegistro />
  );
};

export default Login;
