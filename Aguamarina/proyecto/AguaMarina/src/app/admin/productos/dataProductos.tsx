"use client";
import Image from "next/image";
import { Table, TableBody, TableCell, TableHead, TableRow, TablePagination, Typography, Chip, Button, TextField } from "@mui/material";
import { fetchProducts } from "@/api/fetchs/get_productos";
import { Input, Progress, InputRef, Tooltip, Tag } from "antd";
import ButtonDefault from "@/components/Buttons/ButtonDefault";
import SwitcherThree from "@/components/FormElements/Switchers/SwitcherThree";
import changeStatus from "@/api/functions/changeStatus_Productos";
import { useState, useEffect, useRef } from "react";
import {Pagination,ConfigProvider } from "antd";
import { Producto } from "@/types/admin/Producto";
import { ProductoCliente } from "@/types/Clients/productoCliente";
import ButtonOnClick from "@/components/Buttons/ButtonOnClick";
import { Reserva } from "@/types/admin/Reserva";
import BasicModal from "@/components/Modals/BasicModal";
import EditarProducto from "./editarProducto";
import LoaderBasic from "@/components/Loaders/LoaderBasic";
import dayjs from "dayjs";
import Fecha from "@/components/Clients/Pricing/FiltroFecha";
import isBetween from 'dayjs/plugin/isBetween';
import toast, { Toaster } from 'react-hot-toast';
import LoaderDateProducts from "@/components/Loaders/LoaderDateProducts";
import LoaderCustomSize from "@/components/Loaders/LoaderCustomSize";
import { SearchOutlined, LoadingOutlined, SyncOutlined } from "@ant-design/icons";
import { eliminarProducto } from "./eliminarProducto"
import SliderObjects from "@/components/SliderObjects/SliderObjects";
import esES from "antd/es/locale/es_ES";


