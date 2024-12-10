"use client";
import React, { useEffect } from 'react';
import Formulario from '@/components/layaout/elementos/Formulario';
import CustomerCarousel from '@/components/layaout/elementos/CarouselDistribuidores';
const Catalogo: React.FC = () => {

    return (
        <div className="bg-gray-50 min-h-screen">

            <Formulario />
            <br /><br /><br />
            <section>
                <h1 style={{textAlign: 'center'}}>Nuestros actuales distribuidor</h1>
                <h4 style={{textAlign: 'center'}}>! Conviertete en unos de nosotros ¡</h4><br /><br />
                <CustomerCarousel />
            </section>
        </div>
      );
};

export default Catalogo;
