"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import toast from "react-hot-toast";

type Product = {
  id_product: number;
  name: string;
  images: string[];
  disponibility: number;
  availabilityByDate: { [key: string]: number };
};

type SelectedImages = {
  id_product: number;
  quantity: number;
}[];

type ImageCatalogProps = {
  products: Product[];
  setSelectedProducts : any;
};

const SelectPrueba: React.FC<ImageCatalogProps> = ({ products, setSelectedProducts }) => {
  const [selectedImages, setSelectedImages] = useState<SelectedImages>([]);
  const [selectedDate, setSelectedDate] = useState<string>();

  const handleSelect = (id: number) => {
    setSelectedImages((prev) => {
      const productIndex = prev.findIndex(item => item.id_product === id);
      if (productIndex !== -1) {
        const newSelection = [...prev];
        newSelection.splice(productIndex, 1);
        return newSelection;
      }
      return [...prev, { id_product: id, quantity: 1 }];
    });
  };

  useEffect (() => {
    setSelectedProducts(selectedImages);
  }, [selectedImages, setSelectedProducts]);

  const handleQuantityChange = (id: number, quantity: number) => {
    const product = products.find((prod) => prod.id_product === id);
    if (product) {
      const availableQuantity =  product.disponibility;

      // Validar si la cantidad seleccionada supera la disponibilidad
      if (quantity > availableQuantity) {
        toast.error(`La cantidad seleccionada no puede superar la disponibilidad (${availableQuantity})`)
        return;
      }

      // Evitar cantidades negativas
      if (quantity < 0) return;

      // Actualizar la cantidad del producto en el estado
      setSelectedImages((prev) => {
        const newSelection = prev.map((item) =>
          item.id_product === id ? { ...item, quantity } : item
        );
        return newSelection;
      });
    }
  };

  const formatNumberWithCommas = (num: number) => {
    return num.toLocaleString();
  };

  return (
    <div className="grid w-full items-center mb-3 gap-6 grid-cols-[repeat(auto-fill,minmax(150px,1fr))]">
      {products.map((product) => {
        const selectedProduct = selectedImages.find(item => item.id_product === product.id_product);
        const selectedQuantity = selectedProduct ? selectedProduct.quantity : 0;

        return (
          <div
            key={product.id_product}
            style={{
              position: "relative",
              border: selectedQuantity ? "3px solid #5057f1" : "1px solid gray",
              borderRadius: "8px",
              overflow: "hidden",
              cursor: "pointer",
              width: "120px",
              transition: "border 0.1s ease-in",  // Agrega transición al borde
            }}
              className="place-self-center"
          >
            <div onClick={() => handleSelect(product.id_product)}>
              <Image
                src={product.images[0]}
                alt={product.name}
                priority
                width={0}
                height={0}
                style={{
                  width: "100%",
                  height: "auto",
                  borderRadius: "8px",
                }}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div
                style={{
                  position: "absolute",
                  color: selectedQuantity ? "#5057f1" : "gray",
                  top: "5px",
                  right: "5px"
                }}
                className="rounded-full"
              >
                <CheckCircleRoundedIcon className="border-gray-6 border-2 rounded-full" />
              </div>
            </div>

            <div style={{ marginTop: "10px", textAlign: "center" }}>
              <label>Disponibilidad: {formatNumberWithCommas(product.disponibility)}</label>
              <label style={{ display: "block", marginBottom: "5px" }}>Cantidad:</label>
              <input
                type="number"
                disabled={!selectedProduct} // Solo habilitar si el producto está seleccionado
                min={0}
                value={selectedQuantity || ''} // Mostrar vacío si es 0
                onChange={(e) => {
                  const value = e.target.value; // Capturar el valor del input
                  if (value === "") {
                    handleQuantityChange(product.id_product, 0); // Si el campo está vacío, establecer la cantidad en 0
                  } else {
                    const parsedValue = parseInt(value, 10);
                    if (!isNaN(parsedValue) && parsedValue >= 0) {
                      handleQuantityChange(product.id_product, parsedValue); // Actualizar solo si es válido
                    }
                  }
                }}
                style={{
                  width: "70%",
                  padding: "5px",
                  border: "1px solid gray",
                  borderRadius: "4px",
                  textAlign: "center",
                  marginBottom: "15px",
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SelectPrueba;
