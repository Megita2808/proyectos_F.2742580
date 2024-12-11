"use client"
import { Table, TableBody, TableCell, TableHead, TableRow, Typography  } from "@mui/material";
import { fetchCategories } from "@/api/fetchs/get_categorias";
import ButtonDefault from "@/components/Buttons/ButtonDefault";
import { Categoria } from "@/types/admin/Categoria";
import { useState, useEffect } from "react";
import LoaderBasic from "@/components/Loaders/LoaderBasic";
import BasicModal from "@/components/Modals/BasicModal";
import EditCategoriaForm from "./editarCategoriaForm";
import { eliminarCategoria } from "./eliminarCategoria"
import { Pagination, ConfigProvider } from "antd";
import esES from "antd/es/locale/es_ES";
import toast, { Toaster } from 'react-hot-toast';

const dataCategorias = () => {
  const [data, setData] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // const data = await fetchCategories();

  useEffect(() => {
    const loadData = async () => {
      try {
        const cateogorias = await fetchCategories();
        setData(cateogorias);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleEliminar = (categoryId: number) => {
    eliminarCategoria(categoryId); 
 };

 const handlePageChange = (page: number, size: number) => {
  if (page <= totalPages) {
    setCurrentPage(page);
    setPageSize(size);
  }
};

const startIndex = (currentPage - 1) * pageSize;
const currentData = data.slice(startIndex, startIndex + pageSize);

const totalCategorias = data.length;
const totalPages = Math.ceil(totalCategorias / pageSize);

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
            <TableCell className="w-5 px-2 pb-3.5 text-sm font-medium dark:text-dark-6">
              <h1 className="text-sm font-semibold xsm:text-base">Id</h1>
            </TableCell>
            <TableCell
              align="center"
              className="px-2 pb-3.5 text-sm font-medium dark:text-dark-6"
            >
              <h1 className="text-sm font-semibold xsm:text-base">
                Nombre categoria
              </h1>
            </TableCell>
            <TableCell
              align="center"
              className="px-2 pb-3.5 text-sm font-medium dark:text-dark-6"
            >
              <h1 className="text-sm font-semibold xsm:text-base">
                Cantidad productos
              </h1>
            </TableCell>
            <TableCell
              align="center"
              className="hidden w-5 px-2 pb-3.5 text-sm font-medium dark:text-dark-6 sm:table-cell"
            >
              <h1 className="text-sm font-semibold xsm:text-base">Acciones</h1>
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={1000}>
                <LoaderBasic />
              </TableCell>
            </TableRow>
          ) : data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={1000} align="center">
                <Typography variant="h6" className="py-6 text-gray-500">
                  No hay categorías disponibles.
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            currentData.map((categoria, key) => (
              <TableRow
              sx={{
                cursor: 'pointer',
                borderRadius: "15px",
                '&:hover': {
                  boxShadow: '4px 4px 16px rgba(0, 0, 0, 0.2)',
                },
              }}
                key={categoria.id_category}
                className="border-b border-stroke dark:border-dark-3 hover:scale-95 duration-300"
              >
                {/* Id Categoría */}
                <TableCell>
                  <p className="font-medium text-dark dark:text-dark-6">
                    {categoria.id_category}
                  </p>
                </TableCell>

                {/* Nombre Categoría */}
                <TableCell align="center">
                  <p className="font-medium text-dark dark:text-dark-6">
                    {categoria.name}
                  </p>
                </TableCell>

                {/* Cantidad Productos */}
                <TableCell align="center">
                  <p className="font-medium text-dark dark:text-dark-6">
                    {categoria.quantity}
                  </p>
                </TableCell>

                {/* Acciones */}
                <TableCell
                  align="center"
                  className="hidden px-2 py-1 sm:table-cell"
                >
                  <div className="flex flex-col gap-1 ">
                    
                    <div className="flex flex-row justify-end gap-2 pb-2 pt-2 text-right">
                      {/* Modal de edición */}
                      <BasicModal
                        tituloBtn="Editar"
                        tituloModal="Editar Categoría"
                      >
                        <EditCategoriaForm
                          id_category={categoria.id_category}
                        />
                      </BasicModal>
                    </div>
                    <div>
                    <button
                      onClick={() => handleEliminar(categoria.id_category)} 
                      className="rounded-[3px] border border-red-500 px-6 py-2.5 text-sm font-semibold text-red-500 hover:bg-red-500 hover:text-white lg:px-8 xl:px-10"
                    >
                      Eliminar
                    </button>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
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
            total={10000}
            onChange={handlePageChange}
            disabled={loading}
            showSizeChanger
            onShowSizeChange={handlePageChange}
            pageSizeOptions={['1','5', '10', '20']}
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
    </div>
  );
};

export default dataCategorias;
