/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { useTable, usePagination, useFilters, Column, Row, TableInstance, TableState } from "react-table";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Modal from "react-modal";
import Swal from 'sweetalert2';
import { Pencil, Trash2 } from "lucide-react";

import StatusBoton from './estado/estado';

import EditarProducto from '@/service/api/catalogo/normalizarColores/EditarNormalizarColores';
import EliminarProducto from '@/service/api/catalogo/normalizarColores/EliminarNormalizarColores';
import AgregarProducto from '@/service/api/catalogo/normalizarColores/AgregarNormalizarColores';
import { getCategorias } from "@/service/api/catalogo/categoria/TodoCategoria";

Modal.setAppElement('#root');

interface DataRow {
  col1: number;
  col2: string;
  col3: string;
  col4: string;
  enabled: boolean;
}

interface DataTableProps {
  data: DataRow[];
  setRefreshData: React.Dispatch<React.SetStateAction<boolean>>;
}

type TableInstanceWithFiltersPagination<T extends object> = TableInstance<T> & {
  page: Row<T>[];
  setFilter: (columnId: string, filterValue: any) => void;
  canPreviousPage: boolean;
  canNextPage: boolean;
  nextPage: () => void;
  previousPage: () => void;
  gotoPage: (updater: number | ((pageIndex: number) => number)) => void;
  pageCount: number;
  state: {
    pageIndex: number;
    pageSize: number;
  };
};

