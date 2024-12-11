"use client";
import { Table, TableBody, TableCell, TableHead, TableRow, Button, TableContainer, Paper, Collapse, Card, Typography } from "@mui/material";
import { fetchReservations, approveReservationById, denyReservationById, finalizeReservationById, annularReservationById} from "@/api/fetchs/get_reservas";
import { Tooltip, Select } from "antd";
import RuleRoundedIcon from '@mui/icons-material/RuleRounded';
import { useState, useEffect, useRef } from "react";
import LoaderBasic from "@/components/Loaders/LoaderBasic";
import React from "react";
import CardTable from "@/components/Tables/CardTable";
import SliderObjects from "@/components/SliderObjects/SliderObjects";
import Swal from "sweetalert2";
import SwapVertRoundedIcon from '@mui/icons-material/SwapVertRounded';
import { Input, Tag } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import toast, { Toaster } from "react-hot-toast";

import DoneOutlineRoundedIcon from '@mui/icons-material/DoneOutlineRounded'; //aprobada
import DoDisturbAltRoundedIcon from '@mui/icons-material/DoDisturbAltRounded'; //cancelada
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded'; //denegada
import { fetchRoles } from "@/api/fetchs/get_roles";
import { Rol } from "@/types/admin/Rol";
import { eliminarRol} from "./eliminarRol"
import EditarRolForm from "./editarRolForm";
import ModalSinBoton from "@/components/Modals/ModalSinBoton";

interface RowProps {
  row: Rol;
  change : any;
  setChange: any;
}


