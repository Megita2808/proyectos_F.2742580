"use client";

import React, { useState, useEffect } from 'react';
import CatalogoComponent from '@/components/layaout/elementos/productos';

const Catalogo: React.FC = () => {
    return (
        <div className="bg-gray-50 min-h-screen">
            <CatalogoComponent />
        </div>
    );
};

export default Catalogo;
