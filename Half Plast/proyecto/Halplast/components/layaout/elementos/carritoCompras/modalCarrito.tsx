/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { useDispatch, useSelector } from 'react-redux';
import { modificarCantidad, eliminarProducto, modificarPeso } from '@/redux/slice/carritoCompra';
import { RootState } from '@/redux/store';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaTrash, FaEdit, FaEllipsisV } from 'react-icons/fa';
import { useAuth } from '@/context/AutenticacionContext';
import { useRouter, usePathname } from 'next/navigation';
import Swal from 'sweetalert2';

interface CarritoModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
}

const CarritoModal: React.FC<CarritoModalProps> = ({ isOpen, onRequestClose }) => {
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  const dispatch = useDispatch();
  const carrito = useSelector((state: RootState) => state.carrito.carrito);
  const [totalCarrito, setTotalCarrito] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const lastIndex = currentPage * itemsPerPage;
  const firstIndex = lastIndex - itemsPerPage;
  const currentItems = carrito.slice(firstIndex, lastIndex);

  useEffect(() => {
    Modal.setAppElement('#root');
  }, []);

  useEffect(() => {
    if (carrito.length <= itemsPerPage) setCurrentPage(1);
  }, [carrito]);

  const nextPage = () => setCurrentPage((prev) => prev + 1);
  const prevPage = () => setCurrentPage((prev) => prev - 1);

  const handleModificarCantidad = (idProducto: string, idColor: string, Peso: number, cantidad: number, longitud: number | { parte1: number; parte2: number }) => {
    if (cantidad > 0) {
      dispatch(modificarCantidad({ idProducto, idColor, Peso, cantidad, longitud }));
    } else {
      dispatch(eliminarProducto({ idProducto, idColor, Peso, longitud }));
    }
  };
  
  const handleModificarPeso = (idProducto: string, idColor: string, Peso: number, longitud: number | { parte1: number; parte2: number }) => {
    if (Peso > 0) {
      dispatch(modificarPeso({ idProducto, idColor, Peso, longitud }));
    } else {
      dispatch(eliminarProducto({ idProducto, idColor, Peso:(Peso + 1), longitud }));
    }
  }
  
  const calcularPrecioTotal = (precioUnitario: number, peso: number, cantidad:number) => {
    return precioUnitario * peso * cantidad;
  };

  const calcularPrecioTotalSinPeso = (precioUnitario: number, longitud: number, cantidad:number) => {
    return precioUnitario * longitud * cantidad;
  };

  const calcularPrecioTotalModificado = (precioUnitario: number, longitud: number, longitudProducto: number, cantidad:number) => {
    return (precioUnitario * ((longitud * 2) *  longitudProducto)) * cantidad;
  };

  const convertirDecimalAFraccion = (valor: number): string => {
    const parteEntera = Math.floor(valor);
    const parteDecimal = valor - parteEntera;

    if (parteDecimal === 0) {
        return parteEntera.toString();
    }

    const decimalStr = parteDecimal.toString().split('.')[1];
    let denominador = Math.pow(10, decimalStr.length);
    let numerador = Math.round(parteDecimal * denominador);
    const calcularMCD = (a: number, b: number): number => {
        return b === 0 ? a : calcularMCD(b, a % b);
    };

    const mcd = calcularMCD(numerador, denominador);
    numerador /= mcd;
    denominador /= mcd;

    return parteEntera > 0 ? `${parteEntera} ${numerador}/${denominador}` : `${numerador}/${denominador}`;
  };

  const calcularTotalCarrito = () => {
    return carrito.reduce((total, producto) => {
      const precioUnitario = producto.precioUnitario;
      const cantidad = producto.cantidad;
  
      let precioProducto = 0;
  
      if (typeof producto.longitud === 'number') {
        if (producto.simboloLongitud === "½") {
          precioProducto = calcularPrecioTotalModificado(precioUnitario, producto.longitud, producto.longitudProducto, cantidad);
        } else if (producto.simboloLongitud === "Mt²") {
          if (producto.simboloprecioUnitario === 'Kg'){
            precioProducto = calcularPrecioTotal(precioUnitario, producto.peso, cantidad);
          }else{
            precioProducto = calcularPrecioTotalSinPeso(precioUnitario, producto.longitud, cantidad);
          }
        } else if (producto.peso === 0 && producto.simboloPeso === '') {
          precioProducto = calcularPrecioTotalSinPeso(precioUnitario, producto.longitud, cantidad);
        } else {
          precioProducto = calcularPrecioTotal(precioUnitario, producto.peso, cantidad);
        }
      } else if (typeof producto.longitud === 'object'){
        precioProducto=  calcularPrecioTotalSinPeso(producto.precioUnitario, producto.longitud.parte1 + producto.longitud.parte2,  producto.cantidad);
      } else {
        precioProducto = calcularPrecioTotal(precioUnitario, producto.peso || 0, cantidad);
      }
  
      return total + precioProducto;
    }, 0);
  };

  const finalizarCompra = () => {
      if(isLoggedIn){
        router.push('/envio');
      }else {
        Swal.fire({
          title: '¡Atención! No se ha identificado un usuario',
          text: 'Inicie sesión para realizar una compra.',
          icon: 'info',
          showCancelButton: false,
          confirmButtonText: 'Ir a Iniciar Sesión',
          timerProgressBar: true,
        }).then((result) => {
          if (result.isConfirmed) {
            router.push('/cliente/login/cliente');
          }
        });
      }
  }
  
  useEffect(() => {
    const total = calcularTotalCarrito();
    setTotalCarrito(total);
  }, [carrito]); 


  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Carrito de Compras"
      className="ModalCarrito"
      shouldCloseOnOverlayClick={false}
      shouldCloseOnEsc={false}  
      style={{
        overlay: { backgroundColor: 'rgba(0, 0, 0, 0.75)' },
        content: {
          maxWidth: '90%',
          maxHeight: '80vh',
          overflowY: 'auto',
          margin: 'auto',
          borderRadius: '10px',
          padding: '20px',
          background: '#fff',
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)'
        }
      }}
    >
      <motion.div
        initial="hidden"
        animate={isOpen ? 'visible' : 'hidden'}
        exit="exit"
        variants={{
          hidden: { opacity: 0, scale: 0.3 },
          visible: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 500, damping: 40 } },
          exit: { opacity: 0, scale: 0.8, transition: { duration: 0.3 } },
        }}
      >
        <h2 style={{
          fontSize: '24px',
          fontWeight: 'bold',
          textAlign: 'center',
          color: '#333',
          marginBottom: '20px',
          padding: '10px',
          backgroundColor: '#f5f5f5',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        }}>
          Carrito de Compras
        </h2>
        {carrito.length > 0 ? (
          <AnimatePresence>
            <table className="carrito-table">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Medida</th>
                  <th>Color</th>
                  <th>Peso</th>
                  <th>Precio</th>
                  <th>Cantidad</th>
                  <th>Acciones Cantidad</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((producto, index) => (
                  <motion.tr key={index} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <td>{producto.productoNombre}</td>
                    <td>
                      {
                        (() => {
                          if (typeof producto.longitud === 'number') {
                            if (producto.simboloLongitud === "½") {
                              return convertirDecimalAFraccion(producto.longitud) + ' X ' + producto.longitudProducto + ' ' + producto.longitudProductoSimbolo;
                            } else {
                              return producto.longitud + ' ' + producto.simboloLongitud;
                            }
                          } else if (typeof producto.longitud === 'object' && producto.longitud.parte1 && producto.longitud.parte2) {
                            const fraccion = `${producto.longitud.parte1}/${producto.longitud.parte2}`;
                            return fraccion + ' ' + producto.simboloLongitud;
                          }
                          return '';
                        })()
                      }
                    </td>
                    <td>{producto.colorNombre}</td>
                    <td>
                      {producto.peso === 0 ? 'Indiferente' : `${producto.peso} ${producto.simboloPeso}`}
                    </td>
                    <td>
                      {(() => {
                        if (typeof producto.longitud === 'number') {
                          if (producto.simboloLongitud === "½") {
                            return calcularPrecioTotalModificado(producto.precioUnitario, producto.longitud, producto.longitudProducto, producto.cantidad).toLocaleString('es-CO', {
                              minimumFractionDigits: 0,
                            });
                          }else if (producto.simboloprecioUnitario === "Kg") {
                            return calcularPrecioTotal(producto.precioUnitario, producto.peso,  producto.cantidad).toLocaleString('es-CO', {
                              minimumFractionDigits: 0,
                            });
                          } else if (producto.simboloLongitud === "Mt²" && producto.simboloprecioUnitario !== "Kg") {
                            return calcularPrecioTotalSinPeso(producto.precioUnitario, producto.longitud,  producto.cantidad).toLocaleString('es-CO', {
                              minimumFractionDigits: 0,
                            });
                          } else if (producto.peso == 0 && producto.simboloPeso == '') {
                            return calcularPrecioTotalSinPeso(producto.precioUnitario, producto.longitud,  producto.cantidad).toLocaleString('es-CO', {
                              minimumFractionDigits: 0,
                            });
                          } else {
                            return calcularPrecioTotal(producto.precioUnitario, producto.peso, producto.cantidad).toLocaleString('es-CO', {
                              minimumFractionDigits: 0,
                            });
                          }
                        }else if (typeof producto.longitud === 'object'){
                          return calcularPrecioTotalSinPeso(producto.precioUnitario, producto.longitud.parte1 * producto.longitud.parte2,  producto.cantidad).toLocaleString('es-CO', {
                            minimumFractionDigits: 0,
                          });
                        }
                        return '';
                      })()}
                    </td>
                    <td><span>{producto.cantidad}</span></td>
                    <td style={{ whiteSpace: 'nowrap', padding: '5px' }}>
                      <motion.button
                        onClick={() => (producto.simboloprecioUnitario === 'Kg' ? handleModificarPeso(producto.idProducto, producto.idColor, producto.peso + 1, producto.longitud) : handleModificarCantidad(producto.idProducto, producto.idColor, producto.peso, producto.cantidad + 1, producto.longitud))}
                        initial={{ opacity: 0, y: -10, backgroundColor: "#f0f0f0", color: "#000" }}
                        animate={{ opacity: 1, y: 0, backgroundColor: "#f0f0f0", color: "#000" }}
                        transition={{ type: "spring", stiffness: 300, damping: 15 }}
                        whileHover={{ 
                          scale: 1.3, 
                          rotate: 10, 
                          backgroundColor: "#4caf50",
                          color: "#fff",
                          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.25)"
                        }}
                        whileTap={{ 
                          scale: 0.8, 
                          rotate: -10, 
                          backgroundColor: "#388e3c",
                          color: "#fff",
                          transition: { type: "spring", stiffness: 400, damping: 12 } 
                        }}
                        style={{ marginRight: '8px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', padding: '8px', borderRadius: '8px' }}
                      >
                        <FaPlus />
                      </motion.button>

                      <motion.button
                        onClick={() => (producto.simboloprecioUnitario === 'Kg' ? handleModificarPeso(producto.idProducto, producto.idColor, producto.peso - 1, producto.longitud) : handleModificarCantidad(producto.idProducto, producto.idColor, producto.peso, producto.cantidad - 1, producto.longitud))}
                        initial={{ opacity: 0, y: -10, backgroundColor: "#f0f0f0", color: "#000" }}
                        animate={{ opacity: 1, y: 0, backgroundColor: "#f0f0f0", color: "#000" }}
                        transition={{ type: "spring", stiffness: 300, damping: 15 }}
                        whileHover={{ 
                          scale: 1.2, 
                          rotate: -15, 
                          backgroundColor: "#f44336",
                          color: "#fff",
                          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.25)"
                        }}
                        whileTap={{ 
                          scale: 0.8, 
                          rotate: -10, 
                          backgroundColor: "#d32f2f",
                          color: "#fff",
                          transition: { type: "spring", stiffness: 400, damping: 12 } 
                        }}
                        style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer', padding: '8px', borderRadius: '8px' }}
                      >
                        <FaTrash />
                      </motion.button>
                    </td>
                    <td style={{ padding: '5px', whiteSpace: 'nowrap' }}>
                      <div className="action-icons" style={{ display: 'flex', gap: '10px' }}>
                        <motion.button
                          onClick={() => dispatch(eliminarProducto({ idProducto: producto.idProducto, idColor: producto.idColor, Peso: producto.peso, longitud : producto.longitud }))}
                          initial={{ opacity: 0, y: -10, color: "#000" }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ type: "spring", stiffness: 300, damping: 15 }}
                          whileHover={{ 
                            scale: 1.2, 
                            rotate: 15, 
                            backgroundColor: "#f44336",
                            color: "#fff",
                            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.25)"
                          }}
                          whileTap={{ 
                            scale: 0.9, 
                            rotate: -15, 
                            backgroundColor: "#d32f2f",
                            color: "#fff",
                            transition: { type: "spring", stiffness: 400, damping: 12 } 
                          }}
                          style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer', padding: '8px', borderRadius: '8px' }}
                        >
                          <FaTrash />
                        </motion.button>

                        <motion.button
                          onClick={() => ('console.logAcciones adicionales')}
                          initial={{ opacity: 0, y: -10, color: "#000" }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ type: "spring", stiffness: 300, damping: 15 }}
                          whileHover={{ 
                            scale: 1.2, 
                            rotate: -15, 
                            backgroundColor: "#ffa726",
                            color: "#fff",
                            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.25)"
                          }}
                          whileTap={{ 
                            scale: 0.9, 
                            rotate: 15, 
                            backgroundColor: "#fb8c00",
                            color: "#fff",
                            transition: { type: "spring", stiffness: 400, damping: 12 } 
                          }}
                          style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer', padding: '8px', borderRadius: '8px' }}
                        >
                          <FaEllipsisV />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </AnimatePresence>
        ) : (
          <p>El carrito está vacío.</p>
        )}
        <div>
          {carrito.length > itemsPerPage && (
            <>
              <button
                className='buttonModalCarrito'
                onClick={prevPage}
                disabled={currentPage === 1}
                style={{ marginRight: '10px' }}
              >
                Anterior
              </button>
              <button
                className='buttonModalCarrito'
                onClick={nextPage}
                disabled={currentPage * itemsPerPage >= carrito.length}
              >
                Siguiente
              </button>
            </>
          )}
          {carrito.length > 0  &&
            <>
              <button className='buttonModalCarritoComprar'  onClick={finalizarCompra}>Comprar</button>
            </> 
          }
          <button className='buttonModalCarritoCerrar' onClick={onRequestClose}>
            Cerrar
          </button>
          {totalCarrito > 0 && (
          <h2>Total del Carrito: {totalCarrito.toLocaleString('es-CO', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })} Pesos</h2>
        )}
        </div>
      </motion.div>
    </Modal>
  );
};

export default CarritoModal;
