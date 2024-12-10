import './elementos/react-modal/stylesModal.css';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/slice/userSlice';
import UsuarioOpciones from './elementos/UsuarioOpciones';
import { RootState } from '../../redux/store';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import { motion, AnimatePresence } from 'framer-motion';
import CarritoModal from './elementos/carritoCompras/modalCarrito';
import { useAuth } from '@/context/AutenticacionContext';
import { ShoppingCart, Table2Icon, User } from 'lucide-react';

const Navbar = () => {
  const { isLoggedIn, rol } = useAuth();

  const [isMounted, setIsMounted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const router = useRouter();

  const cantidadProductos = useSelector(
    (state: RootState) => state.carrito.carrito.length
  );

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('someKey');
    Swal.fire({
      title: '¡Cierre de sesión exitoso!',
      text: 'Has cerrado sesión de forma exitosa.',
      icon: 'success',
      timerProgressBar: true,
      timer: 1500,
      showConfirmButton: false,
    });
    router.push('/');
  };

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <motion.nav
        className="bg-white border-b shadow-lg z-50 relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4 flex justify-between items-center h-16">
          <motion.div
            className="text-3xl font-bold text-gray-900 cursor-pointer"
            whileHover={{ scale: 1.05 }}
          >
            <Link href="/">Halplast</Link>
          </motion.div>

          <div className="hidden md:flex space-x-8" style={{marginBottom:"-20px"}}>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Link href="/" className="nav-link">
                Inicio
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Link href="/cliente/principal/catalogo" className="nav-link">
                Catálogo
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Link href="/cliente/principal/nosotros" className="nav-link">
                Sobre Nosotros
              </Link>
            </motion.div>
            {user && (user.rol?.permisos.some( permiso => permiso.nombrePermiso === 'Dashboard')) &&
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <Link href="/administrador" className="nav-link">
                  Dashboard Pruebas
                </Link>
              </motion.div>
            }
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Link href="/cliente/principal/distribuidor" className="nav-link">
                Volverte Mayorista
              </Link>
            </motion.div>
            <div className="relative">
              {user.isLoggedIn ? (
                <div className="flex items-center">
                  <motion.button
                    onClick={toggleDropdown}
                    className="flex items-center text-gray-700 hover:text-gray-500"
                    whileHover={{ scale: 1.1 }}
                  >
                    <span className="mr-2">{rol?.nombreRol}</span>
                    {<User className="h-6 w-6" />}
                  </motion.button>
                  <AnimatePresence>
                    {isDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="absolute right-0 top-7 mt-2 w-48 bg-white shadow-lg rounded-md z-30"
                      >
                        <Link
                          href={
                            user.rol?.nombreRol === 'Administrador' ||
                            user.rol?.nombreRol === 'Empleado'
                              ? '/administrador/perfil'
                              : '/cliente/principal/perfil'
                          }
                          className="dropdown-link"
                          style={{ textAlign: 'center' }}
                        >
                          Perfil
                        </Link>
                        <button onClick={handleLogout} className="dropdown-link">
                          Cerrar Sesión
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <UsuarioOpciones />
              )}
            </div>
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="relative ml-4"
            >
              <motion.button
                className="text-black rounded-full flex items-center justify-center"
                whileTap={{ scale: 1.2 }}
                onClick={openModal}
                style={{ borderBlockColor: 'transparent' }}
              >
                <ShoppingCart size={30} />
              </motion.button>
              {cantidadProductos > 0 && (
                <div
                  className="absolute text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                  style={{ bottom: '22px', left: '15px', backgroundColor: '#ffb1ac' }}
                >
                  {cantidadProductos}
                </div>
              )}
            </motion.div>
          </div>

          <motion.div className="md:hidden" whileHover={{ scale: 1.2 }}>
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
            >
              <i className={`bx ${isOpen ? 'bx-x' : 'bx-menu'} text-3xl`}></i>
            </button>
          </motion.div>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.42, 0, 0.58, 1] }}
              className="md:hidden bg-white shadow-lg"
            >
              <div className="space-y-1 px-2 pt-2 pb-3">
              <Link href="/" className="mobile-nav-link">
                  Inicio
                </Link>
                <Link href="/cliente/principal/catalogo" className="mobile-nav-link">
                  Catálogo
                </Link>
                <Link href="/cliente/principal/nosotros" className="mobile-nav-link">
                  Sobre Nosotros
                </Link>
                <Link href="/cliente/principal/distribuidor" className="mobile-nav-link">
                  Volverte Mayorista
                </Link>
                {user && (user.rol?.permisos.some( permiso => permiso.nombrePermiso === 'Dashaboard')) &&
                  <Link href="/cliente/principal/distribuidor" className="mobile-nav-link">
                    Dashboard Pruebas
                  </Link>
                }
                <div>
                  {user.isLoggedIn ? (
                    <motion.div whileHover={{ scale: 1.05 }}>
                      <motion.button
                        onClick={toggleDropdown}
                        className="flex items-center text-gray-700 hover:text-gray-500"
                        whileHover={{ scale: 1.1 }}
                      />
                      <AnimatePresence>
                        {isDropdownOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                            className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md z-30"
                          >
                            <Link
                              href={
                                user.rol?.nombreRol === 'Administrador' ||
                                user.rol?.nombreRol === 'Empleado'
                                  ? '/administrador/perfil'
                                  : '/cliente/principal/perfil'
                              }
                              className="dropdown-link"
                            >
                              Perfil
                            </Link>
                            <button onClick={handleLogout} className="dropdown-link">
                              Cerrar Sesión
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ) : (
                    <UsuarioOpciones />
                  )}
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative"
                  >
                    <motion.button
                      className="text-black rounded-full flex items-center justify-center"
                      whileTap={{ scale: 1.2 }}
                      onClick={openModal}
                    >
                      <ShoppingCart size={30} />
                    </motion.button>
                    {cantidadProductos > 0 && (
                      <div className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                        {cantidadProductos}
                      </div>
                    )}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
      <CarritoModal isOpen={isModalOpen} onRequestClose={closeModal} />
    </>
  );
};

export default Navbar;
