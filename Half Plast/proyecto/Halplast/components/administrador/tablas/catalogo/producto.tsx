/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import { Column } from "react-table";
import Image from "next/image";

import jsPDF from "jspdf";
import "jspdf-autotable";

import Modal from "react-modal";
import Swal from 'sweetalert2';

import { Image as ImageIcon, Pencil, Trash2 } from "lucide-react";

import { DataRowProducto } from '../tiposFilas/producto';

import ImagenSelect from './selects/selectImagenes';
import ImagenSelectEditar from './selects/selectImagenesEditar';
import Table from '../tabla/formatoTabla';
import StatusBoton from './estado/estado';

import EditarProducto from '@/service/api/catalogo/producto/EditarProducto';
import EliminarProducto from '@/service/api/catalogo/producto/EliminarProducto';
import AgregarProducto from '@/service/api/catalogo/producto/AgregarProducto';
import { getCategorias } from "@/service/api/catalogo/categoria/TodoCategoria";

Modal.setAppElement('#root');

interface DataTableProps {
  data: DataRowProducto[];
  setRefreshData: React.Dispatch<React.SetStateAction<boolean>>;
}

const DataTable: React.FC<DataTableProps> = ({ data, setRefreshData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ModalAgregarAbrir, setIsModalAgregar] = useState(false);
  
  const [modalImageUrl, setModalImageUrl] = useState<string | null>(null);
  const [isModalAbrirImagen, setIsModalAbrirImagen] = useState(false);

  const [selectedImageId, setSelectedImageId] = useState<string | undefined>(undefined);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | undefined>(undefined);

  const [modalData, setModalData] = useState<{ id: string; name: string; idCategoriaApi: string; nombreCategoriaBase: string; urlImagen:string  } | null>(null);
  
  const [selectedCategoria, setSelectedCategoria] = useState<string>('');
  const [datosCategoria, setDataCategoria] = useState<{ idCategoriaApi: string; nombreCategoriaApi: string }[]>([]);
  const [producto, setNombreProducto] = useState<string>('');

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

  const columns: Column<DataRowProducto>[] = useMemo(
    () => [
      { 
        Header: "ID", 
        accessor: "col1", 
        Cell: ({ value }) => <div style={{ textAlign: 'center' }}>{value}</div>, 
      },
      { 
        Header: "Categoria", 
        accessor: "col4", 
        Cell: ({ value }) => <div style={{ textAlign: 'center' }}>{value}</div>, 
      },
      { 
        Header: "Nombre", 
        accessor: "col2", 
        Cell: ({ value }) => <div style={{ textAlign: 'center' }}>{value}</div>, 
      },
      {
        Header: "Imagen",
        accessor: "col5",
        Cell: ({ value }) => (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <button onClick={() => abrirModalImagen(value)}>
              <ImageIcon className="h-6 w-6 hover:text-blue-600" />
            </button>
          </div>
        ),
      },
      {
        Header: "Estado",
        accessor: "enabled",
        Cell: ({ value, row }) => (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <StatusBoton isEnabled={value} id={row.original.col3}  modulo="producto" disabled={false}/>
          </div>
        ),
      },
      {
        Header: "Editar",
        Cell: ({ row }) => (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <button onClick={() => openModal(row.original.col3, row.original.col2, row.original.col4, row.original.col5)}>
              <Pencil className="h-6 w-6 hover:text-green-600" />
            </button>
          </div>
        ),
      },
      {
        Header: "Eliminar",
        Cell: ({ row }) => (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <button onClick={() => eliminarProducto(row.original.col3)}>
              <Trash2 className="h-6 w-6 hover:text-red-600" />
            </button>
          </div>
        ),
      },
    ],
    [setRefreshData]
  );

  const handleChange2 = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategoria(e.target.value);
  };

  const openModal = useCallback(async (id: string, name: string, nombreCategoria: string, urlImg: string) => {
    await fetchCategorias();
    const categoriaEncontrada = datosCategoria.find(
      (categoria) => categoria.nombreCategoriaApi.toLowerCase() === nombreCategoria.toLowerCase()
    );

    setSelectedImageUrl(urlImg);
  
    setModalData({
      id,
      name,
      idCategoriaApi: categoriaEncontrada?.idCategoriaApi || "vacio",
      nombreCategoriaBase: nombreCategoria,
      urlImagen: urlImg  
    });
  
    setIsModalOpen(true);
  }, [datosCategoria, fetchCategorias]);

  const closeModal = useCallback(() => {
    setNombreProducto('');
    setSelectedCategoria('');
    setSelectedImageId(undefined);
    setSelectedImageUrl(undefined);
    setIsModalOpen(false);
  }, []);

  const abrirModalAgregar = useCallback(() => {
    setSelectedImageId(undefined);
    setSelectedImageUrl(undefined);
    setIsModalAgregar(true);
  }, []);

  const cerrarModalAgregar = useCallback(() => {
    setNombreProducto('');
    setSelectedCategoria('');
    setIsModalAgregar(false);
  }, []);

  const abrirModalImagen = (imageUrl: string) => {
    setModalImageUrl(imageUrl);
    setIsModalAbrirImagen(true);
  };

  const cerrarModalImagen = () => {
    setIsModalAbrirImagen(false);
    setModalImageUrl(null);
  };

  const agregarProducto = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (producto && selectedImageId) {
      try {
        const response = await AgregarProducto(producto, selectedCategoria, selectedImageId);
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
    if (modalData?.id && selectedImageId != null) {
      try {
        const response = await EditarProducto(producto || modalData.name, modalData.id, selectedCategoria, selectedImageId);
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
  }, [producto, modalData, selectedCategoria, selectedImageId, closeModal, setRefreshData]);

  const eliminarProducto = useCallback(async (identificador: string) => {
      try {
          if (!identificador) {
              throw new Error('Identificador no válido');
          }

          const response = await EliminarProducto(identificador);

          Swal.fire({
              title: response ? '¡Exitoso!' : '¡Error!',
              text: response ? '¡Producto eliminado exitosamente!' : '¡El producto no pudo ser eliminado!',
              icon: response ? 'success' : 'error',
              timerProgressBar: true,
              timer: 1500,
              showConfirmButton: false,
          });

          if (response) {
              setRefreshData(true);
          }
      } catch (error) {
          console.error('Error en la eliminación del producto:', error);
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

  const actualizarImagen = async (id: string, url: string) => {
    setSelectedImageId(id);
    setSelectedImageUrl(url);
  };
  
  return (
    <>
    <div style={{ padding: "20px" }}>
      <button className="botonAgregado" onClick={abrirModalAgregar}>
        Agregar
      </button>
      
      <Table<DataRowProducto> columns={columns} data={data} setRefreshData={() => {}}/>

      <Modal
        isOpen={isModalAbrirImagen}
        onRequestClose={cerrarModalImagen}
        contentLabel="Imagen"
        className="modal-abrir-imagen"
      >
        {modalImageUrl && (
          <div className="imagen-contenedor"> 
            <Image 
              src={modalImageUrl}           
              layout="intrinsic"
              width={200}
              height={200}
              alt="Imagen"
              className="imagen-modal"
            />
          </div>
        )}
      </Modal>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Edit Modal"
        className="ModalDashboard"
        overlayClassName="Overlay"
      >
      <div className="ModalDashboard">
        <div className="FormContent">
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
            <ImagenSelectEditar primerDato={modalData?.urlImagen || ""} moduduloBusqueda="Producto"
              onSelect={async (id, url) => {
                if (id && url){
                  await actualizarImagen(id, url); 
                }
              }} 
            />
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
        <div className="ImageContent">
          {selectedImageUrl && (
            <div className="imagen-contenedor"> 
              <Image 
                src={selectedImageUrl}           
                layout="intrinsic"
                width={200}
                height={200}
                alt="Imagen"
                className="imagen-modal"
              />
            </div>
          )}
        </div>
      </div>
      </Modal>

      <Modal
        isOpen={ModalAgregarAbrir}
        onRequestClose={cerrarModalAgregar}
        contentLabel="Edit Modal"
        className="ModalDashboard"
        overlayClassName="Overlay"
      >
        <div className="ModalDashboard">
         <div className="FormContent">
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
                  Nombre
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
            
            <ImagenSelect moduduloBusqueda="Producto" onSelect={async (id, url) => {
                if (id && url){
                  await actualizarImagen(id, url); 
                }
              }}
            />

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
        <div className="ImageContent">
          {selectedImageUrl && (
            <div className="imagen-contenedor"> 
              <Image 
                src={selectedImageUrl}           
                layout="intrinsic"
                width={200}
                height={200}
                alt="Imagen"
                className="imagen-modal"
              />
            </div>
            )}
          </div>
        </div>
      </Modal>
    </div>
    </>
  );
};

export default DataTable;
