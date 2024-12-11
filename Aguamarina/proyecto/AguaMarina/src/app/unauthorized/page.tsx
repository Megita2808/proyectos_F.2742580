'use client';
import React, { useEffect, useState } from 'react';
import { Button, Result } from 'antd';
import Link from 'next/link';
import Image from 'next/image';
import LoaderFullScreen from '@/components/Loaders/LoaderFullScreen';

const App: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Simula un tiempo de carga para garantizar que todo esté listo
    const timeout = setTimeout(() => setIsLoaded(true), 100); // Ajusta el tiempo si es necesario
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div style={{
        position: 'fixed',
        inset: 0, // Top, right, bottom, left a 0
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundImage: 'url("/images/grids/bg-morado-bordes-calidad.png")', // Ruta de tu imagen
        backgroundSize: 'cover', // Hace que la imagen cubra todo el fondo
        backgroundPosition: 'center', // Centra la imagen
        backgroundRepeat: 'no-repeat', // Evita que la imagen se repita
      }}>
      <div
        style={{
          position: 'fixed',
          inset: 0, // Top, right, bottom, left a 0
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999,
          backgroundColor: 'rgba(0, 0, 0, 0.6)', // Color oscuro superpuesto
          backdropFilter: 'blur(5px)', // Desenfoque del fondo
          WebkitBackdropFilter: 'blur(5px)',
        }}
      > 
      {isLoaded ? (
        <div className="flex flex-col justify-center items-center align-middle bg-gray-dark bg-opacity-15 backdrop-blur-md text-white rounded-xl p-2">
        <Image
          src={`/images/logo/LogoCompletoNegativo.png`}
          alt="Logo"
          width={400}
          height={50}
        />
        <Result
          status="403"
          title={
            <span style={{ fontSize: '3rem', fontWeight: 'bold', color: "whitesmoke" }}>¿Que haces?</span> // Agranda el título
          }
          subTitle={
            <span style={{ fontSize: '1.5rem', color: "whitesmoke" }}>
              No estás autorizado por AguaMarina para estar aquí
            </span>
          }
          extra={
            <Link
              href="/"
              className="rounded-lg  px-7 py-3 text-base font-medium text-white hover:text-gray-4 duration-200 transform bg-white/10 hover:bg-white/20"
            >
              Volver al Inicio
            </Link>
          }
        />
      </div>

      ): (
        <LoaderFullScreen />
      )}
        
      </div>
    </div>
    
  );
};

export default App;
