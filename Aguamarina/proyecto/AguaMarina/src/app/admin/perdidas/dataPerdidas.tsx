import React, { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableRow, TableContainer, Paper, Card, Collapse, Typography } from "@mui/material";
import { fetchLosses } from "@/api/fetchs/get_perdidas"; 
import {Pagination,ConfigProvider } from "antd";
import LoaderBasic from "@/components/Loaders/LoaderBasic";
import ButtonDelete from "@/components/Buttons/ButtonDelete";
import Swal from "sweetalert2";
import esES from "antd/es/locale/es_ES";
import toast, {Toaster} from "react-hot-toast";
import { annularLossById } from "@/api/fetchs/get_perdidas";
import { Perdida } from "@/types/admin/Perdida";

interface LossDetail {
  id: number;
  id_loss: number;
  id_product: number;
  quantity: number;
  createdAt: string;
  updatedAt: string;
}


const LossesTable = () => {
  const [lossesData, setLossesData] = useState<Perdida[]>([]);
  const [loading, setLoading] = useState(true);
  const [openRows, setOpenRows] = useState<{ [key: string]: boolean }>({});
  const [changeStatusFlag, setChangeStatusFlag] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const fetchData = async () => {
    const response = await fetchLosses();
    setLossesData(response);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [changeStatusFlag]);

  const toggleRow = (id: number) => {
    setOpenRows((prev) => ({
      ...prev,
      [id.toString()]: !prev[id.toString()],
    }));
  };

  

  const handleCancellosses = async (id: number) => {
    try {
      const confirmationMessage = "¿Deseas anular esta pérdida?";
      const result = await Swal.fire({
        title: "Confirmación",
        text: confirmationMessage,
        iconColor: "#000",
        color: "#000",
        icon: "warning",
        showCancelButton: true,
        cancelButtonColor: "#000",
        confirmButtonColor: "#6A0DAD",
        confirmButtonText: "Anular",
        cancelButtonText: "Cancelar",
        reverseButtons: true,
        background: "url(/images/grids/bg-morado-bordes.avif)",
        customClass: {
          popup: "rounded-3xl shadow shadow-6",
          container: "custom-background",
          cancelButton: "rounded-xl",
          confirmButton: "rounded-xl",
        },
      }).then((res) => res.isConfirmed);

      if (result) {
        toast.promise(
          annularLossById(id)
            .then((isSuccess) => {
              if (isSuccess) {
                setChangeStatusFlag(!changeStatusFlag);  
              }
            }),
          {
            loading: "Anulando pérdida...",
            success: <b>Pérdida anulada correctamente!</b>,
            error: <b>Error al intentar anular la pérdida.</b>,
          }
        );
      }
    } catch (error) {
      console.error("Error al cambiar el estado de las pérdidas:", error);
      return false;
    }
  };

  const handlePageChange = (page: number, size: number) => {
    if (page <= totalPages) {
      setCurrentPage(page);
      setPageSize(size);
    }
  };
  
  
  
  const startIndex = (currentPage - 1) * pageSize;
  const currentData = lossesData.slice(startIndex, startIndex + pageSize);
  
  const totalLosses = lossesData.length;
  const totalPages = Math.ceil(totalLosses / pageSize);
  
  const isPageEmpty = (page: number) => {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return lossesData.slice(start, end).length === 0;
  };

  return (
    <TableContainer className="px-2 pb-3.5 text-sm font-bold dark:text-dark-6 bg-gray dark:bg-gray-dark" component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="losses table">
        <TableHead>
          <TableRow>
            <TableCell className="px-2 pb-3.5 text-sm font-bold dark:text-dark-6 dark:bg-gray-dark">ID Pérdida</TableCell>
            <TableCell className="px-2 pb-3.5 text-sm font-bold dark:text-dark-6 dark:bg-gray-dark">Usuario ID</TableCell>
            <TableCell className="px-2 pb-3.5 text-sm font-bold dark:text-dark-6 dark:bg-gray-dark">Fecha Pérdida</TableCell>
            <TableCell className="px-2 pb-3.5 text-sm font-bold dark:text-dark-6 dark:bg-gray-dark">Observaciones</TableCell>
            <TableCell className="px-2 pb-3.5 text-sm font-bold dark:text-dark-6 dark:bg-gray-dark">Estado</TableCell>
            <TableCell className="px-2 pb-3.5 text-sm font-bold dark:text-dark-6 dark:bg-gray-dark">Detalles</TableCell>
            <TableCell className="px-2 pb-3.5 text-sm font-bold dark:text-dark-6 dark:bg-gray-dark">Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={6} align="center">
                <LoaderBasic />
              </TableCell>
            </TableRow>
          ) : lossesData.length === 0 ? (
            <TableRow>
                <TableCell colSpan={1000} align="center">
                  <Typography variant="h6" className="py-6 text-gray-500">
                    No hay perdidas disponibles.
                  </Typography>
                </TableCell>
              </TableRow>
          ) :(
            currentData.map((loss: Perdida) => (
              <React.Fragment key={loss.id_loss}>
                <TableRow
                  className="cursor-pointer"
                  onClick={() => toggleRow(loss.id_loss)}
                >
                  <TableCell>{loss.id_loss}</TableCell>
                  <TableCell>{loss.id_user}</TableCell>
                  <TableCell>
                    {new Date(loss.loss_date).toLocaleDateString("es-CO")}
                  </TableCell>
                  <TableCell>{loss.observations}</TableCell>
                  <TableCell>{loss.status == true ? "Activa" : "Anulada"}</TableCell>
                  <TableCell>Ver detalles</TableCell>
                  <TableCell
                    align="center"
                    className="hidden px-6 py-4 sm:table-cell"
                  >
                    <div className="m-3 flex min-w-[100px] flex-col gap-4">
                      <ButtonDelete
                        onClick={() => handleCancellosses(loss.id_loss)}
                      />
                    </div>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    style={{ paddingBottom: 0, paddingTop: 0 }}
                    colSpan={6}
                  >
                    <Collapse
                      in={openRows[loss.id_loss.toString()]}
                      timeout="auto"
                      unmountOnExit
                    >
                      <Card sx={{ padding: 2 }}>
                        <Table size="small" aria-label="detalles de pérdida">
                          <TableHead>
                            <TableRow>
                              <TableCell className="px-2 pb-3.5 text-sm font-bold dark:text-dark-6 dark:bg-gray-dark">ID Producto</TableCell>
                              <TableCell className="px-2 pb-3.5 text-sm font-bold dark:text-dark-6 dark:bg-gray-dark">Cantidad</TableCell>
                              <TableCell className="px-2 pb-3.5 text-sm font-bold dark:text-dark-6 dark:bg-gray-dark">Fecha Creación</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {loss.lossDetails.map((detail) => (
                              <TableRow key={detail.id}>
                                <TableCell className="px-2 pb-3.5 text-sm font-bold dark:text-dark-6 dark:bg-gray-dark">{detail.id_product}</TableCell>
                                <TableCell className="px-2 pb-3.5 text-sm font-bold dark:text-dark-6 dark:bg-gray-dark">{detail.quantity}</TableCell>
                                <TableCell>
                                  {new Date(
                                    detail.createdAt,
                                  ).toLocaleDateString("es-CO")}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </Card>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))
          )}
        </TableBody>
      </Table>
      {/* Componente de paginación */}
      <div className="flex justify-center mt-4 items-center">
        <ConfigProvider locale={esES}>  
          <Pagination
            showQuickJumper
            current={currentPage}
            pageSize={pageSize}
            total={1000} 
            onChange={handlePageChange}
            disabled={loading}  
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
      <Toaster  position="bottom-right" reverseOrder={false} />
    </TableContainer>
  );
};

export default LossesTable;