const DataTable: React.FC<DataTableProps> = ({ data, setRefreshData }) => {
  const [datosCategoria, setDataCategoria] = useState<{ idCategoriaApi: string; nombreCategoriaApi: string }[]>([]);
  const [activeColumn, setActiveColumn] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ModalAgregarAbrir, setIsModalAgregar] = useState(false);
  const [modalData, setModalData] = useState<{ id: string; name: string; idCategoriaApi: string; nombreCategoriaBase: string } | null>(null);
  const [selectedCategoria, setSelectedCategoria] = useState<string>('');
  const [producto, setNombreProducto] = useState<string>('');
  const [filters, setFilters] = useState<{ [key: string]: string }>({});

  const inputRef = useRef<HTMLInputElement>(null);

  const fetchCategorias = useCallback(async () => {
    try {
      const categorias = await getCategorias();
      const datosCategoria = categorias.map((categoria) => ({
        idCategoriaApi: categoria._id,
        nombreCategoriaApi: categoria.nombreCategoria,
      }));
      setDataCategoria(datosCategoria);
    } catch (error) {
      console.error('Error al obtener las categorías:', error);
    }
  }, []);

  useEffect(() => {
    fetchCategorias();
  }, [fetchCategorias]);

  const columns: Column<DataRow>[] = useMemo(
    () => [
      { Header: "ID", accessor: "col1" },
      { Header: "Categoria", accessor: "col4" },
      { Header: "Nombre producto", accessor: "col2" },
      {
        Header: "Estado",
        accessor: "enabled",
        Cell: ({ value, row }) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <StatusBoton isEnabled={value} id={row.original.col3} modulo="NormalizarColores" disabled={false}/>
        </div>
        ),
      },
      {
        Header: "Editar",
        Cell: ({ row }) => (
          <td className="AccionesBotones">
            <button onClick={() => openModal(row.original.col3, row.original.col2, row.original.col4)}>
              <Pencil className="h-6 w-6 hover:text-white" />
            </button>
          </td>
        ),
      },
      {
        Header: "Eliminar",
        Cell: ({ row }) => (
          <td className="AccionesBotones2">
            <button onClick={() => eliminarProducto(row.original.col3)}>
              <Trash2 className="h-6 w-6 hover:text-white" />
            </button>
          </td>
        ),
      },
    ],
    [setRefreshData]
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    setFilter,
    canPreviousPage,
    canNextPage,
    nextPage,
    previousPage,
    pageCount,
    state: { pageIndex, pageSize },
  } = useTable<DataRow>(
    {
      columns,
      data,
      initialState: {
        pageIndex: 0,
        pageSize: 10,
      } as TableState<DataRow>,
    },
    useFilters,
    usePagination
  ) as TableInstanceWithFiltersPagination<DataRow>;

  const handleChange2 = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategoria(e.target.value);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>, value: string, columnId: string) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [columnId]: value,
    }));
    setFilter(columnId, value || undefined);
  };

  const handleHeaderClick = useCallback(
    (columnId: string) => {
      if (filters[columnId] !== undefined) {
        setFilters((prevFilters) => {
          const { [columnId]: _, ...rest } = prevFilters;
          return rest;
        });
        setFilter(columnId, undefined);
      } else {
        setActiveColumn((prevActiveColumn) =>
          prevActiveColumn === columnId ? null : columnId
        );
      }
    },
    [filters, setFilter]
  );

  const isNonSearchableColumn = (columnId: string) => {
    const nonSearchableColumns = ['Editar', 'Eliminar'];
    return nonSearchableColumns.includes(columnId);
  };

  const openModal = useCallback(async (id: string, name: string, nombreCategoria: string) => {
    await fetchCategorias();
    const categoriaEncontrada = datosCategoria.find(
      (categoria) => categoria.nombreCategoriaApi.toLowerCase() === nombreCategoria.toLowerCase()
    );

    setModalData({
      id,
      name,
      idCategoriaApi: categoriaEncontrada?.idCategoriaApi || "vacio",
      nombreCategoriaBase: nombreCategoria,
    });
    setIsModalOpen(true);
  }, [datosCategoria, fetchCategorias]);

  const closeModal = useCallback(() => {
    setNombreProducto('');
    setSelectedCategoria('');
    setIsModalOpen(false);
  }, []);

  const abrirModalAgregar = useCallback(() => {
    setIsModalAgregar(true);
  }, []);

  const cerrarModalAgregar = useCallback(() => {
    setNombreProducto('');
    setSelectedCategoria('');
    setIsModalAgregar(false);
  }, []);

  const agregarProducto = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (producto) {
      try {
        const response = await AgregarProducto(producto, selectedCategoria);
        Swal.fire({
          title: response ? '¡Exitoso!' : '¡Error!',
          text: response ? 'Producto agregado exitosamente!' : '¡El producto no pudo ser agregado!',
          icon: response ? 'success' : 'error',
          timerProgressBar: true,
          timer: 1500,
          showConfirmButton: false,
        });
        if (response) {
          cerrarModalAgregar();
          setRefreshData(true);
        }
      } catch (error) {
        Swal.fire({
          title: '¡Error!',
          text: '¡La solicitud no pudo ser enviada!',
          icon: 'error',
          timerProgressBar: true,
          timer: 1500,
          showConfirmButton: false,
        });
      }
    }
  }, [producto, selectedCategoria, cerrarModalAgregar, setRefreshData]);

  const editarProducto = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (modalData?.id) {
      try {
        const response = await EditarProducto(producto || modalData.name, modalData.id, selectedCategoria);
        Swal.fire({
          title: response ? '¡Exitoso!' : '¡Error!',
          text: response ? 'Producto editado exitosamente!' : '¡El producto no pudo ser editado!',
          icon: response ? 'success' : 'error',
          timerProgressBar: true,
          timer: 1500,
          showConfirmButton: false,
        });
        if (response) {
          closeModal();
          setRefreshData(true);
        }
      } catch (error) {
        Swal.fire({
          title: '¡Error!',
          text: '¡La solicitud no pudo ser enviada!',
          icon: 'error',
          timerProgressBar: true,
          timer: 1500,
          showConfirmButton: false,
        });
      }
    }
  }, [producto, modalData, selectedCategoria, closeModal, setRefreshData]);

  const eliminarProducto = useCallback(async (identificador: string) => {
    try {
      const response = await EliminarProducto(identificador);
      Swal.fire({
        title: response ? '¡Exitoso!' : '¡Error!',
        text: response ? '¡Producto eliminada exitosamente!' : '¡El producto no pudo ser eliminada!',
        icon: response ? 'success' : 'error',
        timerProgressBar: true,
        timer: 1500,
        showConfirmButton: false,
      });
      if (response) {
        setRefreshData(true);
      }
    } catch (error) {
      Swal.fire({
        title: '¡Error!',
        text: '¡La solicitud no pudo ser enviada!',
        icon: 'error',
        timerProgressBar: true,
        timer: 1500,
        showConfirmButton: false,
      });
    }
  }, [setRefreshData]);


  const generatePDF = () => {
    const doc = new jsPDF();

    const columnsToInclude = [0, 1, 2, 3];
    
    const tableColumn = columns
      .filter((_, index) => columnsToInclude.includes(index))
      .map((col) => col.Header as string);
  
    const tableRows = data.map((row) => {
      const rowData = Object.values(row);
      
      const filteredRowData = columnsToInclude.map((index) => {
        if (index === 1) {
          return rowData[3]; 
        } else if (index === 2) {
          return rowData[1]; 
        } else if (index === 3) {
          return rowData[4] ? "Habilitado" : "Inhabilitado";
        }
        return rowData[index];
      });
  
      return filteredRowData;
    });
  
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
    });
  
    doc.save("table.pdf");
  };

  return (
    <>
    <div style={{ padding: "20px" }}>
      <button className="botonAgregado" onClick={abrirModalAgregar}>
        Agregar Producto
      </button>
      <button className="botonPDF" onClick={generatePDF}>
        Exportar a PDF
      </button>
      <table
        {...getTableProps()}
        className="TableContainer"
      >
        <thead style={{ backgroundColor: "#f7f7f7" }}>
          {headerGroups.map((headerGroup, index) => (
            <tr {...headerGroup.getHeaderGroupProps()} key={`headerGroup-${index}`}>
              {headerGroup.headers.map((column, columnIndex) => (
                <th
                  {...column.getHeaderProps()}
                  key={`column-${column.id}-${columnIndex}`}
                  onClick={() =>
                    !isNonSearchableColumn(column.id) && handleHeaderClick(column.id)
                  }
                  style={{
                    padding: "15px",
                    textAlign: "left",
                    cursor: isNonSearchableColumn(column.id)
                      ? "default"
                      : "pointer",
                    position: "relative",
                    backgroundColor:
                      activeColumn === column.id ? "#e0e0e0" : "inherit",
                  }}
                >
                  {column.render("Header")}
                  {((activeColumn === column.id && !isNonSearchableColumn(column.id)) ||
                    filters[column.id]) && (
                    <input
                      ref={inputRef}
                      className="inputBuscador"
                      type="text"
                      placeholder={`Buscar ${column.render("Header")}`}
                      value={filters[column.id] || ""}
                      onChange={(e) => handleSearch(e, e.target.value, column.id)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row, rowIndex) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()} key={`row-${row.id}-${rowIndex}`}>
                {row.cells.map((cell, cellIndex) => (
                  <td
                    {...cell.getCellProps()}
                    key={`cell-${cell.column.id}-${cellIndex}`}
                    style={{
                      padding: "15px",
                      borderBottom: "1px solid #ddd",
                      textAlign: "left",
                    }}
                  >
                    {cell.render("Cell")}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="paginacion">
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          Anterior
        </button>
        <span>
          Página{' '}
          <strong>
            {pageIndex + 1} de {pageCount}
          </strong>{' '}
        </span>
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          Siguiente
        </button>
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Edit Modal"
        className="Modal"
        overlayClassName="Overlay"
      >
        <div className="ModalContent">
          <h2>Editar Producto</h2>
          <form
          className="formularioEditar"
          onSubmit={editarProducto}
          >
            <div>
              <label htmlFor="categoria-select" className="LabelModal">Selecciona una categoría</label>
              <select
                id="categoria-select"
                className="selectModal"
                value={selectedCategoria}
                onChange={handleChange2}
              >
                {modalData && (
                  <option value={modalData.idCategoriaApi}>
                    {modalData.nombreCategoriaBase}
                  </option>
                )}
                {datosCategoria
                  .filter((categoria) => categoria.nombreCategoriaApi !== modalData?.nombreCategoriaBase)
                  .map((categoria) => (
                    <option key={categoria.idCategoriaApi} value={categoria.idCategoriaApi}>
                      {categoria.nombreCategoriaApi}
                    </option>
                  ))
                }
              </select>
              <label
                htmlFor="categoryName"
                style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  marginBottom: '8px',
                  display: 'block',
                  color: '#333',
                }}
              >
                Nombre del producto
              </label>
              <input
                id="categoryName"
                type="text"
                name="categoryName"
                value={modalData?.name || ""}
                onChange={(e) => {
                  if (modalData) {
                    setModalData({ ...modalData, name: e.target.value });
                  }
                  setNombreProducto(e.target.value)
                }}
                className="inputEditarForm"
              />
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="submit"
                className="botonEditarModal"
              >
                Editar Producto
              </button>
              <button
                type="button"
                onClick={closeModal}
                className="CerrarModalBotonGeneral"
              >
                Cerrar
              </button>
            </div>
          </form>
        </div>
      </Modal>

      <Modal
        isOpen={ModalAgregarAbrir}
        onRequestClose={cerrarModalAgregar}
        contentLabel="Edit Modal"
        className="Modal"
        overlayClassName="Overlay"
      >
        <div className="ModalContent">
          <h2>Agregar Producto</h2>
          <form
          className="formularioAgregar"
          onSubmit={agregarProducto}
          >
            <div>
              <label htmlFor="categoria-select" className="LabelModal">Selecciona una categoría</label>
                <select id="categoria-select" className="selectModal" value={selectedCategoria} onChange={handleChange2}>
                  <option value="">Selecciona una opción</option>
                  {datosCategoria.map((categoria) => (
                    <option key={categoria.idCategoriaApi} value={categoria.idCategoriaApi}>
                      {categoria.nombreCategoriaApi}
                    </option>
                  ))}
                </select>
                <label
                  htmlFor="categoryName"
                  className="LabelModal"
                >
                  Nombre de la producto
              </label>
              <input
                id="categoryName"
                type="text"
                name="categoryName"
                value={producto}
                onChange={(e) => {
                  setNombreProducto(e.target.value)
                }}
                className="inputEditarForm"
              />
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="submit"
                className="botonEditarModal"
              >
                Agregar Producto
              </button>
              <button
                type="button"
                onClick={cerrarModalAgregar}
                className="CerrarModalBotonGeneral"
              >
                Cerrar
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
    </>
  );
};

export default DataTable;
