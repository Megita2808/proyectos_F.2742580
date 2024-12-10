"use client";
import React, { useState, useMemo, useRef, useEffect, useCallback } from "react"
import { useTable, usePagination, useFilters, Column, Row, TableInstance, TableState } from "react-table";
import jsPDF from 'jspdf';
import 'jspdf-autotable'; 
import Modal from "react-modal";
import Swal from "sweetalert2";
import Image from "next/image";
import { format } from 'date-fns';

import TablaPredeterminada from './tabla/formatoTabla';
import { DataRowImagen } from './tiposFilas/imagen';

import StatusBoton from './catalogo/estado/estado';

import EditarImagen from '@/service/api/img/EditarImagen';
import EliminarImagen from '@/service/api/img/EliminarImagen';
import AgregarImagen from '@/service/api/img/AgregarImagen';

import { Image as ImageIcon, Pencil, Trash2 } from "lucide-react";

Modal.setAppElement('#root');

declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: any) => void;
  }
}



interface DataTableProps {
  data: DataRowImagen[];
  setRefreshData: React.Dispatch<React.SetStateAction<boolean>>;
}

const DataTable: React.FC<DataTableProps> = ({ data, setRefreshData }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [filters, setFilters] = useState<{ [key: string]: string }>({});
  const [activeColumn, setActiveColumn] = useState<string | null>(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isModalAbrirImagen, setIsModalAbrirImagen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [modalImageUrl, setModalImageUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [nombreModulo, setNombreModulo] = useState<string>("");
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  
  const [modalData, setModalData] = useState<{ id: string; modulo: string ; ModuloPrevio: string ;  } | null>(null);

  const openAddModal = () => setIsAddModalOpen(true);
  const abrirModalImagen = (imageUrl: string) => {
    setModalImageUrl(imageUrl);
    setIsModalAbrirImagen(true);
  };

  const abrirModalEditarImagen = (id: string, modulo: string, urlImagen: string) => {
    if (id && modulo && urlImagen) {
      const ModuloPrevio = modulo;
      setModalData({ id, modulo, ModuloPrevio });
      setModalImageUrl(urlImagen);
      setIsEditModalOpen(true);
    }
  };


  const cerrarModalImagen = () => {
    setIsModalAbrirImagen(false);
    setModalImageUrl(null);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setModalImageUrl(null);
    setImageFile(null);
    setNombreModulo("");
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setModalImageUrl(null);
    setImageFile(null);
    setSelectedImageId(null);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setImageFile(event.target.files[0]);
    }
  };

  const handleAddFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!imageFile || !nombreModulo) {
      Swal.fire("Error", "Por favor completa todos los campos", "error");
      return;
    }

    const formData = new FormData();
    formData.append("fileName", imageFile.name);
    formData.append("file", imageFile);

    try {
      const response = await AgregarImagen(nombreModulo, formData);
      if (response) {
        Swal.fire("Éxito", "Imagen agregada correctamente", "success");
        setRefreshData(prev => !prev);
        closeAddModal();
      } else {
        Swal.fire("Error", "Hubo un problema al agregar la imagen", "error");
      }
    } catch (error) {
      Swal.fire("Error", "Hubo un problema al agregar la imagen", "error");
    }
  };

  const handleEditFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!imageFile && modalData?.modulo === modalData?.ModuloPrevio) {
        Swal.fire("Información", "No hay datos nuevos para actualizar. No se enviará ninguna solicitud.", "info");
        return;
    }

    const formData = new FormData();

    formData.append("fileName", imageFile ? imageFile.name : "");
    formData.append("file", imageFile || "");
    formData.append('identificadorImagen', modalData?.id || "");
    
    try {
        const response = await EditarImagen(modalData?.modulo || "", formData);
        if (response) {
          Swal.fire("Éxito", "Imagen editada correctamente", "success");
          setRefreshData(prev => !prev);
          closeEditModal();
        } else {
          Swal.fire("Error", "Hubo un problema al editar la imagen", "error");
        }
    } catch (error) {
        Swal.fire("Error", "Hubo un problema al editar la imagen", "error");
    }
};
  const columns: Column<DataRowImagen>[] = useMemo(
    () => [
      { Header: "ID", accessor: "col1" },
      { Header: "Nombre Modulo", accessor: "col2" },
      {
        Header: "Imagen",
        accessor: "dataColum",
        Cell: ({ value }) => (
          <button onClick={() => abrirModalImagen(value)}>
            <ImageIcon className="h-6 w-6 hover:text-blue-600" />
          </button>
        ),
      },
      {
        Header: 'Fecha ultima actualizacion',
        accessor: 'uploadedAt',
        Cell: ({ value }: { value: Date }) => {
          return format(new Date(value), 'dd/MM/yyyy');
        },
      },
      {
        Header: "Estado",
        accessor: "enabled",
        Cell: ({ value, row }) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <StatusBoton isEnabled={value} id={row.original.col3}  modulo="imagen" disabled={false} />
        </div>
        ),
      },
      {
        Header: "Editar",
        Cell: ({ row }) => (
          <button onClick={() => abrirModalEditarImagen(row.original.col3, row.original.col2, row.original.dataColum)}>
            <Pencil className="h-6 w-6 hover:text-green-600" />
          </button>
        ),
      },
      {
        Header: "Eliminar",
        Cell: ({ row }) => (
          <button
            onClick={() => {
              Swal.fire({
                title: '¿Estás seguro?',
                text: "No podrás revertir esto.",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Sí, eliminarlo!',
              }).then(async (result) => {
                if (result.isConfirmed) {
                  try {
                    const response = await EliminarImagen(row.original.col3);
                    if (response) {
                      Swal.fire("Eliminado!", "La imagen ha sido eliminada.", "success");
                      setRefreshData(prev => !prev);
                    } else {
                      Swal.fire("Error", "Hubo un problema al eliminar la imagen", "error");
                    }
                  } catch (error) {
                    Swal.fire("Error", "Hubo un problema al eliminar la imagen", "error");
                  }
                }
              });
            }}
          >
            <Trash2 className="h-6 w-6 hover:text-red-600" />
          </button>
        ),
      },
    ],
    [setRefreshData]
  );

  const generatePDF = async () => {
    const doc = new jsPDF();
    const columnsToInclude = [0, 1, 2, 3, 4];
  
    const tableColumn = columns
      .filter((_, index) => columnsToInclude.includes(index))
      .map((col) => col.Header as string);
  
    const tableRows = await Promise.all(
      data.map(async (row: DataRowImagen) => {
        const rowData = Object.values(row);

        if (rowData[5]) {
          rowData[4] = rowData[5];
        }
  
        if (rowData[3] == true) {
          rowData[5] = "Habilitado" 
        }else{
          rowData[5] = "Inhabilitado"
        }
  
        if (rowData[2]) {
          rowData[2] = row.col6;
        }
  
        rowData.splice(3, 1);
  
        return rowData;
      })
    );
  
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
    });
  
    doc.save("Tabla_Imagenes.pdf");
  };

  return (
    <div style={{ padding: "20px" }}>
      <button type="button" className="botonAgregado" onClick={openAddModal}>Agregar Imagen</button>

      <TablaPredeterminada<DataRowImagen> columns={columns} data={data} setRefreshData={() => {}}/>
        
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
        isOpen={isAddModalOpen}
        onRequestClose={closeAddModal}
        contentLabel="Agregar Imagen"
        className="Modal"
        overlayClassName="Overlay"
      >
        <div className="ModalContentSinImagen"> 
          <h2>Agregar</h2>
          <form className="formularioEditar" onSubmit={handleAddFormSubmit}>
          <div className="formulario-contenedor">
            <input
              type="text"
              placeholder="Nombre del módulo"
              value={nombreModulo}
              onChange={(e) => setNombreModulo(e.target.value)}
              required
            />
            <input
              type="file"
              onChange={handleFileChange}
              required
            />
          </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit"                 
                className="botonEditarModal"
              >
                Agregar
              </button>
              <button
                type="button"
                onClick={closeAddModal}
                className="CerrarModalBotonGeneral"
              >
                Cerrar
              </button>
            </div>
          </form>
        </div>
      </Modal>
      <Modal
        isOpen={isEditModalOpen}
        onRequestClose={closeEditModal}
        contentLabel="Editar Imagen"
        className="Modal"
        overlayClassName="Overlay"
      >
        <div className="Modal">
          <div className="FormContent">
            <h2>Editar</h2>

            <form className="formularioEditar" onSubmit={handleEditFormSubmit}>
            <div className="formulario-contenedor">
              <input
                type="text"
                placeholder="Nombre del módulo"
                value={modalData?.modulo || ""}
                onChange={(e) => {
                  if (modalData) {
                    setModalData({ ...modalData, modulo: e.target.value });
                  }
                }}
                required
              />
              <input
                type="file"
                onChange={handleFileChange}
              />
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit"                 
                  className="botonEditarModal"
                >
                  Editar
                </button>
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="CerrarModalBotonGeneral"
                >
                  Cerrar
                </button>
              </div>
            </form> 
          </div>
          <div className="ImageContent">
            {modalImageUrl && (
              <div className="imagen-contenedor"> 
                <Image 
                  src={modalImageUrl}           
                  layout="intrinsic"
                  width={200}
                  height={200}
                  alt="Imagen"
                  className="imagenEditarMostrar"
                />
              </div>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DataTable;