import Image from "next/image";
import React, { useState } from "react";
import { ProductoCliente } from "@/types/Clients/productoCliente";
import { InputNumber } from "antd";
import { useCart } from "@/context/CartContext";
import toast, { Toaster } from "react-hot-toast";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import SliderObjects from "@/components/SliderObjects/SliderObjects";

// const modalStyle = {
//   position: "absolute",
//   top: "50%",
//   left: "50%",
//   transform: "translate(-50%, -50%)",
//   width: "80%",
//   height: "80%",
//   maxWidth: "1000px",
//   bgcolor: "#1F2A37",
//   color: "white",
//   borderRadius: "10px",
//   boxShadow: 24,
//   padding: "20px",
//   display: "flex",
//   flexDirection: "column",
//   transition: "transform 0.3s ease-in-out",
//   position: "relative", // Necesario para que los elementos con "position: absolute" se posicionen bien
// };

// const modalContentStyle = {
//   display: "flex", // Usamos flexbox para alinear los elementos en fila
//   flexDirection: "row", // Colocamos los elementos en fila (imagen a la izquierda, texto a la derecha)
//   gap: "20px", // Espacio entre la imagen y el texto
//   flexGrow: 1, // Hace que el contenido se expanda para llenar el espacio disponible
//   overflow: "auto", // Habilita desplazamiento si el contenido excede el tamaño
// };

// const imageStyle = {
//   width: "100%", // Ancho flexible para que se ajuste al contenedor
//   height: "auto", // Mantener la proporción de la imagen
//   objectFit: "cover", // Mantener el aspecto de la imagen
//   borderRadius: "10px", // Bordes redondeados para la imagen
//   aspectRatio: "1 / 1", // Mantener relación de aspecto cuadrada si la imagen es cuadrada
// };

// const textStyle = {
//   fontSize: "1.2rem", // Aumentar el tamaño del texto
//   lineHeight: "1.6", // Espaciado entre líneas
//   overflow: "hidden", // Asegurarse de que la descripción no se desborde
//   wordWrap: "break-word", // Permitir que el texto se divida si es largo
//   wordBreak: "break-word", // Romper el texto largo si es necesario
//   marginBottom: "4rem",
// };

// const buttonContainerStyle = {
//   fontSize: "2rem", // Aumentar el tamaño del texto
//   display: "flex", // Usamos flexbox
//   flexDirection: "column", // Colocamos los elementos en columna
//   justifyContent: "flex-end", // Alineamos el contenido a la derecha
//   gap: "10px", // Espacio entre el input y el botón
//   marginTop: "1rem", // Ajustamos la distancia desde la parte superior
//   alignItems: "center", // Alineamos el contenido verticalmente
// };

// const priceAndAvailabilityStyle = {
//   position: "absolute", // Para moverlo fuera del flujo normal y ubicarlo en la parte superior
//   top: "20px", // Distancia desde la parte superior de la modal
//   right: "20px", // Distancia desde la parte derecha de la modal
//   display: "flex", // Flexbox para alinear el precio y la disponibilidad
//   flexDirection: "column", // Colocamos los elementos en columna
//   gap: "10px", // Espacio entre precio y disponibilidad
//   alignItems: "flex-start", // Alineamos el contenido a la derecha
// };

// const modalImageContainerStyle = {
//   flexShrink: 0, // Evita que la imagen se reduzca
//   width: "auto", // Ancho automático para la imagen
//   justifyContent: "flex-start", // Asegura que la imagen esté alineada a la izquierda
//   maxWidth: "100%",  // Limitar el tamaño máximo al 100% del contenedor
//   maxHeight: "100%", // Limitar la altura máxima al 100% del contenedor
//   objectFit: "cover",  // Mantener la proporción sin deformar
// };

// const modalTextContainerStyle = {
//   flexGrow: 1, // El contenido del texto debe expandirse para llenar el espacio
//   maxHeight: "calc(100% - 50px)", // Asegura que la descripción no se expanda más allá de la altura definida
//   overflow: "auto", // Agrega desplazamiento si el contenido es largo
//   paddingRight: "10px", // Espaciado derecho para que no se corte el texto
// };


