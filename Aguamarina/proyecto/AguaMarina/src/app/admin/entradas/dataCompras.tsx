"use client";
import { Table, TableBody, TableCell, TableHead, TableRow, Chip, Typography } from "@mui/material";
import { Pagination, ConfigProvider } from "antd";
import { fetchPurchases } from "@/api/fetchs/get_compras";
import dennyPurchase from "@/api/functions/dennyPurchase";
import ButtonDelete from "@/components/Buttons/ButtonDelete";
import { Compra } from "@/types/admin/Compra";
import { useEffect, useState } from "react";
import LoaderBasic from "@/components/Loaders/LoaderBasic";
import Swal from "sweetalert2";
import toast from 'react-hot-toast';
import esES from "antd/es/locale/es_ES";

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

function formatDate(value: string | Date): string {
  const dateValue = typeof value === 'string' ? new Date(value) : value;

  if (isNaN(dateValue.getTime())) {
    return "Invalid date";
  }

  return new Intl.DateTimeFormat('es-CO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(dateValue);
}

const DataCompras = () => {
  const [data, setData] = useState<Compra[]>([]);
  const [loading, setLoading] = useState(true);
  const [changeStatusFlag, setChangeStatusFlag] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  useEffect(() => {
    const loadData = async () => {
      try {
        const compras = await fetchPurchases();
        setData(compras);
      } catch (error) {
        console.error("Error fetching purchases:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [changeStatusFlag]);

  const handlePageChange = (page: number, size: number) => {
    if (page <= totalPages) {
      setCurrentPage(page);
      setPageSize(size);
    }
  };


  const startIndex = (currentPage - 1) * pageSize;
  const currentData = data.slice(startIndex, startIndex + pageSize);
  const totalCompras =data.length;
  const totalPages = Math.ceil(data.length / pageSize);

  const isPageEmpty = (page: number) => {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return data.slice(start, end).length === 0;
  };

  const formatNumberWithCommas = (num: number) => {
    return num.toLocaleString(); 
  };
  

  const handleCancelPurchases = async (id: number) => {
    try {
      const confirmationMessage = "¿Deseas anular esta entrada?";
      const result = await Swal.fire({
        title: 'Confirmación',
        text: confirmationMessage,
        iconColor: "#000",
        color: "#000",
        icon: 'warning',
        showCancelButton: true,
        cancelButtonColor: "#000",
        confirmButtonColor: "#6A0DAD",
        confirmButtonText: 'Denegada',
        cancelButtonText: 'Cancelar',
        reverseButtons: true,
        background: "url(/images/grids/bg-morado-bordes.avif)",
        customClass: {
          popup: "rounded-3xl shadow shadow-6",
          container: 'custom-background',
          cancelButton: "rounded-xl",
          confirmButton: "rounded-xl",
        },
      }).then((res) => res.isConfirmed);

      if (result) {
        toast.promise(
          dennyPurchase(id)
            .then((isSuccess) => {
              if (isSuccess) {
                setChangeStatusFlag(!changeStatusFlag);
              }
            }),
          {
            loading: 'Anulando entrada...',
            success: <b>Entrada anulada correctamente!</b>,
            error: <b>Error al intentar anular la entrada.</b>,
          }
        );
      }
    } catch (error) {
      console.error("Error al cambiar el estado de las compras:", error);
      return false;
    }
  };

  return (
    <div>
      <Table className="min-w-full">
        <TableHead>
          <TableRow>
            <TableCell className="px-2 pb-3.5 font-medium text-sm dark:text-dark-6">
              <h1 className="text-sm font-semibold xsm:text-base">
                Id entrada
              </h1>
            </TableCell>
            <TableCell align="center" className="px-2 pb-3.5 font-medium text-sm dark:text-dark-6">
              <h1 className="text-sm font-semibold xsm:text-base">Fecha</h1>
            </TableCell>
            <TableCell align="center" className="px-2 pb-3.5 font-medium  text-sm dark:text-dark-6">
              <h1 className="text-sm font-semibold xsm:text-base">Producto</h1>
            </TableCell>
            <TableCell align="center" className="hidden sm:table-cell px-2 pb-3.5 font-medium  text-sm dark:text-dark-6">
              <h1 className="text-sm font-semibold xsm:text-base">Comprador</h1>
            </TableCell>
            <TableCell align="center" className="hidden sm:table-cell px-2 pb-3.5 font-medium  text-sm dark:text-dark-6">
              <h1 className="text-sm font-semibold xsm:text-base">Cantidad</h1>
            </TableCell>
            <TableCell align="center" className="hidden sm:table-cell px-2 pb-3.5 font-medium  text-sm dark:text-dark-6">
              <h1 className="text-sm font-semibold xsm:text-base">Costo unitario</h1>
            </TableCell>
            <TableCell align="center" className="hidden sm:table-cell px-2 pb-3.5 font-medium  text-sm dark:text-dark-6">
              <h1 className="text-sm font-semibold xsm:text-base">Total</h1>
            </TableCell>
            <TableCell align="center" className="hidden sm:table-cell px-2 pb-3.5 font-medium  text-sm dark:text-dark-6">
              <h1 className="text-sm font-semibold xsm:text-base">Estado</h1>
            </TableCell>
            <TableCell align="center" className="hidden sm:table-cell px-2 pb-3.5 font-medium text-sm dark:text-dark-6" style={{ width: '225px' }} >
              <h1 className="text-sm font-semibold xsm:text-base">Acciones</h1>
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
        {loading ? (
          <TableRow>
            <TableCell colSpan={1000}>
              <LoaderBasic/>
            </TableCell>
          </TableRow>
        ) :  data.length === 0 ? (
          <TableRow>
              <TableCell colSpan={1000} align="center">
                <Typography variant="h6" className="py-6 text-gray-500">
                  No hay entradas disponibles.
                </Typography>
              </TableCell>
            </TableRow>
        ) :
          currentData.map((compra, key) => (
            <TableRow
              key={key}
              className={`${key !== data.length - 1 ? "border-b border-stroke dark:border-dark-3" : ""}`}
            >
              <TableCell align="center" className="flex items-center gap-3.5 px-2 py-10 flex-col">
                <div className="flex items-center gap-3.5 flex-row">
                  <p className="hidden sm:block font-medium font-estandar text-xl text-dark dark:text-dark-6">
                    {compra.id_purchase}
                  </p>
                </div>
              </TableCell>

              <TableCell align="center" className="px-2 py-4">
                <p className="font-medium font-estandar text-xl text-dark dark:text-dark-6">{formatDate(compra.purchase_date)}</p>
              </TableCell>

              <TableCell align="center" className="px-2 py-4">
                <p className="font-medium font-estandar text-xl text-dark dark:text-dark-6">{compra.product}</p>
              </TableCell>

              <TableCell align="center" className="px-2 dark:text-dark-6">
                <p className="font-medium font-estandar text-xl text-dark dark:text-dark-6">{compra.name_user}</p>
              </TableCell>

              <TableCell align="center" className="hidden sm:table-cell px-2 py-4">
                <p className="font-medium font-estandar text-xl text-dark dark:text-dark-6">{formatNumberWithCommas(compra.quantity)}</p>
              </TableCell>

              <TableCell align="center" className="hidden sm:table-cell px-2 py-4">
                <p className="font-medium font-estandar text-xl text-dark dark:text-dark-6">{formatCurrency(compra.unit_price)}</p>
              </TableCell>

              <TableCell align="center" className="hidden sm:table-cell px-2 py-4">
                <p className="font-bold font-estandar text-xl text-green-light-1">{formatCurrency(compra.total_price)}</p>
              </TableCell>

              <TableCell align="center" className="hidden sm:table-cell px-2">
                <div className="flex gap-3 items-center">
                  <div className={`font-bold text-xl text-dark font-estandar dark:text-dark-6 ${compra.status == true ? "text-green-400" : "text-red-400"}`}> 
                    <Chip label={compra.status == true ? "Realizada" : "Denegada"} 
                    style={{
                      backgroundColor: compra.status == true ? "#4ade80" : "#f87171",
                      fontSize: "18px"
                    }}/>
                  </div>
                </div>
              </TableCell>
              <TableCell align="center" className="hidden sm:table-cell px-6 py-4">
                <div className="gap-4 min-w-[80px]">
                  <ButtonDelete onClick={() => handleCancelPurchases(compra.id_purchase)} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {/* Componente de paginación */}
      <div className="flex justify-center mt-4 items-center">
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
            pageSizeOptions={['1', '3', '5', '10', '20']}
            className="text-black dark:text-dark-6"
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
          />

          
        </ConfigProvider>
        
      </div>
    </div>
  );
};

export default DataCompras;
