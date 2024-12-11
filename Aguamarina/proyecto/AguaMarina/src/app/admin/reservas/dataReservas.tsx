"use client";
import { Table, TableBody, TableCell, TableHead, TableRow, Button, TableContainer, Paper, Collapse, Card, Typography } from "@mui/material";
import { fetchReservations, approveReservationById, denyReservationById, finalizeReservationById, annularReservationById} from "@/api/fetchs/get_reservas";
import { Tooltip, Select } from "antd";
import RuleRoundedIcon from '@mui/icons-material/RuleRounded';
import { useState, useEffect, useRef } from "react";
import LoaderBasic from "@/components/Loaders/LoaderBasic";
import { Reserva } from "@/types/admin/Reserva";
import React from "react";
import CardTable from "@/components/Tables/CardTable";
import SliderObjects from "@/components/SliderObjects/SliderObjects";
import Swal from "sweetalert2";
import SwapVertRoundedIcon from '@mui/icons-material/SwapVertRounded';
import { Input, Tag, InputRef } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import toast, { Toaster } from "react-hot-toast";

import DoneOutlineRoundedIcon from '@mui/icons-material/DoneOutlineRounded'; //aprobada
import DoDisturbAltRoundedIcon from '@mui/icons-material/DoDisturbAltRounded'; //cancelada
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded'; //denegada
import { checkToken } from "@/api/validations/check_cookie";
import { useAuth } from "@/context/AuthContext";


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

interface RowProps {
  row: Reserva;
  changeStatus : boolean;
  setChangeStatus: any;
}

function validateMaxValue(event: any, maxValue: any) {
  const input = event.target;
  const value = parseInt(input.value, 10);
  console.log({maxValue})

  // Si el valor excede el máximo, corregirlo
  if (value > maxValue) {
    input.value = maxValue;
  }

  // Si el valor es menor que 0, ajustarlo a 0
  if (value < 0) {
    input.value = 0;
  }
}

const generateChecklistTable = (products: any) => {

  let tableHTML = `
    <table style="width: 100%; text-align: left; border-radius: 12px;">
      <thead>
        <tr>
          <th style="padding: 8px; background-color: #f4f4f4; border-top-left-radius: 12px;">Producto</th>
          <th style="padding: 8px; background-color: #f4f4f4; white-space: nowrap;">Cantidad</th>
          <th style="padding: 8px; background-color: #f4f4f4; border-top-right-radius: 12px; text-align: right;">Cantidad Dañada</th>
        </tr>
      </thead>
      <tbody style="background-color: rgba(0, 0, 0, 0.8) !important; backdrop-filter: blur(5px); -webkit-backdrop-filter: blur(5px); color: white;">
  `;

  // Genera las filas para cada producto
  products.forEach((product: any) => {
    tableHTML += `
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd;">${product.name}</td>
        <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${product.quantity}</td>
        <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">
          <input 
            type="number" 
            id="damaged-${product.id_product}" 
            style="width: 80%; padding: 4px; border-radius: 6px; border: 1px solid #ccc; background-color : transparent;" 
            placeholder="0" 
            min="0"
            max="${product.quantity}"
          />
        </td>
      </tr>
    `;
  });

  tableHTML += `
    <tr>
      <td colspan="3" style="padding: 8px; text-align: center; border-bottom-left-radius: 12px; border-bottom-right-radius: 12px;">
      <label style="text-align: left ">Escribe observaciones de la Pérdida:</label>
        <div style="margin-top: 5px; font-size: 12px; color: cyan; opacity: 50%">
          <span>Solo escriba si hubo cantidades dañadas.</span>
        </div>
        <input 
        type="text"
          id="input-observations" 
          style="width: 80%; padding: 4px; border-radius: 6px; border: 1px solid #ccc; background-color: transparent;" 
          placeholder="Observaciones"
          value=""/>
      </td>
    </tr>
  </tbody>
  </table>
  `;

  return tableHTML;
};