const PricingBox: React.FC<{ products: ProductoCliente[] }> = ({
  products = [],
}) => {
  const { addToCart } = useCart();
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});
  const [selectedProduct, setSelectedProduct] =
    useState<ProductoCliente | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleQuantityChange = (productId: number, quantity: number) => {
    setQuantities({ ...quantities, [productId]: quantity });
  };

  const formatNumberWithCommas = (num: number) => {
    return num.toLocaleString();
  }


  const handleAddToCart = (product: ProductoCliente) => {
    const quantity = quantities[product.id_product] || 1;

    if (product.disponibility === 0) {
      toast.error("El producto no está disponible en stock.");
      return;
    }

    if (quantity > product.disponibility) {
      toast.error("No puedes agregar más de la cantidad disponible.");
      return;
    }
  
    addToCart({
      id: product.id_product,
      name: product.name,
      price: product.price,
      quantity: quantity,
      image: product.images[0] || "https://via.placeholder.com/60",
    });
  
    toast.success("Producto añadido correctamente");
  };

  const handleOpenModal = (product: ProductoCliente) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
    setIsModalOpen(false);
  };

  return (
    <>
      <div
        >
        <div className="max-w-8xl mx-auto grid grid-cols-1 gap-6 px-0 md:grid-cols-2 lg:grid-cols-2">
  {products.map((product) => (
    <div
      key={product.id_product}
      className="flex max-w-[500px] transform cursor-pointer flex-col items-center overflow-hidden rounded-xl bg-white p-4 shadow-md transition-transform hover:scale-105 dark:bg-dark-2 lg:flex-row lg:items-start"
      onClick={() => handleOpenModal(product)}
    >
      {/* Imagen a la izquierda */}
      <div className="mb-4 w-full flex-shrink-0 lg:mb-0 lg:w-1/3">
        <SliderObjects urls={product.images} id_product={product.id_product} />
      </div>

      {/* Contenido a la derecha */}
      <div className="text-center lg:ml-5 lg:text-left">
        <span className="mb-2 block text-lg font-medium text-dark dark:text-white">
          {product.name}
        </span>

        {/* Precio */}
        <h2 className="mb-1 text-2xl font-semibold text-dark dark:text-white">
          <div className="flex items-center space-x-2">
            <span className="text-md">$</span>
            <span className="text-md -tracking-[2px]">
              {parseFloat(product.price.toString()).toLocaleString("en-US", {
                currency: "COP",
              })}
            </span>
            <span className="text-body-color text-sm font-light dark:text-dark-6">
              por unidad
            </span>
          </div>
        </h2>

        {/* Descripción */}
        <p className="mb-3 text-sm font-normal text-body-color dark:text-dark-6 line-clamp-5 lg:line-clamp-3">
          {product.description}
        </p>

        {/* Disponibilidad */}
        <p className="mb-3 text-sm font-medium text-dark dark:text-white">
          Disponibles: {formatNumberWithCommas(product.disponibility)}
        </p>

        {/* Selector de cantidad y botón */}
        <div className="flex items-center space-x-4">
          <InputNumber
            min={1}
            max={product.disponibility}
            value={quantities[product.id_product] || 1}
            onChange={(value) =>
              handleQuantityChange(product.id_product, value || 1)
            }
            className="!w-[70px] duration-300 transition-all delay-100 !text-lg hover:scale-110 h-10 !rounded-md !border-primary dark:border-primary dark:bg-primary dark:placeholder-white"

            // className="!w-[70px] !text-sm !rounded-md !border-[#ddd] dark:border-primary dark:bg-gray-dark"
          />
          <button
            className=" transition-all delay-100 cursor-pointer rounded-md bg-[6A0DAD] font-bold border-primary text-primary hover:text-white dark:text-white border-2 px-4 py-2 duration-300 hover:scale-110 hover:bg-primary/90"
            onClick={() => handleAddToCart(product)}
          >
            Añadir al carrito
          </button>
        </div>
      </div>
    </div>
  ))}
</div>
  <Toaster position="bottom-right" />
      </div>

      {/* Modal */}
      {/* {selectedProduct && (
        <Modal open={isModalOpen} onClose={handleCloseModal}>
          <Box sx={modalStyle}>
            <div style={modalContentStyle}>
              <div
                className="mb-4 flex flex-shrink-0 justify-start lg:mb-0 lg:w-1/3"
                style={modalImageContainerStyle}
              >
                <SliderObjects urls={selectedProduct.images} id_product={selectedProduct.id_product} size={400}/>
              </div>
              <div
                className="flex flex-col w-full lg:w-2/3"
                style={modalTextContainerStyle}
              >
                <Typography
                  variant="h5"
                  sx={{ marginBottom: "1.5rem" }}
                  className="font-semibold"
                >
                  {selectedProduct.name}
                </Typography>

                <Typography variant="body1" sx={textStyle}>
                  {selectedProduct.description}
                </Typography>

                <div style={priceAndAvailabilityStyle}>
                  <Typography variant="h6" sx={{ fontSize: "1.5rem" }}>
                    Precio:{" "}
                    <span>
                      ${parseFloat(selectedProduct.price.toString()).toLocaleString(
                        "en-US",
                        {
                          currency: "COP",
                        }
                      )}
                    </span>
                  </Typography>
                  <Typography variant="h6" sx={{ fontSize: "1.5rem" }}>
                    Disponibilidad: {selectedProduct.disponibility}
                  </Typography>
                </div>

                <div style={buttonContainerStyle}>
                  <InputNumber
                    min={1}
                    max={selectedProduct.disponibility}
                    value={quantities[selectedProduct.id_product] || 1}
                    onChange={(value) =>
                      handleQuantityChange(selectedProduct.id_product, value || 1)
                    }
                    className="!w-[70px] !text-lg !rounded-[8px] !border-[#ddd]"
                  />
                  <Button
                    style={{
                      fontSize: "1.2rem",
                      width: "100%",
                    }}
                    onClick={() => handleAddToCart(selectedProduct)}
                    className="!w-[100%] !rounded-[8px] bg-primary"
                    variant="contained"
                  >
                    Añadir al carrito
                  </Button>
                </div>
              </div>
            </div>
          </Box>
        </Modal>
      )} */}
    </>
  );
};

export default PricingBox;
