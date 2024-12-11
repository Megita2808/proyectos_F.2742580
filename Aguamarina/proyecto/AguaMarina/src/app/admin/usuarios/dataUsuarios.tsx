"use client";

import Image from "next/image";
import { Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import { Pagination, ConfigProvider } from "antd";
import { fetchUsers } from "@/api/fetchs/get_usuarios";
import ButtonDefault from "@/components/Buttons/ButtonDefault";
import SwitcherThree from "@/components/FormElements/Switchers/SwitcherThree";
import { Usuario } from "@/types/admin/Usuario";
import { useState, useEffect } from "react";
import LoaderBasic from "@/components/Loaders/LoaderBasic"; 
import EditarUsuario from "./editarUsuario";
import BasicModal from "@/components/Modals/BasicModal";
import esES from "antd/es/locale/es_ES";
import { LoadingOutlined } from '@ant-design/icons';
import toast, { Toaster } from 'react-hot-toast';
import { eliminarUsuario } from "./eliminarUsuario"

const dataUsuarios = () => {
  const [data, setData] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const usuarios = await fetchUsers();
        console.log(usuarios);
        setData(usuarios);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleEliminar = (usuarioId: number) => {
    eliminarUsuario(usuarioId); 
 };

  const handlePageChange = (page: number, size: number) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  const startIndex = (currentPage - 1) * pageSize;
  const currentData = data.slice(startIndex, startIndex + pageSize);

  const totalUsuarios = data.length;
  const totalPages = Math.ceil(totalUsuarios / pageSize);

  const isPageEmpty = (page: number) => {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return data.slice(start, end).length === 0;
  };

  return (
    <div>
      <Table className="min-w-full">
        <TableHead>
          <TableRow>
            <TableCell
              align="center"
              className="table-small-font px-2 pb-3.5 font-medium dark:text-dark-6"
            >
              <h1 className="text-lg font-semibold xsm:text-base">
                Nombre completo
              </h1>
            </TableCell>
            <TableCell
              align="center"
              className="px-2 pb-3.5 text-lg font-medium dark:text-dark-6"
            >
              <h1 className="text-lg font-semibold xsm:text-base">Rol</h1>
            </TableCell>
            <TableCell
              align="center"
              className="px-2 pb-3.5 text-lg font-medium dark:text-dark-6"
            >
              <h1 className="text-lg font-semibold xsm:text-base">Documento</h1>
            </TableCell>
            <TableCell
              align="center"
              className="hidden px-2 pb-3.5 text-lg font-medium dark:text-dark-6 sm:table-cell"
            >
              <h1 className="text-lg font-semibold xsm:text-base">Correo</h1>
            </TableCell>
            <TableCell
              align="center"
              className="hidden px-2 pb-3.5 text-lg font-medium dark:text-dark-6 sm:table-cell"
            >
              <h1 className="text-lg font-semibold xsm:text-base">Teléfono</h1>
            </TableCell>
            <TableCell
              align="center"
              className="hidden px-2 pb-3.5 text-lg font-medium dark:text-dark-6 sm:table-cell"
            >
              <h1 className="text-lg font-semibold xsm:text-base">Estado</h1>
            </TableCell>
            <TableCell
              align="center"
              className="hidden px-2 pb-3.5 text-lg font-medium dark:text-dark-6 sm:table-cell"
            >
              <h1 className="text-lg font-semibold xsm:text-base">Acciones</h1>
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={7} align="center">
                <LoaderBasic />
              </TableCell>
            </TableRow>
          ) : data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} align="center">
                <Typography variant="h6" className="py-6 text-gray-500">
                  No hay usuarios disponibles.
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            currentData.map((usuario) => (
              <TableRow
                key={usuario.id_user}
                sx={{
                  cursor: "pointer",
                  borderRadius: "15px",
                  "&:hover": {
                    boxShadow: "4px 4px 16px rgba(0, 0, 0, 0.2)",
                  },
                }}
                className="border-b border-stroke duration-150 hover:scale-95 dark:border-dark-3"
              >
                <TableCell align="center" className="px-2 py-17 text-xl">
                  <p className="hidden font-estandar text-xl font-medium text-dark dark:text-dark-6 sm:block">
                    {usuario.names} {usuario.lastnames}
                  </p>
                </TableCell>
                <TableCell align="center" className="px-2 py-4">
                  <p className="font-estandar text-xl font-medium text-dark dark:text-dark-6">
                    {usuario.rol}
                  </p>
                </TableCell>
                <TableCell align="center" className="px-2 py-4">
                  <p className="font-estandar text-xl font-bold text-dark dark:text-dark-6">
                    {usuario.dni}
                  </p>
                </TableCell>
                <TableCell align="center" className="px-2 dark:text-dark-6">
                  <p className="text-center font-estandar text-xl font-medium text-dark dark:text-dark-6">
                    {usuario.mail}
                  </p>
                </TableCell>
                <TableCell
                  align="center"
                  className="hidden px-2 py-4 sm:table-cell"
                >
                  <p className="font-estandar text-xl font-medium text-dark dark:text-dark-6">
                    {usuario.phone_number}
                  </p>
                </TableCell>
                <TableCell
                  align="center"
                  className="hidden px-2 py-4 sm:table-cell"
                >
                  <div className="flex flex-col items-center gap-3">
                    <SwitcherThree checked={usuario.status} />
                  </div>
                </TableCell>
                <TableCell
                  align="center"
                  className="hidden px-2 py-4 sm:table-cell"
                >
                  <div className="flex flex-col gap-4">
                    {usuario.id_user !== 1 ? (
                      <div>
                        <BasicModal
                          tituloBtn="Editar"
                          tituloModal={`Editar Usuario # ${usuario.id_user}`}
                          // disabled={usuario.id_user === 1}
                        >
                          <EditarUsuario
                            userId={usuario.id_user}
                            handleClose={() =>
                              console.log("presionado para salir")
                            }
                          />
                        </BasicModal>
                        <button
                          onClick={() => handleEliminar(usuario.id_user)}
                          className="rounded-md border border-red-500 px-6 py-2.5 text-sm font-semibold text-red-500 duration-300 hover:bg-red-500 hover:text-white lg:px-8 xl:px-10"
                        >
                          Eliminar
                        </button>
                      </div>
                    ) : (
                      <Typography variant="h6" className="text-gray-500">
                        Acciones deshabilitadas.
                      </Typography>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Componente de paginación */}
      <div className="mt-4 flex items-center justify-center">
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
            pageSizeOptions={["1", "3", "5", "10", "20"]}
            className="text-black dark:text-dark-6"
            itemRender={(page, type, originalElement) => {
              if (type === "page" && isPageEmpty(page)) {
                return (
                  <div style={{ pointerEvents: "none", opacity: 0.5 }}>🔒</div>
                );
              }
              return originalElement;
            }}
          />
        </ConfigProvider>
      </div>
      <Toaster position="bottom-right" reverseOrder={false} />
    </div>
  );
};

export default dataUsuarios;
