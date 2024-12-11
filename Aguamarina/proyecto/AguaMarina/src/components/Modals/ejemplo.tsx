"use client";

import Image from "next/image";
import { Table, TableBody, TableCell, TableHead, TableRow, Typography, Chip, Button } from "@mui/material";
import { fetchProducts } from "@/api/fetchs/get_productos";
import { Progress } from "antd";
import ButtonDefault from "@/components/Buttons/ButtonDefault";
import SwitcherThree from "@/components/FormElements/Switchers/SwitcherThree";
import changeStatus from "@/api/functions/changeStatus_Productos";
import { useState, useEffect } from "react";
import { Producto } from "@/types/admin/Producto";
import Loader from "@/components/common/Loader";

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

const dataProductos = () => {
  const [data, setData] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    const loadData = async () => {
      try {
        const productos = await fetchProducts();
        setData(productos);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleChangeStatus = async (id: any) => {
    try {
      const response = await changeStatus(id);
      return response;
    } catch (error) {
      console.error("Error al cambiar el estado del producto:", error);
      return false;
    }
  };

  // Funciones para manejar la paginación
  const handlePageChange = (newPage: number) => setCurrentPage(newPage);
  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(1); // Reinicia a la primera página al cambiar el número de filas
  };

  // Obtener los datos de la página actual
  const paginatedData = data.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
  const totalPages = Math.ceil(data.length / rowsPerPage);

  return (
    <div>
      {/* Control de filas por página */}
      <div className="pagination-controls">
        <label>
          Filas por página:
          <input
            type="number"
            value={rowsPerPage}
            onChange={handleRowsPerPageChange}
            min="1"
            className="ml-2 p-1 border rounded"
          />
        </label>
      </div>

      {/* Tabla */}
      <Table className="min-w-full">
        <TableHead>
          <TableRow>
            <TableCell className="px-2 pb-3.5 font-medium uppercase text-sm dark:text-dark-6">
              <h1 className="text-sm font-semibold uppercase xsm:text-base">Nombre</h1>
            </TableCell>
            <TableCell align="center" className="px-2 pb-3.5 font-medium uppercase text-sm dark:text-dark-6">
              <h1 className="text-sm font-semibold uppercase xsm:text-base">Categoria</h1>
            </TableCell>
            <TableCell align="center" className="px-2 pb-3.5 font-medium uppercase text-sm dark:text-dark-6">
              <h1 className="text-sm font-semibold uppercase xsm:text-base">Precio</h1>
            </TableCell>
            <TableCell align="center" className="hidden sm:table-cell px-2 pb-3.5 font-medium uppercase text-sm dark:text-dark-6">
              <h1 className="text-sm font-semibold uppercase xsm:text-base">Disponibilidad</h1>
            </TableCell>
            <TableCell align="center" className="hidden sm:table-cell px-2 pb-3.5 font-medium uppercase text-sm dark:text-dark-6">
              <h1 className="text-sm font-semibold uppercase xsm:text-base">Descripción</h1>
            </TableCell>
            <TableCell align="center" className="hidden sm:table-cell px-2 pb-3.5 font-medium uppercase text-sm dark:text-dark-6">
              <h1 className="text-sm font-semibold uppercase xsm:text-base">Estado</h1>
            </TableCell>
            <TableCell align="center" className="hidden sm:table-cell px-2 pb-3.5 font-medium uppercase text-sm dark:text-dark-6">
              <h1 className="text-sm font-semibold uppercase xsm:text-base">Acciones</h1>
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {loading ? (
            <TableCell colSpan={1000}><Loader /></TableCell>
          ) : (
            paginatedData.map((producto, key) => (
              <TableRow key={key} className={`${key !== data.length - 1 ? "border-b border-stroke dark:border-dark-3" : ""}`}>
                {/* Imagen y Nombre */}
                <TableCell className="flex items-center gap-3.5 px-2 py-4 flex-col">
                  <div className="flex items-center gap-3.5 flex-row">
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 90, minHeight: 90 }} className="bg-primary/[.2] dark:bg-white/10 p-2 rounded-2xl hover:scale-125 duration-300 cursor-pointer">
                      <Image
                        src={producto.images[0]}
                        alt="producto"
                        width={90}
                        height={90}
                        className="flex-shrink-0 rounded-[10px]"
                      />
                    </div>
                    <p className="hidden sm:block font-medium font-estandar text-2xl text-dark dark:text-dark-6">
                      {producto.name}
                    </p>
                  </div>
                </TableCell>

                {/* Categoría */}
                <TableCell align="center" className="px-2 py-4">
                  <p className="font-medium font-estandar text-2xl text-dark dark:text-dark-6">{producto.category}</p>
                </TableCell>

                {/* Precio */}
                <TableCell align="center" className="px-2 py-4">
                  <p className="font-bold font-estandar text-2xl text-green-light-1">{formatCurrency(producto.price)}</p>
                </TableCell>

                {/* Disponibilidad */}
                <TableCell align="center" className="px-2 dark:text-dark-6">
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center',  height: 110 }} className="bg-primary/[.2] dark:bg-white/10 p-2 rounded-2xl hover:scale-105 duration-300 mb-4">
                    <Progress
                      size={150}
                      type="dashboard"
                      percent={(producto.disponibility / producto.total_quantity) * 100}
                      gapDegree={165}
                      status="normal"
                      strokeWidth={10}
                      strokeColor={"#00ff"}
                      strokeLinecap="round"
                    />
                    <Typography className="flex flex-row" variant="h6" style={{ marginTop: '-45px', whiteSpace: 'nowrap', }}>
                      {`${producto.disponibility} / ${producto.total_quantity}`}
                    </Typography>
                  </div>
                </TableCell>

                {/* Descripción */}
                <TableCell align="center" className="hidden sm:table-cell px-2 py-4">
                  <textarea 
                    className="bg-primary/[.2] text-dark dark:bg-white/10 dark:text-white text-lg font-estandar"
                    value={producto.description} 
                    readOnly 
                    rows={4}
                    style={{
                      width: 300,
                      height: 150,
                      minHeight: 50,
                      resize: 'vertical',
                      fontFamily: 'inherit',
                      borderRadius: "10px",
                      padding: "10px",
                    }}
                  />
                </TableCell>

                {/* Estado */}
                <TableCell align="center" className="hidden sm:table-cell px-2 py-4">
                  <div className="flex flex-col gap-3 items-center">
                    <SwitcherThree id={producto.id_product} checked={producto.status} />
                  </div>
                </TableCell>

                {/* Acciones */}
                <TableCell align="center" className="hidden sm:table-cell px-2 py-4">
                  <div className="gap-4 flex flex-col">
                    <ButtonDefault
                      label="Editar"
                      link="/admin"
                      customClasses="text-xl font-semibold border border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-white rounded-[5px] px-10 py-3.5 lg:px-8 xl:px-10"
                        />    
                    <ButtonDefault
                      label="Editar"
                      link="/admin"
                      customClasses="text-xl font-semibold border border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-white rounded-[5px] px-10 py-3.5 lg:px-8 xl:px-10"
                    />
                    <ButtonDefault
                      label="Eliminar"
                      link="/admin"
                      customClasses="text-xl font-semibold border border-red-500 hover:bg-red-500 hover:text-white text-red-500 rounded-[5px] px-10 py-3.5 lg:px-8 xl:px-10"
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Controles de Paginación */}
      <div className="pagination-controls flex justify-between items-center mt-4">
        <Button
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          Anterior
        </Button>
        <span>
          Página {currentPage} de {totalPages}
        </span>
        <Button
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Siguiente
        </Button>
      </div>
    </div>
  );
};

export default dataProductos;
