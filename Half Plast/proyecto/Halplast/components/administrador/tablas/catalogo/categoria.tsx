/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useState, useMemo } from "react"
import { Column } from "react-table";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Modal from "react-modal";
import Swal from 'sweetalert2';
import Image from "next/image";

import OpcionesImagen from '../catalogo/checkBox/opcionesImagen';
import InputImagen from '../inputImagen/componentetInputImagen';
import ImagenSelect from './selects/selectImagenes';
import ImagenSelectEditar from './selects/selectImagenesEditar';
import Table from '../tabla/formatoTabla';

import EditarCategoria from '@/service/api/catalogo/categoria/EditarCategoria';
import EliminarCategoria from '@/service/api/catalogo/categoria/EliminarCategoria';
import AgregarCategoria from '@/service/api/catalogo/categoria/AgregarCategoria';

import AgregarImagen from '@/service/api/img/AgregarImagen';

import { DataRowCategoria } from '../tiposFilas/categoria';

import StatusBoton from './estado/estado';

import {
  Image as ImageIcon,
  Pencil,
  Trash2,
} from "lucide-react";

Modal.setAppElement('#root');

declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: any) => void;
  }
}

interface DataTableProps {
  data: DataRowCategoria[];
  setRefreshData: React.Dispatch<React.SetStateAction<boolean>>;
}

