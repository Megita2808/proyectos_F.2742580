/* eslint-disable @next/next/no-img-element */
import React from 'react';
import Link from 'next/link';
import styles from '@/styles/footerEstilos.module.css';
import { FaFacebook, FaInstagram } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <footer className="bg-light-blue py-10">
      <div className={styles.container}>
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-7 text-center md:text-left text-gray-800">
          
          <div className="flex flex-col items-center md:flex-row md:items-start justify-center md:justify-start col-span-1 md:col-span-2 lg:col-span-2 space-y-4 md:space-y-0">
            <img
              src="/img/icon/marcaRemaster.png"
              alt="Logo Halplast"
              className={`${styles.img} h-20 md:h-40 object-contain mb-4 md:mb-0 md:mr-4`}
              style={{ width: '100%', maxWidth: '120px' }}
            />
            <div className="contact-info text-center md:text-left">
              <h3 className={styles.h3}>Contáctanos</h3>
              <ul className="space-y-2">
                <li>Dirección: Bello</li>
                <li>Teléfono: 320-777-8770</li>
                <li>Email: jphenao9846@gmail.com</li>
              </ul>
              <div className="social-icons flex justify-center md:justify-start space-x-4 mt-4">
                <Link href="/" legacyBehavior>
                  <motion.span
                    className="facebook"
                    whileHover={{ scale: 1.2, opacity: 0.8 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <FaFacebook size={24} className="IconosFooter" />
                  </motion.span>
                </Link>
                <Link href="https://www.instagram.com/halplast/" legacyBehavior>
                  <motion.span
                    className="instagram"
                    whileHover={{ scale: 1.2, opacity: 0.8 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <FaInstagram size={24} className="IconosFooter" />
                  </motion.span>
                </Link>
              </div>
            </div>
          </div>

          <div className="col-span-1">
            <h3 className={styles.h3}>Información</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" legacyBehavior>
                  <a className="hover:text-blue-600 transition-colors">Inicio</a>
                </Link>
              </li>
              <li><a href="/about" className="hover:text-blue-600 transition-colors">Sobre Nosotros</a></li>
              <li><a href="/shop" className="hover:text-blue-600 transition-colors">Tienda</a></li>
            </ul>
          </div>

          <div className="col-span-1">
            <h3 className={styles.h3}>Mayoristas</h3>
            <ul className="space-y-2">
              <li><a href="/pantry-essentials" className="hover:text-blue-600 transition-colors">Volverte mayorista</a></li>
              <li><a href="/gourmet-cocktails" className="hover:text-blue-600 transition-colors">Condiciones mayorista</a></li>
              <li><a href="/liquor" className="hover:text-blue-600 transition-colors">Volverte distribuidor</a></li>
              <li><a href="/gluten-free" className="hover:text-blue-600 transition-colors">Condiciones distribuidor</a></li>
            </ul>
          </div>

          <div className="col-span-1">
            <h3 className={styles.h3}>Cuenta</h3>
            <ul className="space-y-2">
              <li><a href="/account" className="hover:text-blue-600 transition-colors">Mi cuenta</a></li>
              <li><a href="/cart" className="hover:text-blue-600 transition-colors">Carrito de compras</a></li>
              <li><a href="/checkout" className="hover:text-blue-600 transition-colors">Pedidos</a></li>
            </ul>
          </div>

          <div className="col-span-1">
            <h3 className={styles.h3}>Servicios</h3>
            <ul className="space-y-2">
              <li><a href="/terms" className="hover:text-blue-600 transition-colors">Términos y condiciones</a></li>
              <li><a href="/privacy" className="hover:text-blue-600 transition-colors">Políticas de privacidad</a></li>
              <li><a href="/returns" className="hover:text-blue-600 transition-colors">Políticas de devolución</a></li>
              <li><a href="/delivery" className="hover:text-blue-600 transition-colors">Envíos + Pagos</a></li>
            </ul>
          </div>

        </div>
        <div className="mt-10 text-center text-gray-600">
          <p>&copy; 2024 | Halplast by Juan Pablo Henao Patiño</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
