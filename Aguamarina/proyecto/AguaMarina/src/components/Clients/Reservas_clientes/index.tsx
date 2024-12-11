"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Button, Container, Card, Table, TableBody, TableCell, TableHead, TableRow, TableContainer, Paper, Typography, Collapse, Divider, Tooltip } from "@mui/material"; 
import {Pagination,ConfigProvider } from "antd";
import { fetchReservationsByUser } from "@/api/fetchs/get_reservas";
import { checkToken } from "@/api/validations/check_cookie"; 
import LoaderBasic from "@/components/Loaders/LoaderBasic";
import { Reserva } from "@/types/admin/Reserva";
import SliderObjects from "@/components/SliderObjects/SliderObjects";
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import SwapVertRoundedIcon from '@mui/icons-material/SwapVertRounded';
import { cancelReservationById } from "@/api/fetchs/get_reservas";
import Swal from "sweetalert2";
import esES from "antd/es/locale/es_ES";
import DoNotDisturbRoundedIcon from '@mui/icons-material/DoNotDisturbRounded';


function formatCurrency(value: string | number): string {
  const numericValue = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(numericValue)) {
    return "Precio inválido";
  }
  return numericValue.toLocaleString('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

const MisReservas: React.FC = () => {
  const [data, setData] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [openRows, setOpenRows] = useState<{ [key: string]: boolean }>({}); 
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null); // Filtro de estado

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  

  const getUserId = useCallback(async () => {
    try {
      const response = await checkToken();
      if (response.result) {
        console.log("ID de usuario obtenido:", response.data.id_user); 
        return response.data.id_user;
      } else {
        console.log("No se pudo obtener el ID del usuario desde el token.");
        return null;
      }
    } catch (error) {
      console.error("Error obteniendo el ID del usuario desde el token:", error);
      return null;
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        const userId = await getUserId();
        if (userId) {
          console.log("Obteniendo reservas para el usuario con ID:", userId);
          const reservas = await fetchReservationsByUser(userId);
          console.log("Reservas obtenidas:", reservas);  

          if (Array.isArray(reservas) && reservas.length > 0) {
            setData(reservas);  
          } else {
            console.log("No se encontraron reservas para este usuario.");
            setData([]);  
          }
        }
      } catch (error) {
        console.error("Error obteniendo las reservas:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [getUserId, success]);

  const handleCancelReservation = async (event: React.MouseEvent, reservationId: string | number) => {
    event.stopPropagation();
    try {
      setError(null);
      setSuccess(null); 
      const { value: cancelReason } = await Swal.fire({
        title: '¿Por qué deseas cancelar esta reserva?',
        input: 'select',
        inputOptions: {
          'Cambio de planes': 'Cambio de planes',
          'No necesito la reserva': 'No necesito la reserva',
          'Encontré una opción mejor': 'Encontré una opción mejor',
          'Otro': 'Otro',
        },
        inputPlaceholder: 'Selecciona una razón',
        showCancelButton: true,
        confirmButtonText: 'Confirmar',
        cancelButtonText: 'Cancelar',
        inputValidator: (value) => {
          if (!value) {
            return 'Debes seleccionar una razón';
          }
        },
        iconColor: "#000",
        color: "#000",
        icon: 'warning',
        cancelButtonColor: "#000",
        confirmButtonColor: "#000",
        reverseButtons: true,
        background: "url(/images/grids/bg-morado-bordes.avif)", 
        customClass: {
          popup: "rounded-3xl shadow shadow-6", 
          container: 'custom-background',
          cancelButton: "rounded-xl", 
          confirmButton: "rounded-xl",  
        },
      });
  
      if (cancelReason) {
        const success = await cancelReservationById(reservationId, cancelReason);
  
        if (success) {
          setData((prevData) => prevData.filter(reservation => reservation.id_reservation !== reservationId));
          setSuccess("Reserva cancelada exitosamente.");
        } else {
          setError("No se pudo cancelar la reserva. Intenta nuevamente.");
        }
      } else {
        console.log("Cancelación cancelada por el usuario.");
      }
    } catch (error) {
      console.error("Error cancelando la reserva:", error);
      setError("Hubo un error al cancelar la reserva.");
    }
  };

  const uniqueStatuses = Array.from(new Set(data.map(row => row.status)));

  // Filtrado de datos según el estado seleccionado
  const filteredData = data.filter((row) => {
    const matchesStatus = statusFilter ? row.status === statusFilter : true;
    return matchesStatus;
  });

  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = filteredData.slice(startIndex, startIndex + pageSize);

  const totalPages = Math.ceil(filteredData.length / pageSize);
  const totalReservas = data.length;

  const handlePageChange = (page: number, pageSize: number) => {
    if (page <= totalPages) {
      setCurrentPage(page);
      setPageSize(pageSize);
    }
  };

  const isPageEmpty = (page: number) => {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return data.slice(start, end).length === 0;
  };



  const toggleRow = (id: number) => {
    setOpenRows((prev) => ({
      ...prev,
      [id.toString()]: !prev[id.toString()],  
    }));
  };



  return (
    <React.Fragment>
      <Container className="bg-white dark:dark-bg">
        <Card className="bg-white dark:bg-gray-dark" variant="outlined" sx={{ padding: 3, marginTop: 3 }}>
          <TableContainer component={Paper} className="px-2 pb-3.5 text-sm font-bold dark:text-dark-6 bg-white dark:bg-gray-dark">
            <Table aria-label="tabla de reservas" className="min-w-full text-sm">
  <TableHead>
    <TableRow>
      <TableCell className="px-2 pb-3.5 text-sm font-medium dark:text-dark-6">ID Reserva</TableCell>
      <TableCell align="right" className="px-2 pb-3.5 text-sm font-medium dark:text-dark-6">
        Fecha Inicio
      </TableCell>
      <TableCell align="right" className="px-2 pb-3.5 text-sm font-medium dark:text-dark-6">
        Fecha Fin
      </TableCell>
      <TableCell align="right" className="px-2 pb-3.5 text-sm font-medium dark:text-dark-6">
        Dirección
      </TableCell>
      <TableCell align="right" className="px-2 pb-3.5 text-sm font-medium dark:text-dark-6">
        Ciudad
      </TableCell>
      <TableCell align="right" className="px-2 pb-3.5 text-sm font-medium dark:text-dark-6">
        Barrio
      </TableCell>
      <TableCell align="right" className="px-2 pb-3.5 text-sm font-medium dark:text-dark-6">
        Total Reserva
      </TableCell>
      <TableCell align="right" className="px-2 pb-3.5 text-sm font-medium dark:text-dark-6">
        Estado:
        <select
          className="input w-32 rounded-xl border-[#5750f1] px-3 py-2 shadow-lg transition-all focus:border-[#5750f1] dark:bg-dark-4"
          value={statusFilter || ""}
          onChange={(e) => setStatusFilter(e.target.value || null)}
        >
          <option value="">Todos</option>
          {uniqueStatuses.length > 0 &&
            uniqueStatuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
        </select>
      </TableCell>
      <TableCell align="right" className="px-2 pb-3.5 text-sm font-medium dark:text-dark-6">
        Acciones
      </TableCell>
    </TableRow>
  </TableHead>
  <TableBody>
    {loading ? (
      <TableRow>
        <TableCell colSpan={9} align="center" className="py-6">
          <LoaderBasic />
        </TableCell>
      </TableRow>
    ) : paginatedData.length === 0 ? (
      <TableRow>
        <TableCell colSpan={9} align="center" className="py-6 text-gray-500">
          No hay reservas disponibles.
        </TableCell>
      </TableRow>
    ) : (
      paginatedData.map((row) => (
        <React.Fragment key={row.id_reservation}>
          <TableRow
            className="cursor-pointer transition duration-300 hover:bg-gray-100 dark:hover:bg-dark-4"
            onClick={() => toggleRow(row.id_reservation)}
          >
            <TableCell className="px-2 py-3">{row.id_reservation}</TableCell>
            <TableCell align="right" className="px-2 py-3">
              {new Date(row.start_date).toLocaleDateString("es-CO")}
            </TableCell>
            <TableCell align="right" className="px-2 py-3">
              {new Date(row.end_date).toLocaleDateString("es-CO")}
            </TableCell>
            <TableCell align="right" className="px-2 py-3">{row.address}</TableCell>
            <TableCell align="right" className="px-2 py-3">{row.city}</TableCell>
            <TableCell align="right" className="px-2 py-3">{row.neighborhood}</TableCell>
            <TableCell align="right" className="px-2 py-3 text-green-light-1 font-bold">
              {formatCurrency(row.total_reservation)}
            </TableCell>
            <TableCell align="right" className="px-2 py-3">{row.status}</TableCell>
            <TableCell align="right" className="px-2 py-3">
              <button
                className="text-sm font-semibold border border-red-500 hover:bg-red-500 hover:text-white text-red-500 rounded-md px-4 py-2"
                onClick={(e) => handleCancelReservation(e, row.id_reservation)}
              >
                Cancelar <DoNotDisturbRoundedIcon />
              </button>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={9}>
              <Collapse
                in={openRows[row.id_reservation.toString()]}
                timeout="auto"
                unmountOnExit
              >
                <div className="flex flex-col p-4 bg-gray-50 dark:bg-dark-3">
                  <Card>
                    <Table size="small" aria-label="detalles de productos">
                      <TableHead>
                        <TableRow>
                          <TableCell>ID</TableCell>
                          <TableCell>Producto</TableCell>
                          <TableCell align="right">Cantidad</TableCell>
                          <TableCell align="right">Precio Unitario</TableCell>
                          <TableCell align="right">Precio Total</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {row.details.map((detail) => (
                          <TableRow key={detail.id_product}>
                            <TableCell>{detail.id_product}</TableCell>
                            <TableCell >{detail.name}</TableCell>
                            <TableCell align="right">{detail.quantity}</TableCell>
                            <TableCell align="right">{detail.unit_price}</TableCell>
                            <TableCell align="right">{detail.total_price}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Card>
                </div>
              </Collapse>
            </TableCell>
          </TableRow>
        </React.Fragment>
      ))
    )}
  </TableBody>
</Table>
          </TableContainer>
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
        </Card>
      </Container>
    </React.Fragment>
  );
};

export default MisReservas;
