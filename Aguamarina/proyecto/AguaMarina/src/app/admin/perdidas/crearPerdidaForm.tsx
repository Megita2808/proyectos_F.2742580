"use client";
import React, { useState, useEffect } from "react";
import { fetchProducts } from "@/api/fetchs/get_productos";
import { postLosses } from "@/api/fetchs/posts/post_losses";
import Swal from "sweetalert2";
import { useAuth } from "@/context/AuthContext";
import SelectPerdida from "@/components/SelectImages/SelectPerdidas";
import { Producto } from "@/types/admin/Producto";
import toast from "react-hot-toast";

function formatCurrency(value: string | number): string {
  const numericValue = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(numericValue)) {
    return "Invalid price";
  }
  return numericValue.toLocaleString('es-CO', {
    style: 'currency',
    currency: 'COP',  
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

const CrearPerdida: React.FC<{ handleClose: () => void }> = ({ handleClose }) => {
  const { dataUser } = useAuth();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<{ id_product: number, quantity : number }[]>([]);
  const [totalLoss, setTotalLoss] = useState<number>(0);
  const [observations, setObservations] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const produ = await fetchProducts();
        setProductos(produ);
      } catch (error) {
        console.error("Error al cargar los productos:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let total = 0;
    selectedProducts.forEach(({ id_product, quantity }) => {
      const product = productos.find((prod) => prod.id_product === id_product);
      if (product) {
        total += parseFloat(product.price) * quantity;
      }
    });
    console.log({total})
    setTotalLoss(total)
  }, [selectedProducts, productos]);

  const handleObservacionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setObservations(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (selectedProducts.length === 0) {
      toast.error("Selecciona productos para generar una pérdida.")
      return;
    }

    const filtrados = selectedProducts.filter((producto) => producto.quantity != 0);
    const details = filtrados.map((producto) => {
      console.log({producto})
      return {
        id_product: producto.id_product,
        quantity: producto.quantity,
      };
  });

  if (details.length === 0) {
    toast.error("Selecciona productos para generar una pérdida.")
    return;
  }


  // setFormData(prevState => ({
  //   ...prevState,
  //   details
  // }));
 const loss_date = new Date().toISOString().slice(0, 10);;
    const lossData = {
      id_user: dataUser.data.id_user,
      lossesList: details,
      observations, 
      loss_date,
    };
    console.log({lossData})

    try {
      toast.promise(
        postLosses(lossData),
        {
          loading: "Generando Perdida...",
          success: <b>Pérdida generada exitosamente!</b>,
          error: <b>Error al intentar generar la pérdida.</b>,
        }
      );
      handleClose();
    } catch (error) {
      toast.error("Error al crear la pérdida.");
    }
  };

  return (
    <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
      <form onSubmit={handleSubmit} className="p-6.5">
        <div className="my-4">
          <h2 className="text-lg font-medium">Registrar Pérdidas</h2>
        </div>

        <div className="my-4">
          <h3>Selecciona los productos</h3>
          <SelectPerdida
            products={productos}
            setSelectedProducts={setSelectedProducts}
          />
        </div>

        <div className="my-4">
          <label className="block text-sm font-medium text-gray-700">Observación</label>
          <textarea
            value={observations}
            onChange={handleObservacionChange}
            rows={4}
            className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Escribe tus observaciones aquí..."
          />
        </div>

        <div className="mt-4">
          <p>Total de la pérdida: {formatCurrency(totalLoss)}</p>
        </div>

        <button
          type="submit"
          className="mb-4 flex w-full cursor-pointer items-center justify-center rounded-md border-2 border-primary bg-[6A0DAD] px-4 py-2 font-bold text-primary transition-all delay-100 duration-300 hover:scale-100 hover:bg-primary/90 hover:text-white dark:text-white"        >
          Registrar Pérdida
        </button>
      </form>
    </div>
  );
};

export default CrearPerdida;