dayjs.extend(isBetween);





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
  const [loadingDates, setLoadingDates] = useState(false);
  const [selectedDates, setSelectedDates] = useState<[string, string] | null>(null);
  const [searchText, setSearchText] = useState(""); 
  const searchInput = useRef<InputRef>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const [openModal, setOpenModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Producto | null>(null);
  const [filteredProducts, setFilteredProducts] = useState<Producto[]>([]); // Productos filtrados


  // Cargar productos desde la API
  useEffect(() => {
    const getDates = async() => {
      const dates = sessionStorage.getItem("dates");
      let datesFinal:any = [];
      if (dates) {
        try {
          const parsedDates = JSON.parse(dates);
      
          if (Array.isArray(parsedDates) && parsedDates.length === 2 && parsedDates.every(date => typeof date === "string")) {
            datesFinal = parsedDates as [string, string]
            setSelectedDates(datesFinal);
          } else {
            console.error("El formato de 'dates' no es válido");
          }
        } catch (error) {
          console.error("Error al parsear 'dates' desde sessionStorage:", error);
        }
      }
    }

    const fetchData = async () => {
      let filtered
      try {
        if(selectedDates) {
          filtered = await fetchProducts(selectedDates[0], selectedDates[1]);
        } else {
          filtered = await fetchProducts();
        }
        
        setFilteredProducts(filtered);
        setData(filtered)
      } catch (error) {
        console.error("Error al cargar los productos:", error);
      } finally {
        setLoading(false);
      }
    };

    getDates();
    fetchData();
  }, []);

  const handlePageChange = (page: number, size: number) => {
    if (page <= totalPages) {
      setCurrentPage(page);
      setPageSize(size);
    }
  };

  const startIndex = (currentPage - 1) * pageSize;
  const currentData = filteredProducts.slice(startIndex, startIndex + pageSize);
  const totalProductos = filteredProducts.length;
  const totalPages = Math.ceil(totalProductos / pageSize);
  
  
  const isPageEmpty = (page: number) => {
    const start = (page - 1) * pageSize;
    return data.slice(start, start + pageSize).length === 0;
  };

  // Actualiza la función de búsqueda cuando cambian los productos o el término de búsqueda
  useEffect(() => {
    if (searchText) {
      const filtered = data.filter((producto) =>
        producto.name.toLowerCase().includes(searchText.toLowerCase())  // Filtrado por nombre del producto
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(data);  // Si el término está vacío, muestra todos los productos
    }
  }, [searchText, data]);

  useEffect(() => {
    if (selectedDates) {
      setLoadingDates(true); // Inicia el estado de carga
      const fetchData = async () => {
        const filtered = await fetchProducts(selectedDates[0], selectedDates[1]);
        setFilteredProducts(filtered);
        setLoadingDates(false); // Finaliza el estado de carga
      };
  
      fetchData();
    }
  }, [selectedDates, data]); 


  const handleDateChange = (dates: [string, string] | null) => {
    setSelectedDates(dates);
    sessionStorage.setItem("dates", JSON.stringify(dates));
  };



  const handleChangeStatus = async (id: any) => {
    try {
      const response = await changeStatus(id);
      return response;
    } catch (error) {
      console.error("Error al cambiar el estado del producto:", error);
      return false;
    }
  };


  // Función para abrir la modal
  const handleOpenModal = (producto: Producto) => {
    setSelectedProduct(producto);
    setOpenModal(true);
  };

  // Función para cerrar la modal
  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedProduct(null);
  };

  const handleEliminar = (productId: number) => {
    eliminarProducto(productId); 
 };

  
  return (
    <div>

      {/* Filtro de fechas */}
      <div className="mb-5">
        <span className="mb-2 ml-2 block font-medium text-gray-600 dark:text-gray-400">
          Selecciona la fecha de tu evento:
        </span>
        <div className="flex flex-row align-middle items-center gap-6">
          <Fecha
            onDateChange={handleDateChange}
            customClasses="!rounded-xl"
          />
          {loadingDates ? <div className="top-0 bottom-0"><Tag icon={<SyncOutlined spin />} color="#5750f1 ">Filtrando</Tag></div> : <></>}
        </div>
      </div>

      {/* Tabla */}
      <Table className="min-w-full text-sm">
        <TableHead>
          <TableRow>
            <TableCell
              align="center"
              className="px-2 pb-3.5 text-sm font-medium dark:text-dark-6"
            >
              <h1 className="text-sm font-semibold xsm:text-base">Imagen</h1>
            </TableCell>
            <TableCell className="px-1 pb-2 text-sm font-medium dark:text-dark-6">
            <div className="flex flex-col">
              <h1 className="text-sm font-semibold">Nombre</h1>
                <Input
                  placeholder="¿Buscar?"
                  className="input w-30 rounded-xl border-[#5750f1] px-3 py-3 shadow-lg transition-all focus:border-[#5750f1] dark:bg-dark-4 dark:text-white"
                  ref={searchInput}
                  name="search"
                  type="search"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  prefix={<SearchOutlined className="dark:text-white" />}
                />
            
                <style jsx global>{`
                  input[type="search"]::placeholder {
                    color: #d1d5db;
                  }
                  input[type="search"].dark::placeholder {
                    color: #ffffff;
                  }
                  input::-ms-input-placeholder {
                    /* Para navegadores antiguos como IE */
                    color: #d1d5db;
                  }
                  input.dark::-ms-input-placeholder {
                    color: #ffffff;
                  }
                `}</style>
            </div>

            </TableCell>
            <TableCell
              align="center"
              className="px-2 pb-3.5 text-sm font-medium dark:text-dark-6"
            >
              <h1 className="text-sm font-semibold xsm:text-base">Categoria</h1>
            </TableCell>
            <TableCell
              align="center"
              className="px-2 pb-3.5 text-sm font-medium dark:text-dark-6"
            >
              <h1 className="text-sm font-semibold xsm:text-base">Precio</h1>
            </TableCell>
            <TableCell
              align="center"
              className="hidden px-2 pb-3.5 text-sm font-medium dark:text-dark-6 sm:table-cell"
            >
              <h1 className="text-sm font-semibold xsm:text-base">
                Disponibilidad
              </h1>
            </TableCell>
            <TableCell
              align="center"
              className="hidden px-2 pb-3.5 text-sm font-medium dark:text-dark-6 sm:table-cell"
            >
              <h1 className="text-sm font-semibold xsm:text-base">
                Descripción
              </h1>
            </TableCell>
            <TableCell
              align="center"
              className="hidden px-2 pb-3.5 text-sm font-medium dark:text-dark-6 sm:table-cell"
            >
              <h1 className="text-sm font-semibold xsm:text-base">Estado</h1>
            </TableCell>
            <TableCell
              align="center"
              className="hidden px-2 pb-3.5 text-sm font-medium dark:text-dark-6 sm:table-cell"
            >
              <h1 className="text-sm font-semibold xsm:text-base">Acciones</h1>
            </TableCell>
          </TableRow>
        </TableHead>

        {/* Cuerpo de la tabla */}
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={10} align="center">
                <LoaderBasic />
              </TableCell>
            </TableRow>
          ) : data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} align="center">
                <Typography variant="h6" className="py-6 text-gray-500">
                  No hay productos disponibles.
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            currentData.map((producto, key) => (
              <TableRow
                sx={{
                  cursor: 'pointer',
                  borderRadius: "15px",
                  '&:hover': {
                    boxShadow: '4px 4px 16px rgba(0, 0, 0, 0.2)',
                  },
                }}
                key={producto.id_product}
                className="border-b border-stroke dark:border-dark-3 duration-150"
              >
                {/* Imagen */}
                <TableCell align="center" className="px-2 py-4 mr-5">
                  <div
                    style={{
                      width: "200px",
                      borderRadius: "8px",
                      backgroundColor: "rgb(87 80 241 / .2)",
                      padding: "10px",
                      alignContent: "center",
                      maxWidth: "8rem"
                    }}
                    className="cursor-pointer duration-300 hover:scale-105 dark:bg-white/10"
                  >
                    <SliderObjects
                      urls={producto.images}
                      id_product={producto.id_product}
                    />
                  </div>
                </TableCell>

                {/*Nombre */}
                <TableCell align="center" className="px-0.5 py-4">
                    <p className="hidden font-estandar text-base text-start font-medium text-dark dark:text-dark-6 sm:block">
                      {producto.name}
                    </p>
                </TableCell>

                {/* Categoría */}
                <TableCell align="center" className="px-2 py-4">
                  <p className="font-estandar text-base font-medium text-dark dark:text-dark-6">
                    {producto.category}
                  </p>
                </TableCell>

                {/* Precio */}
                <TableCell align="center" className="px-2 py-4">
                  <p className="font-estandar text-2xl font-bold text-green-light-1">
                    {formatCurrency(producto.price)}
                  </p>
                </TableCell>

                {/* Disponibilidad */}
                <TableCell align="center" className="px-2 dark:text-dark-6">
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      height: 110,
                    }}
                    className="mb-4 rounded-2xl bg-primary/[.2] p-2 duration-300 hover:scale-105 dark:bg-white/10"
                  >
                    <Progress
                      size={150}
                      type="dashboard"
                      percent={
                        producto.total_quantity > 0
                          ? Math.round((producto.disponibility / producto.total_quantity) * 100) // Redondea al entero más cercano
                          : 0 // Asegura que no haya división por cero
                      }
                      gapDegree={165}
                      status="normal"
                      strokeWidth={10}
                      strokeColor={"#5057f1"}
                      strokeLinecap="round"
                    />

                    <Typography
                      className="flex flex-row"
                      variant="h6"
                      style={{ marginTop: "-45px", whiteSpace: "nowrap" }}
                    >
                      {`${producto.disponibility} / ${producto.total_quantity}`}
                    </Typography>
                  </div>
                </TableCell>

                {/* Descripción */}
                <TableCell
                  align="center"
                  className="hidden px-2 py-4 sm:table-cell"
                >
                  <textarea
                    className="bg-primary/[.2] font-estandar text-lg text-dark dark:bg-white/10 dark:text-white"
                    value={producto.description}
                    readOnly
                    rows={4}
                    style={{
                      width: 180,
                      height: 150,
                      minHeight: 50,
                      resize: "vertical",
                      fontFamily: "inherit",
                      borderRadius: "10px",
                      padding: "10px",
                    }}
                  />
                </TableCell>

                {/* Estado */}
                <TableCell
                  align="center"
                  className="hidden px-2 py-4 sm:table-cell"
                >
                  <div className="flex flex-col items-center gap-3">
                    <SwitcherThree
                      id={producto.id_product}
                      checked={producto.status}
                    />
                  </div>
                </TableCell>

                {/* Acciones */}
                <TableCell
                  align="center"
                  className="hidden px-2 py-4 sm:table-cell"
                >
                  <div className="flex flex-col gap-4">
                    <BasicModal
                      tituloBtn="Editar"
                      tituloModal={`Editar Producto # ${producto.id_product}`}
                    >
                      <EditarProducto
                        productId={producto.id_product}
                        handleClose={() => console.log("presionado para salir")}
                      />
                    </BasicModal>
                    <button
                  onClick={() => handleEliminar(producto.id_product)}
                  className="text-sm font-semibold border border-red-500 hover:bg-red-500 hover:text-white text-red-500 rounded-md px-6 py-2.5 lg:px-8 xl:px-10 duration-300"
                >
                  Eliminar
                </button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Componente de paginación */}
      <div className="flex justify-center mt-4 dark:bg-dark-1 dark:text-white">
        <ConfigProvider locale={esES}>  
          <Pagination
            showQuickJumper
            current={currentPage}
            pageSize={pageSize}
            total={1000} // Ajusta este valor según tu total
            onChange={handlePageChange}
            disabled={loading}  // Deshabilitar si no hay datos
            showSizeChanger
            onShowSizeChange={handlePageChange}
            pageSizeOptions={['1', '3', '5', '10']}
            /* className="text-black dark:text-dark-6" */
            itemRender={(page, type, originalElement) => {
              if (type === 'page' && isPageEmpty(page)) {
                return (
                  <div style={{ pointerEvents: 'none', opacity: 0.5 }}>
                    🔒
                  </div>
                );
              }
              return originalElement;
            }}
            className="dark:text-white dark:bg-dark-1"
          />

          
        </ConfigProvider>
        
      </div>

      {/* Modal para editar producto */}
      {openModal && (
        <BasicModal tituloBtn="Editar producto" tituloModal="Editar producto">
          <EditarProducto
            productId={selectedProduct?.id_product}
            handleClose={handleCloseModal}
          />
        </BasicModal>
      )}

      <Toaster  position="bottom-right" reverseOrder={false} />
    </div>
  );
};

export default dataProductos;