const Row: React.FC<RowProps> = ({ row, changeStatus, setChangeStatus }) => {
  const [open, setOpen] = useState(false);
  const [loadingReservationId, setLoadingReservationId] = useState<number | null>(null);
  const [loadingInfo, setLoadingInfo] = useState<string | null>(null);
  const { dataUser } = useAuth();
  const formatDate = (date: string) => {
    const formattedDate = new Date(date);
    return formattedDate.toLocaleDateString('es-CO'); 
  };

  const isFinalizable = new Date() > new Date(row.end_date);
  const isCancelable = new Date() < new Date(row.end_date);

  const formatNumberWithCommas = (num: number) => {
    return num.toLocaleString(); 
  };

  const statusClasses: { [key: string]: string } = {
    Aprobada: "bg-green-500 text-white dark:bg-green-400",
    Denegada: "bg-red-500 text-white dark:bg-red-400",
    "En Espera": "bg-yellow-500 text-black dark:bg-yellow-400",
    Cancelada: "bg-pink-500 text-white dark:bg-pink-400",
    Anulada: "bg-cyan-500 text-black dark:bg-cyan-400",
    Finalizada: "bg-blue-500 text-white dark:bg-blue-400",
  };

  const createTag = (status: string) => {
    const classes =
      statusClasses[status] || "bg-gray-200 text-black dark:bg-gray-700 dark:text-white";
  
    return (
      <Tag
        className={`${classes} font-bold text-sm rounded-lg px-2 py-1`}
      >
        {status}
      </Tag>
    );
  };

  const handleActionClick = async (res: any, event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();

    const estado = res.status;

    const handleButtonClick = async(key : any) => {
      await handleAction(key)
    }

    const opciones = {
      'Aprobar': 'Aprobar',
      'Denegar': 'Denegar',
      'Anular': 'Anular',
      'Finalizar': 'Finalizar',
    }
    
    const { value } = await Swal.fire({
      icon: "info",
      iconColor: "#000",
      color: "#000",
      title: `<small>El estado actual es <strong>${estado}</strong></small><br><br>¿Qué quieres hacer con la reserva #${res.id_reservation}?`,
      html: `
        <div id="button-container" style="width: 100%; padding: 15px; background-color: transparent; border-radius: 16px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); display: flex; flex-wrap: wrap; gap: 10px; justify-content: space-between;">
          ${Object.entries(opciones)
            .map(([key, label]) => {
              let isDisabled = false;
              
              if (estado === "En Espera") {
                if (key === "Anular" || key === "Finalizar") {
                  isDisabled = true;
                }
              } else if (estado === "Aprobada") {
                if (key === "Aprobar" || key === "Denegar") {
                  isDisabled = true;
                }
              } else if (estado === "Denegada") {
                  isDisabled = true;
              } else if (estado === "Finalizada") {
                isDisabled = true;
              } else if (estado === "Anulada") {
                isDisabled = true;
              } else {
                isDisabled = true;
              }
  
              const buttonStyle = isDisabled
                ? "background-color: #ddd; color: #aaa; cursor: not-allowed;"
                : label === "Aprobar"
                ? "background-color: #28a745; color: white;"
                : label === "Denegar"
                ? "background-color: #dc3545; color: white;"
                : label === "Finalizar"
                ? "background-color: #ffc107; color: black;"
                : "background-color: #6c757d; color: white;";
  
              return `
                <button 
                  id="btn-${key}" 
                  style="flex: 1 1 calc(50% - 10px); padding: 10px 20px; border: none; border-radius: 16px; font-size: 16px; cursor: pointer; transition: background-color 0.3s, color 0.3s, transform 0.5s, opacity 0.2s; ${buttonStyle}" 
                  ${isDisabled ? "disabled" : ""}
                >
                  ${label}
                </button>
              `;
            })
            .join("")}
        </div>
      `,
      showCancelButton: true,
      cancelButtonText: "Volver",
      cancelButtonColor: "#000",
      showConfirmButton: false,
      didOpen: () => {
        Object.keys(opciones).forEach((key) => {
          const button = document.getElementById(`btn-${key}`);
          button?.addEventListener("click", () => handleButtonClick(key));
        });
      },
      background: "url(/images/grids/bg-morado-bordes.avif) no-repeat center center/cover",
      customClass: {
        popup: "rounded-3xl shadow shadow-6",
        container: "custom-background",
        cancelButton: "rounded-xl"
      },
    });
  
    // Si hay una acción seleccionada, la manejamos
    if (value) {
      await handleAction(value);
    }
  };

  const handleAction = async (action: string) => {
    let confirmationMessage = '';
    let result = false;

    switch (action) {
      case 'Aprobar':
        confirmationMessage = '¿Estás seguro de que deseas aprobar esta reserva?';
        result = await Swal.fire({
          title: 'Confirmación',
          text: confirmationMessage,
          iconColor: "#000",
          color: "#000",
          icon: 'warning',
          showCancelButton: true,
          cancelButtonColor: "#000",
          confirmButtonColor: "#6A0DAD",
          confirmButtonText: 'Aprobar',
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
            approveReservationById(row.id_reservation),
            {
              loading: <span>Aprobando...</span>,
              success: (data : boolean) => {
                setChangeStatus(!changeStatus);
                toast.dismiss(); // Descartar cualquier toast anterior
                
                    <b>Reserva Aprobada!</b>
                
                return; // Mensaje de éxito
              },
              error: (err: any) => {
                try {
                  const errorData = JSON.parse(err.message);
          
                  if (errorData.failedProducts && errorData.failedProducts.length > 0) {
                    const failedProductsTable = errorData.failedProducts.map((product: any, index: number) => (
                      <tr key={index}>
                        <td style={{ border: "1px solid #ccc", padding: "5px", fontSize: "16px" }}>{product.name}</td>
                        <td align="center" style={{ border: "1px solid #ccc", padding: "5px", }}><Tag className="text-xl" color="error">{product.quantity}</Tag></td>
                        <td align="center" style={{ border: "1px solid #ccc", padding: "5px" }}><Tag className="text-xl" color="success">{product.disponibility}</Tag></td>
                        <td style={{ border: "1px solid #ccc", padding: "5px", fontSize: "16px" }}>Stock insuficiente</td>
                      </tr>
                    ));
          
                    toast.custom((t) => (
                      <div
                        className={`toast-container ${t.visible ? 'visible' : 'hidden'}`}
                        style={{
                          width: '600px',
                          maxWidth: '100%',
                          padding: '20px',
                          borderRadius: '10px',
                          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                          backgroundColor: '#fff',
                          display: 'flex',
                          flexDirection: 'column',
                          position: 'relative',
                          zIndex: 9999,
                        }}
                      >
                        <Typography variant="h6">{errorData.message}</Typography>
                        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
                          <thead>
                            <tr>
                              <th style={{ border: "1px solid #ccc", padding: "5px", fontSize: "16px" }}>Producto</th>
                              <th style={{ border: "1px solid #ccc", padding: "5px", fontSize: "16px" }}>Solicitados</th>
                              <th style={{ border: "1px solid #ccc", padding: "5px", fontSize: "16px" }}>Disponibles</th>
                              <th style={{ border: "1px solid #ccc", padding: "5px", fontSize: "16px" }}>Razón</th>
                            </tr>
                          </thead>
                          <tbody>{failedProductsTable}</tbody>
                        </table>
                      </div>
                    ));
          
                    return;
                  } else {
                    return <b>{errorData.message || "Error al intentar aprobar la Reserva."}</b>;
                  }
                } catch (e) {
                  return <b>Error al intentar aprobar la Reserva.</b>;
                }
              },
            }
          );
          
        }
        break;

      case 'Denegar':


      result = await Swal.fire({
        title: 'Motivo de denegación',
        html: `Cuéntale a <span class="font-bold">${row.name_client}</span> el motivo de la denegación:`,
        iconColor: "#000",
        color: "#000",
        icon: 'question',
        input: 'text',
        inputPlaceholder: 'Escribe tu motivo aquí...',
        showCancelButton: true,
        cancelButtonColor: "#000",
        confirmButtonColor: "#6A0DAD",
        confirmButtonText: 'Denegar',
        cancelButtonText: 'Cancelar',
        reverseButtons: true,
        background: "url(/images/grids/bg-morado-bordes.avif)",
        customClass: {
          popup: "rounded-3xl shadow shadow-6",
          container: 'custom-background',
          cancelButton: "rounded-xl",
          confirmButton: "rounded-xl",
          input: "rounded-xl border border-stroke bg-dark-2 shadow shadow-xl text-base text-white outline-none transition placeholder:text-dark-6 focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-white dark:focus:border-primary", // Personalización del input
        },
        preConfirm: (value) => {
          if (!value) {
            Swal.showValidationMessage('¡Debes ingresar un motivo!');
            return false;
          }
          return value;
        },
      }).then((res) => {
        if (res.isConfirmed) {
          const motivoDenegacion = res.value;
          toast.promise(
            denyReservationById(row.id_reservation, motivoDenegacion)
            .then(() => {
              setChangeStatus(!changeStatus);
            }),
             {
               loading: 'Denegando...',
               success: <b>Reserva Denegada!</b>,
               error: <b>Error al intentar a la Reserva.</b>,
             }
           );

          console.log("Motivo de denegación:", motivoDenegacion);
        }
        return res.isConfirmed || false;
      });

        break;

      case 'Finalizar':
          confirmationMessage = `Lista de Chequeo de la reserva #${row.id_reservation}`;
          const info = await Swal.fire({
            title: 'Confirmación',
            html: `
              <span class="font-bold">Tabla para la lista de chequeo, indica las cantidades dañadas de los productos</span>
              <div class="mt-4">${generateChecklistTable(row.details)}</div>
            `,
            text: confirmationMessage,
            iconColor: "#000",
            color: "#000",
            icon: 'warning',
            showCancelButton: true,
            cancelButtonColor: "#000",
            confirmButtonColor: "#6A0DAD",
            confirmButtonText: 'Finalizar',
            cancelButtonText: 'Cancelar',
            reverseButtons: true,
            background: "url(/images/grids/bg-morado-bordes.avif)",
            customClass: {
              popup: "rounded-3xl shadow shadow-6",
              container: 'custom-background',
              cancelButton: "rounded-xl",
              confirmButton: "rounded-xl",
            }
          }).then(async (res) => {
            if (res.isConfirmed) {
              const damagedQuantities: any[] = [];
              let hasError = false; 
          
              row.details.forEach((product: any) => {
                const inputElement = document.getElementById(`damaged-${product.id_product}`) as HTMLInputElement;
                if (inputElement) {
                  const damagedValue = parseInt(inputElement.value, 10);
                  
                  if (damagedValue > product.quantity) {
                    toast.error(`La cantidad dañada no puede ser mayor que la cantidad del producto: ${product.name}`);
                    hasError = true;
                  }
          
                  damagedQuantities.push({
                    id_product: product.id_product,
                    quantity: damagedValue >= 0 ? damagedValue : 0,
                  });
                }
              });
          
              if (hasError) {
                return;
              } else {
                const inputObservations = (document.getElementById('input-observations') as HTMLTextAreaElement).value.toString();
                const id_user = dataUser.data.id_user;
                toast.promise(
                  finalizeReservationById(id_user, row.id_reservation, damagedQuantities, inputObservations)
                    .then(() => {
                      setChangeStatus(!changeStatus);
                    }),
                  {
                    loading: 'Finalizando...',
                    success: <b>Reserva Finalizada!</b>,
                    error: <b>Error al intentar aprobar la Reserva.</b>,
                  }
                );
              }
            }
          });
        break;

      case 'Anular':
      
        result = await Swal.fire({
          title: 'Motivo de anulación',
          html: `Cuéntale a <span class="font-bold">${row.name_client}</span> el motivo de la anulación:`,
          iconColor: "#000",
          color: "#000",
          icon: 'question',
          input: 'text',
          inputPlaceholder: 'Escribe tu motivo aquí...',
          showCancelButton: true,
          cancelButtonColor: "#000",
          confirmButtonColor: "#6A0DAD",
          confirmButtonText: 'Anular',
          cancelButtonText: 'Cancelar',
          reverseButtons: true,
          background: "url(/images/grids/bg-morado-bordes.avif)",
          customClass: {
            popup: "rounded-3xl shadow shadow-6",
            container: 'custom-background',
            cancelButton: "rounded-xl",
            confirmButton: "rounded-xl",
            input: "rounded-xl border border-stroke bg-dark-2 shadow shadow-xl text-base text-white outline-none transition placeholder:text-dark-6 focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-white dark:focus:border-primary", // Personalización del input
          },
          preConfirm: (value) => {
            if (!value) {
              Swal.showValidationMessage('¡Debes ingresar un motivo!');
              return false;
            }
            return value;
          },
        }).then((res) => {
          if (res.isConfirmed) {
            const motivoAnulacion = res.value;
            toast.promise(
              annularReservationById(row.id_reservation, motivoAnulacion)
              .then(() => {
                setChangeStatus(!changeStatus);
              }),
               {
                 loading: 'Anulando...',
                 success: <b>Reserva Anulada!</b>,
                 error: <b>Error al intentar anular la Reserva.</b>,
               }
             );
  
            console.log("Motivo de anulación:", motivoAnulacion);
          }
          return res.isConfirmed || false;
        });
        break;

      default:
        break;
    }
  };

  return (
    <React.Fragment>
      <TableRow
        className="duration-150 hover:scale-95"
        sx={{
          cursor: "pointer",
          borderRadius: "15px",
          "&:hover": {
            boxShadow: "4px 4px 16px rgba(0, 0, 0, 0.2)",
          },
        }}
        onClick={() => setOpen(!open)}
      >
        <TableCell className="dark:text-gray-400" component="th" scope="row">
          {row.id_reservation}
        </TableCell>
        <TableCell className="dark:text-gray-400" align="right">
          {row.name_client}
        </TableCell>
        <TableCell className="dark:text-gray-400" align="right">
          {formatDate(row.start_date)}
        </TableCell>
        <TableCell className="dark:text-gray-400" align="right">
          {formatDate(row.end_date)}
        </TableCell>
        <TableCell className="dark:text-gray-400" align="right">
          {row.address}
        </TableCell>
        <TableCell className="dark:text-gray-400" align="right">
          {row.city}
        </TableCell>
        <TableCell className="dark:text-gray-400" align="right">
          {row.neighborhood}
        </TableCell>
        <TableCell className="dark:text-gray-400" align="right">
          {formatCurrency(row.total_reservation)}
        </TableCell>
        <TableCell align="right">{createTag(row.status)}</TableCell>
        <TableCell align="right">
          <Button
            variant="outlined"
            onClick={(event) => handleActionClick(row, event)}
            startIcon={<RuleRoundedIcon />}
            style={{ margin: "0 5px", borderRadius: "10px" }}
            className="duration-300 hover:scale-110"
          >
            Acciones
          </Button>
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={10000}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <div style={{ display: "flex", flexDirection: "row" }}>
              <div style={{ width: "70%" }} className="bg-primary/[.2]">
                <CardTable
                  customClasses="bg-primary/[.2] "
                  data={
                    <Table
                      size="small"
                      aria-label="purchases"
                      className="rounded-full border-2 border-gray-400"
                    >
                      <TableHead>
                        <TableRow className="rounded-xl">
                          <TableCell className="text-lg font-bold dark:text-dark-6">
                            Producto
                          </TableCell>
                          <TableCell
                            className="text-lg font-bold dark:text-dark-6"
                            align="right"
                          >
                            Cantidad
                          </TableCell>
                          <TableCell
                            className="text-lg font-bold dark:text-dark-6"
                            align="right"
                          >
                            Precio Unitario
                          </TableCell>

                          <TableCell
                            className="text-lg font-bold dark:text-dark-6"
                            align="right"
                          >
                            Precio Total
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {row.details.map((detail) => (
                          <Tooltip
                            placement="right"
                            title={
                              <SliderObjects
                                urls={detail.urls}
                                id_product={detail.id_product}
                              />
                            }
                            key={detail.id_product}
                          >
                            <TableRow sx={{ cursor: "pointer" }}>
                              <TableCell
                                component="th"
                                className="dark:bg-gray-dark dark:text-gray-400"
                                scope="row"
                              >
                                {detail.name}
                              </TableCell>
                              <TableCell
                                align="right"
                                className="dark:bg-gray-dark dark:text-gray-400"
                              >
                                {formatNumberWithCommas(detail.quantity)}
                              </TableCell>
                              <TableCell
                                align="right"
                                className="dark:bg-gray-dark dark:text-gray-400"
                              >
                                {formatCurrency(detail.unit_price)}
                              </TableCell>
                              <TableCell
                                align="right"
                                className="dark:bg-gray-dark dark:text-gray-400"
                              >
                                {formatCurrency(detail.total_price)}
                              </TableCell>
                            </TableRow>
                          </Tooltip>
                        ))}
                        <TableRow>
                          <TableCell rowSpan={3} />
                          <TableCell
                            align="right"
                            colSpan={2}
                            className="text-lg font-bold dark:bg-gray-dark dark:text-gray-2"
                          >
                            Subtotal:
                          </TableCell>
                          <TableCell align="right">
                            <strong
                              style={{
                                margin: "2px",
                                padding: "4px",
                                color: "#60c82c",
                                border: "3px solid #b7eb8f",
                                borderRadius: "8px",
                                fontSize: "16px",
                              }}
                            >
                              {formatCurrency(row.total_reservation)}
                            </strong>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  }
                />
              </div>
              <div
                style={{ width: "30%" }}
                className="flex overflow-hidden rounded-lg bg-primary/[.2]"
              >
                <CardTable
                  data={
                    <Table
                      size="small"
                      aria-label="purchases"
                      className="rounded-lg border-2 border-gray-400"
                    >
                      <TableHead>
                        <TableRow className="rounded-lg">
                          <TableCell
                            className="text-lg font-bold dark:text-dark-6"
                            align="right"
                          >
                            Deposito
                          </TableCell>
                          <TableCell
                            className="text-lg font-bold dark:text-dark-6"
                            align="right"
                          >
                            Envio
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow sx={{ cursor: "pointer" }}>
                          <TableCell
                            align="right"
                            className="dark:bg-gray-dark dark:text-gray-400"
                          >
                            {formatCurrency(row.deposit)}
                          </TableCell>
                          <TableCell
                            align="right"
                            className="dark:bg-gray-dark dark:text-gray-400"
                          >
                            {formatCurrency(row.shipping_cost)}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  }
                />
              </div>
            </div>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};





const ReservationsTable: React.FC = () => {
  const [reservationsData, setReservationsData] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [searchText, setSearchText] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null); 
  const searchInput = useRef<InputRef>(null);
  const [changeStatus, setChangeStatus] = useState(false);

  useEffect(() => {
    const stateOrder = [
      "En Espera", 
      "Aprobada", 
      "Finalizada", 
      "Cancelada", 
      "Anulada", 
      "Denegada"
    ];
    const fetchStart = async () => {
      const response = await fetchReservations();
      const sortedData = response.sort((a, b) => {
        const aIndex = stateOrder.indexOf(a.status);
        const bIndex = stateOrder.indexOf(b.status);
        return aIndex - bIndex;
      });
      setReservationsData(sortedData);
    }
    fetchStart();
    setLoading(false);
  }, [])

  const fetchDataChange = async () => {
    const response = await fetchReservations();
    setReservationsData(response);
    setLoading(false);
  };

  const sortReservations = (direction: 'asc' | 'desc') => {
    const sortedData = [...reservationsData].sort((a, b) => {
      if (direction === 'asc') {
        return a.id_reservation - b.id_reservation;
      } else {
        return b.id_reservation - a.id_reservation;
      }
    });
    setReservationsData(sortedData);
  };

  const handleSortToggle = () => {
    const newDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    setSortDirection(newDirection);
    sortReservations(newDirection);
  };

  useEffect(() => {
    fetchDataChange();
  }, [changeStatus]);

  const uniqueStatuses = Array.from(new Set(reservationsData.map(row => row.status)));

  const filteredData = reservationsData.filter((row) => {
    const matchesSearch = row.name_client.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = statusFilter ? row.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  return (
    <TableContainer component={Paper} className="px-2 pb-3.5 text-sm font-bold dark:text-dark-6 bg-gray dark:bg-gray-dark">
      <Button onClick={handleSortToggle}>
        <SwapVertRoundedIcon />
      </Button>
      <Table sx={{ minWidth: 1000 }} aria-label="reservations table">
        <TableHead>
          <TableRow>
            <TableCell className="px-2 pb-3.5 text-sm font-bold dark:text-dark-6 dark:bg-gray-dark">ID</TableCell>
            <TableCell align="right" className="px-2 pb-3.5 text-sm font-bold dark:text-dark-6 dark:bg-gray-dark">
              Cliente{" "}
              <Input 
                className="rounded-xl dark:bg-dark-4 dark:text-white"
                ref={searchInput}
                placeholder="Buscar"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{ width: 100 }}
                prefix={<SearchOutlined />}
                
              />
            </TableCell>
            <TableCell align="right" className="px-2 pb-3.5 text-sm font-bold dark:text-dark-6 dark:bg-gray-dark">Fecha Inicio</TableCell>
            <TableCell align="right" className="px-2 pb-3.5 text-sm font-bold dark:text-dark-6 dark:bg-gray-dark">Fecha Fin</TableCell>
            <TableCell align="right" className="px-2 pb-3.5 text-sm font-bold dark:text-dark-6 dark:bg-gray-dark">Dirección</TableCell>
            <TableCell align="right" className="px-2 pb-3.5 text-sm font-bold dark:text-dark-6 dark:bg-gray-dark">Ciudad</TableCell>
            <TableCell align="right" className="px-2 pb-3.5 text-sm font-bold dark:text-dark-6 dark:bg-gray-dark">Barrio</TableCell>
            <TableCell align="right" className="px-2 pb-3.5 text-sm font-bold dark:text-dark-6 dark:bg-gray-dark">Total</TableCell>
            <TableCell align="right" className="px-2 pb-3.5 text-sm font-bold dark:text-dark-6 dark:bg-gray-dark">
              Estado :{" "}
              <select className="rounded-xl dark:bg-dark-4 dark:text-white w-24 px-3 py-1.5 shadow-sm transition-all focus:border-[#5750f1]"
                value={statusFilter || ""}
                onChange={(e) => setStatusFilter(e.target.value || null)}
                style={{ width: 100  }}
              >
                <option value="">Todos</option>
                {uniqueStatuses.map((status, index) => (
                  <option key={index} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </TableCell>
            <TableCell align="center" className="px-2 pb-3.5 text-sm font-bold dark:text-dark-6 dark:bg-gray-dark">Acción</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
        {loading ? (
            <TableRow>
              <TableCell colSpan={7} align="center">
                <LoaderBasic />
              </TableCell>
            </TableRow>) : (
              filteredData.map((row) => (
                <Row key={row.id_reservation} row={row} changeStatus={changeStatus} setChangeStatus={setChangeStatus} />
              ))
            )}
        </TableBody>
      </Table>
      <Toaster position="bottom-right" />
    </TableContainer>
  );
};

export default ReservationsTable;