const DataTable: React.FC<DataTableProps> = ({ data, setRefreshData }) => {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ModalAgregarAbrir, setIsModalAgregar] = useState(false);
  const [modalData, setModalData] = useState<{ id: string; name: string; urlImagen:string } | null>(null);

  const [modalImageUrl, setModalImageUrl] = useState<string | null>(null);
  const [isModalAbrirImagen, setIsModalAbrirImagen] = useState(false);

  const [OpcionImagen, setOpcionImagen] = useState<string>('guardar');
  const [OpcionImagen2, setOpcionImagen2] = useState<string>('seleccionar');
  const [categoria, setNombreCategoria] = useState<string>('');
  const [selectedImageId, setSelectedImageId] = useState<string | undefined>(undefined);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | undefined>(undefined);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const columns: Column<DataRowCategoria>[] = useMemo(
    () => [
      { 
        Header: "ID", 
        accessor: "col1", 
        Cell: ({ value }) => <div style={{ textAlign: 'center' }}>{value}</div>, 
      },
      { 
        Header: "Nombre", 
        accessor: "col2", 
        Cell: ({ value }) => <div style={{ textAlign: 'center' }}>{value}</div>, 
      },
      {
        Header: "Imagen",
        accessor: "col4",
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
            <StatusBoton isEnabled={value} id={row.original.col3} modulo="categoria" disabled={false}/>
          </div>
        ),
      },
      {
        Header: "Editar",
        Cell: ({ row }) => (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <button className="" onClick={() => openModal(row.original.col3, row.original.col2, row.original.col4)}>
              <Pencil className="h-6 w-6 hover:text-green-600" />
            </button>
          </div>
        ),
      },
      {
        Header: "Eliminar",
        Cell: ({ row }) => (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <button onClick={() => eliminarCategoria(row.original.col3)}>
              <Trash2 className="h-6 w-6 hover:text-red-600" />
            </button>
          </div>
        ),
      },
    ],
    []
  );

  const abrirModalImagen = (imageUrl: string) => {
    setModalImageUrl(imageUrl);
    setIsModalAbrirImagen(true);
  };

  const cerrarModalImagen = () => {
    setIsModalAbrirImagen(false);
    setModalImageUrl(null);
  };

  const handleFileChangeUpload = (file: File) => {
    setImageFile(file)
  };
  
  const openModal = (id: string, name: string, urlImagen:string) => {
    setModalData({ id, name, urlImagen });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setNombreCategoria('');
    setIsModalOpen(false);
  };

  const abrirModalAgregar = () => {
    setIsModalAgregar(true);
  };

  const cerrarModalAgregar = () => {
    setNombreCategoria('');
    setIsModalAgregar(false);
    setOpcionImagen('guardar');
  };

  const agregarCategoria = async (e: React.FormEvent) => {
    e.preventDefault();
    if (categoria && (selectedImageId && OpcionImagen !== 'guardar') || (imageFile !== null && OpcionImagen === 'guardar')) {
      try {
        let response1 = selectedImageId
        console.log(imageFile)
        if (!imageFile && OpcionImagen === 'guardar') {
          Swal.fire("Error", "Por favor completa todos los campos", "error");
          return;
        }else if (imageFile !== null && OpcionImagen === 'guardar'){
          const formData = new FormData();
          formData.append("fileName", imageFile.name);
          formData.append("file", imageFile);
  
          const respuesta = await AgregarImagen('Categoria', formData);
          if (respuesta) {
            response1 = respuesta
          }
        }

        if (response1) {
          const response2 = await AgregarCategoria(categoria, response1);

          if (response2) {
            Swal.fire({
              title: '¡Exitoso!',
              text: '¡Categoría editada exitosamente!',
              icon: 'success',
              timerProgressBar: true,
              timer: 1500,
              showConfirmButton: false,
            });
            setIsModalAgregar(false);
            setRefreshData(true);
          } else {
            Swal.fire({
              title: '¡Error!',
              text: '¡La categoría no pudo ser agregada!',
              icon: 'error',
              timerProgressBar: true,
              timer: 1500,
              showConfirmButton: false,
            });
            setIsModalAgregar(false);
            setNombreCategoria('');
          }
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
        setIsModalAgregar(false);
        setNombreCategoria('');
      }
    }
  };

  const editarCategoria = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (modalData?.name && modalData?.id && selectedImageId != null) {
      const id = modalData?.id || ""
      
      try {
        let response1 = selectedImageId
        if (!imageFile && OpcionImagen2 === 'guardar') {
          Swal.fire("Error", "Por favor completa todos los campos", "error");
          return;
        }else if (imageFile !== null && OpcionImagen2 === 'guardar'){
          const formData = new FormData();
          formData.append("fileName", imageFile.name);
          formData.append("file", imageFile);
  
          const respuesta = await AgregarImagen('Categoria', formData);
          if (respuesta) {
            response1 = respuesta
          }
        }

        const response = await EditarCategoria(modalData?.name, id, selectedImageId); 
        if (response) {
          Swal.fire({
            title: '¡Exitoso!',
            text: '¡Categoría editada exitosamente!',
            icon: 'success',
            timerProgressBar: true,
            timer: 1500,
            showConfirmButton: false,
          });
          setIsModalOpen(false);
          setRefreshData(true); 
        } else {
          Swal.fire({
            title: '¡Error!',
            text: '¡La categoría no pudo ser editada!',
            icon: 'error',
            timerProgressBar: true,
            timer: 1500,
            showConfirmButton: false,
          });
          setIsModalOpen(false);
          setNombreCategoria('');
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
        setIsModalOpen(false);
        setNombreCategoria('');
      }
    }
  };

  const eliminarCategoria = async (identificador: string) => {
    if (identificador) {
      try {
        const response = await EliminarCategoria(identificador); 
        if (response) {
          Swal.fire({
            title: '¡Exitoso!',
            text: '¡Categoría eliminada exitosamente!',
            icon: 'success',
            timerProgressBar: true,
            timer: 1500,
            showConfirmButton: false,
          });
          setIsModalOpen(false);
          setRefreshData(true); 
        } else {
          Swal.fire({
            title: '¡Error!',
            text: '¡La categoría no pudo ser eliminada!',
            icon: 'error',
            timerProgressBar: true,
            timer: 1500,
            showConfirmButton: false,
          });
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
    }else {
      Swal.fire({
        title: '¡Error!',
        text: '¡El identificador no se reconoce¡',
        icon: 'error',
        timerProgressBar: true,
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const columnsToInclude = [0, 1, 2];
    
    const tableColumn = columns
      .filter((_, index) => columnsToInclude.includes(index))
      .map((col) => col.Header as string);
    const tableRows = data.map((row) => {
      const rowData = Object.values(row);
      if (rowData[3] == true) {
        rowData[2] = "Habilitado" 
      }else{
        rowData[2] = "Inhabilitado"
      }

      rowData.splice(3, 1);
  
      return rowData;
    });
  
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
    });
  
    doc.save("table.pdf");
  };

  return (
    <div style={{ padding: "20px" }}>
      <button type="button" className="botonAgregado"  onClick={abrirModalAgregar}>Agregar</button>

      <Table<DataRowCategoria> columns={columns} data={data} setRefreshData={() => {}}/>

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
            <h2 className="titleSinFondoModal">Editar Categoría</h2>
            <form className="formularioEditar" onSubmit={editarCategoria}>
              <div>
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
                  value={modalData?.name || ""}
                  onChange={(e) => {
                    if (modalData) {
                      setModalData({ ...modalData, name: e.target.value });
                    }
                    setNombreCategoria(e.target.value);
                  }}
                  className="inputEditarForm"
                />
              </div>

              <OpcionesImagen onChange={setOpcionImagen2} base="seleccionar" />
              {
                OpcionImagen2 === 'guardar' ? (
                  <InputImagen onSelect={handleFileChangeUpload} />
                ) : (
                  <ImagenSelectEditar 
                    primerDato={modalData?.urlImagen || ""} 
                    moduduloBusqueda="Categoria" 
                    onSelect={(id, url) => {
                      setSelectedImageId(id);
                      setSelectedImageUrl(url);
                    }} 
                  />
                )
              }
              
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="submit"
                  className="botonEditarModal"
                >
                  Editar Categoría
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
          {OpcionImagen2 !== 'guardar' && 
            <div className="ImageContent">
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
          }
        </div>
      </Modal>

      <Modal
        isOpen={ModalAgregarAbrir}
        onRequestClose={cerrarModalAgregar}
        contentLabel="Edit Modal"
        className="ModalDashboard"
        overlayClassName="Overlay"
      >
      <div className="ModalDashboard"  style={{maxWidth:'550px'}}>
        <div className="FormContent">
          <h2 className="titleSinFondoModal">Agregar categoría</h2>
          <form className="formularioAgregar" onSubmit={agregarCategoria}>
            <div>
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
                value={categoria}
                onChange={(e) => setNombreCategoria(e.target.value)}
                className="inputEditarForm"
              />
            </div>

            <OpcionesImagen onChange={setOpcionImagen} base="guardar"/>
            {
              OpcionImagen === 'guardar' ? (
                <InputImagen onSelect={handleFileChangeUpload} />
              ) : (
                <ImagenSelect 
                  moduduloBusqueda="Categoria" 
                  onSelect={(id, url) => {
                    setSelectedImageId(id);
                    setSelectedImageUrl(url);
                  }} 
                />
              )
            }
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="submit"
                className="botonEditarModal"
              >
                Agregar
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
        {OpcionImagen === 'seleccionar' && 
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
        }
      </div>
      </Modal>
    </div>
  );
};

export default DataTable;