const Row: React.FC<RowProps> = ({ row, change, setChange }) => {
  const [open, setOpen] = useState(false);
  const [loadingReservationId, setLoadingReservationId] = useState<number | null>(null);
  const [loadingInfo, setLoadingInfo] = useState<string | null>(null);
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [pastPermissions, setPastPermissions] = useState<any[]>([]);
  const formatDate = (date: string) => {
    const formattedDate = new Date(date);
    return formattedDate.toLocaleDateString('es-CO'); 
  };


  const generateEventTable = (permissions: any[]) => {
    let tableHTML = `
      <table style="width: 100%; text-align: left; border-radius: 12px;">
        <thead>
          <tr>
            <th style="padding: 8px; background-color: #f4f4f4; border-top-left-radius: 12px; border-top-right-radius: 12px;">Permisos</th>
          </tr>
        </thead>
        <tbody style="background-color: rgba(0, 0, 0, 0.8) !important; backdrop-filter: blur(5px); -webkit-backdrop-filter: blur(5px); color: white;">
    `;
    
    // Genera las filas para cada evento
    if (permissions.length <= 0) {
      tableHTML += `
          <tr style="cursor : pointer;">
            <td style="padding: 8px; border: 1px solid #ddd; border-bottom-left-radius: 12px; border-bottom-right-radius: 12px;">Este rol no tiene permisos disponibles</td>
          </tr>
        `;
    } else {
      // permissions = permissions.sort((a: any, b: any) => a.id_permission - b.id_permission);
      permissions.forEach(per => {
        tableHTML += `
          <tr style="cursor : pointer;" id="row-${per.id_permission}">
            <td style="padding: 8px; border: 1px solid #ddd;">${per.name}</td>
          </tr>
        `;
      });
    }

    tableHTML += `</tbody></table>`;
    return tableHTML;
  };


  const handleActionClick = async (rol: any, event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();


    const handleButtonClick = async(key : any) => {
      await handleAction(key)
    }

    const tableHTML = generateEventTable(rol.permissions);
    
    const result = await Swal.fire({
      icon: "info",
      iconColor: "#000",
      color: "#000",
      title: `<small>Rol: <strong>${rol.name}</strong></small><br><br>Lista de Permisos`,
      html: tableHTML,
      showCancelButton: true,
      cancelButtonText: "Volver",
      cancelButtonColor: "#000",
      confirmButtonColor: "#6A0DAD",
      reverseButtons: true,
      showConfirmButton: true,
      confirmButtonText: "Editar",
      background: "url(/images/grids/bg-morado-bordes.avif) no-repeat center center/cover",
      customClass: {
        popup: "rounded-3xl shadow shadow-6",
        container: "custom-background",
        cancelButton: "rounded-xl",
        confirmButton: "rounded-xl",
      },
    }).then((res) => {
      if (res.isConfirmed) {
        handleEditar(setChange);
      }
    });
    
  };

  const handleAction = async (action: string) => {
    let confirmationMessage = '';
    let result = false;
    console.log({row})
  };
  
  const handleEliminar = (rolId: number, setChange: any, change: boolean) => {
    eliminarRol(rolId, setChange);
  };
  
  const handleEditar = async (setChangeStatus: any) => {
    if (row.id_rol == 1 || row.id_rol == 2) {
      Swal.fire({
        icon: "error",
        iconColor: "#000",
        color: "#000",
        title: "No se puede Editar",
        html: `Este rol no puede ser Editado`,
        timerProgressBar: true,
        showConfirmButton: false,
        cancelButtonColor: "#000",
        confirmButtonColor: "#000",
        timer: 3000,
        background: "url(/images/grids/bg-morado-bordes.avif)",
        customClass: {
          popup: "rounded-3xl shadow shadow-6",
          container: "custom-background",
        },
      });
      return; 
    }

    const generate = async () => {
      const allPermissions = await Promise.all(
        row.permissions.map((per: any) => per.id_permission)
      );
      setPastPermissions(allPermissions);
    };
    await generate(); // Asegúrate de esperar que se complete la asignación
    setOpen(true); // Abre el modal después de haber actualizado los permisos
  };

  // Uso de useEffect para hacer algo cuando pastPermissions cambie
  useEffect(() => {
    if (pastPermissions.length > 0) {
      console.log({ pastPermissions }); // Este console.log ahora reflejará el valor actualizado
    }
  }, [pastPermissions]);
  

  return (
    <React.Fragment>
      <TableRow
        sx={{
          cursor: "pointer",
          "&:hover": {
            // backgroundColor: "#f7f7f7",
            boxShadow: "4px 4px 16px rgba(0, 0, 0, 0.4)",
          },
        }}
      >
        <TableCell
          align="left"
          component="th"
          scope="row"
          className="dark:bg-gray-dark dark:text-white"
        >
          {row.name}
        </TableCell>
        <TableCell align="left" className="dark:bg-gray-dark dark:text-white">
          {row.description}
        </TableCell>
        <TableCell align="right" className="dark:bg-gray-dark dark:text-white">
          <div className="flex flex-row justify-end gap-4">
            {/* Visualizar */}
            <button
              onClick={(event) => handleActionClick(row, event)}
              className="hover:text-primary"
            >
              <svg
                className="fill-current"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M9.99935 6.87492C8.27346 6.87492 6.87435 8.27403 6.87435 9.99992C6.87435 11.7258 8.27346 13.1249 9.99935 13.1249C11.7252 13.1249 13.1243 11.7258 13.1243 9.99992C13.1243 8.27403 11.7252 6.87492 9.99935 6.87492ZM8.12435 9.99992C8.12435 8.96438 8.96382 8.12492 9.99935 8.12492C11.0349 8.12492 11.8743 8.96438 11.8743 9.99992C11.8743 11.0355 11.0349 11.8749 9.99935 11.8749C8.96382 11.8749 8.12435 11.0355 8.12435 9.99992Z"
                  fill=""
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M9.99935 2.70825C6.23757 2.70825 3.70376 4.96175 2.23315 6.8723L2.20663 6.90675C1.87405 7.3387 1.56773 7.73652 1.35992 8.20692C1.13739 8.71064 1.04102 9.25966 1.04102 9.99992C1.04102 10.7402 1.13739 11.2892 1.35992 11.7929C1.56773 12.2633 1.87405 12.6611 2.20664 13.0931L2.23316 13.1275C3.70376 15.0381 6.23757 17.2916 9.99935 17.2916C13.7611 17.2916 16.2949 15.0381 17.7655 13.1275L17.792 13.0931C18.1246 12.6612 18.431 12.2633 18.6388 11.7929C18.8613 11.2892 18.9577 10.7402 18.9577 9.99992C18.9577 9.25966 18.8613 8.71064 18.6388 8.20692C18.431 7.73651 18.1246 7.33868 17.792 6.90673L17.7655 6.8723C16.2949 4.96175 13.7611 2.70825 9.99935 2.70825ZM3.2237 7.63475C4.58155 5.87068 6.79132 3.95825 9.99935 3.95825C13.2074 3.95825 15.4172 5.87068 16.775 7.63475C17.1405 8.10958 17.3546 8.3933 17.4954 8.71204C17.627 9.00993 17.7077 9.37403 17.7077 9.99992C17.7077 10.6258 17.627 10.9899 17.4954 11.2878C17.3546 11.6065 17.1405 11.8903 16.775 12.3651C15.4172 14.1292 13.2074 16.0416 9.99935 16.0416C6.79132 16.0416 4.58155 14.1292 3.2237 12.3651C2.85821 11.8903 2.64413 11.6065 2.50332 11.2878C2.37171 10.9899 2.29102 10.6258 2.29102 9.99992C2.29102 9.37403 2.37171 9.00993 2.50332 8.71204C2.64413 8.3933 2.85821 8.10958 3.2237 7.63475Z"
                  fill=""
                />
              </svg>
            </button>

            {/* Eliminar */}
            <button
              onClick={() => handleEliminar(row.id_rol, setChange, change)} 
              className="hover:text-red"
            >
              <svg
                className="fill-current"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M8.59048 1.87502H11.4084C11.5887 1.8749 11.7458 1.8748 11.8941 1.89849C12.4802 1.99208 12.9874 2.35762 13.2615 2.88403C13.3309 3.01727 13.3805 3.16634 13.4374 3.33745L13.5304 3.61654C13.5461 3.66378 13.5506 3.67715 13.5545 3.68768C13.7004 4.09111 14.0787 4.36383 14.5076 4.3747C14.5189 4.37498 14.5327 4.37503 14.5828 4.37503H17.0828C17.4279 4.37503 17.7078 4.65485 17.7078 5.00003C17.7078 5.34521 17.4279 5.62503 17.0828 5.62503H2.91602C2.57084 5.62503 2.29102 5.34521 2.29102 5.00003C2.29102 4.65485 2.57084 4.37503 2.91602 4.37503H5.41609C5.46612 4.37503 5.47993 4.37498 5.49121 4.3747C5.92009 4.36383 6.29844 4.09113 6.44437 3.6877C6.44821 3.67709 6.45262 3.66401 6.46844 3.61654L6.56145 3.33747C6.61836 3.16637 6.66795 3.01728 6.73734 2.88403C7.01146 2.35762 7.51862 1.99208 8.1047 1.89849C8.25305 1.8748 8.41016 1.8749 8.59048 1.87502ZM7.50614 4.37503C7.54907 4.29085 7.5871 4.20337 7.61983 4.1129C7.62977 4.08543 7.63951 4.05619 7.65203 4.01861L7.7352 3.7691C7.81118 3.54118 7.82867 3.49469 7.84602 3.46137C7.9374 3.2859 8.10645 3.16405 8.30181 3.13285C8.33892 3.12693 8.38854 3.12503 8.6288 3.12503H11.37C11.6103 3.12503 11.6599 3.12693 11.697 3.13285C11.8924 3.16405 12.0614 3.2859 12.1528 3.46137C12.1702 3.49469 12.1877 3.54117 12.2636 3.7691L12.3468 4.01846L12.379 4.11292C12.4117 4.20338 12.4498 4.29085 12.4927 4.37503H7.50614Z"
                  fill=""
                />
                <path
                  d="M4.92859 7.04179C4.90563 6.69738 4.60781 6.43679 4.2634 6.45975C3.91899 6.48271 3.6584 6.78053 3.68136 7.12494L4.06757 12.9181C4.13881 13.987 4.19636 14.8505 4.33134 15.528C4.47167 16.2324 4.71036 16.8208 5.20335 17.2821C5.69635 17.7433 6.2993 17.9423 7.01151 18.0355C7.69653 18.1251 8.56189 18.125 9.63318 18.125H10.3656C11.4369 18.125 12.3023 18.1251 12.9873 18.0355C13.6995 17.9423 14.3025 17.7433 14.7955 17.2821C15.2885 16.8208 15.5272 16.2324 15.6675 15.528C15.8025 14.8505 15.86 13.987 15.9313 12.9181L16.3175 7.12494C16.3404 6.78053 16.0798 6.48271 15.7354 6.45975C15.391 6.43679 15.0932 6.69738 15.0702 7.04179L14.687 12.7911C14.6121 13.9143 14.5587 14.6958 14.4416 15.2838C14.328 15.8542 14.1693 16.1561 13.9415 16.3692C13.7137 16.5824 13.4019 16.7206 12.8252 16.796C12.2307 16.8738 11.4474 16.875 10.3217 16.875H9.67718C8.55148 16.875 7.76814 16.8738 7.17364 16.796C6.59697 16.7206 6.28518 16.5824 6.05733 16.3692C5.82949 16.1561 5.67088 15.8542 5.55725 15.2838C5.44011 14.6958 5.38675 13.9143 5.31187 12.7911L4.92859 7.04179Z"
                  fill=""
                />
                <path
                  d="M7.8539 8.5448C8.19737 8.51045 8.50364 8.76104 8.53799 9.10451L8.95466 13.2712C8.989 13.6146 8.73841 13.9209 8.39495 13.9553C8.05148 13.9896 7.74521 13.739 7.71086 13.3956L7.29419 9.22889C7.25985 8.88542 7.51044 8.57915 7.8539 8.5448Z"
                  fill=""
                />
                <path
                  d="M12.1449 8.5448C12.4884 8.57915 12.739 8.88542 12.7047 9.22889L12.288 13.3956C12.2536 13.739 11.9474 13.9896 11.6039 13.9553C11.2604 13.9209 11.0098 13.6146 11.0442 13.2712L11.4609 9.10451C11.4952 8.76104 11.8015 8.51045 12.1449 8.5448Z"
                  fill=""
                />
              </svg>
            </button>

            {/* Editar */}
            <button className="hover:text-amber-500"
              onClick={() => handleEditar(!change)} 
            >
              <svg
                className="fill-current"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M13.7267 2.84084C14.2227 2.34484 15.0316 2.34484 15.5276 2.84084L17.1592 4.47245C17.6552 4.96845 17.6552 5.77736 17.1592 6.27336L6.83577 16.5968C6.66218 16.7704 6.44055 16.892 6.19427 16.9495L3.29227 17.672C3.03459 17.7326 2.7654 17.6528 2.57865 17.4661C2.39191 17.2793 2.31206 17.0101 2.37268 16.7524L3.09518 13.8504C3.15273 13.6041 3.27432 13.3825 3.44791 13.2089L13.7267 2.84084Z"
                  fill=""
                />
                <path
                  d="M5.46875 15.7813L4.21875 14.5313L5.65625 13.0938L6.90625 14.3438L5.46875 15.7813Z"
                  fill=""
                />
                <path
                  d="M16.125 6.78125L14.6875 5.34375L15.5312 4.5L16.9688 5.9375L16.125 6.78125Z"
                  fill=""
                />
                <path
                  d="M12.0312 4.8125L14.375 7.15625"
                  stroke=""
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </TableCell>
      </TableRow>
      <ModalSinBoton
        open={open}
        tituloModal={`Editar Rol: ${row.name}`}
        handleClose={() => {}}
        setOpen={setOpen}
      >
        <EditarRolForm rolId={row.id_rol} handleClose={() => {}} row={row} setChange={setChange} change={change} />
      </ModalSinBoton>
    </React.Fragment>
  );
};
















