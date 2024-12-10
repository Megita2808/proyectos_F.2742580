/* eslint-disable @next/next/no-img-element */
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const Header = () => {
  return (
    <motion.header
      className="relative h-64 md:h-96 z-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7 }}
    >
      <motion.img
        src="/product-placeholder.jpg"
        alt="Producto"
        className="w-full h-full object-cover"
        initial={{ scale: 1.2 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1 }}
      />
      <div className="absolute inset-0 flex flex-col justify-center items-center bg-black bg-opacity-50 z-10">
        <motion.div
          className="text-center text-white px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <h1 className="text-4xl font-bold mb-4 drop-shadow-lg">Bienvenido a Halplast</h1>
          <p className="text-lg drop-shadow-lg">Encuentra los mejores productos de embalaje al mejor precio</p>
          <div className="flex flex-row items-center justify-center space-x-4 mt-3">
            <motion.div
              className="max-w-sm p-4 rounded-md bg-white bg-opacity-10 mt-6"
              initial={{ opacity: 0, scale: 0.8 }} 
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <p className="text-sm text-white">
                Productores y distribuidores líderes de film stretch de alta calidad
              </p>
            </motion.div>

            <motion.div
              className="max-w-sm p-4 rounded-md bg-white bg-opacity-10 mt-6"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <p className="text-sm text-white">
                Si deseas convertirte en distribuidor o mayorista, envíanos una solicitud a través de nuestro apartado o presionando
                <Link href="/" legacyBehavior>
                  <a className="text-base font-bold text-blue-400 hover:text-blue-600 transition-all duration-300 ml-1">
                    aquí
                  </a>
                </Link>
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.header>
  );
};

export default Header;