const RolesTable: React.FC = () => {
  const [rolesData, setRolesData] = useState<Rol[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [searchText, setSearchText] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null); 
  const searchInput = useRef<HTMLInputElement>(null);
  const [change, setChange] = useState(false);


  useEffect(() => {
    const fetchData = async() => {
      const roles = await fetchRoles();
      setRolesData(roles);
      setLoading(false);
    }
    fetchData();
  }, [change]);


  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} className="bg-transparent" aria-label="reservations table">
        <TableHead>
          <TableRow>
            <TableCell align="center" className="px-2 pb-3.5 text-sm font-bold dark:text-dark-6 dark:bg-gray-dark">Nombre del Rol</TableCell>
            <TableCell align="center" className="px-2 pb-3.5 text-sm font-bold dark:text-dark-6 dark:bg-gray-dark">Descripción</TableCell>
            <TableCell align="center" className="px-2 pb-3.5 text-sm font-bold dark:text-dark-6 dark:bg-gray-dark">Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
        {loading ? (
            <TableRow>
              <TableCell colSpan={7} align="center">
                <LoaderBasic />
              </TableCell>
            </TableRow>) : (
              rolesData.map((row : any) => (
                <Row key={row.id_rol} row={row} change={change} setChange={setChange} />
              ))
            )}
        </TableBody>
      </Table>
      <Toaster position="bottom-right" />
    </TableContainer>
  );
};

export default RolesTable;