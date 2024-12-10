/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import { Column } from "react-table";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Modal from "react-modal";
import Swal from 'sweetalert2';

import { DataRowPermiso } from '../../../tiposFilas/permiso';

import Table from '../../../tabla/formatoTabla';
import StatusBoton from '../../../catalogo/estado/estado';

import EditarPermiso from '@/service/api/configuracion/permiso/EditarPermiso';
import EliminarPermiso from '@/service/api/configuracion/permiso/EliminarPermiso';
import AgregarPermiso from '@/service/api/configuracion/permiso/AgregaPermiso';

import {
  Pencil,
  Trash2,
} from "lucide-react";
import { strict } from "assert";

Modal.setAppElement('#root');

declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: any) => void;
  }
}


interface DataTableProps {
  data: DataRowPermiso[];
  setRefreshData: React.Dispatch<React.SetStateAction<boolean>>;
}

const DataTable: React.FC<DataTableProps> = ({ data, setRefreshData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ModalAgregarAbrir, setIsModalAgregar] = useState(false);
  const [modalData, setModalData] = useState<{ id: string, nombrePermiso: string; descripcionPermiso: string } | null>(null);
  const [nombrePermiso, setNombrePermiso] = useState<string>('');
  const [descripcionPermiso, setDescripcionPermiso] = useState<string>('');

  const columns: Column<DataRowPermiso>[] = useMemo(
    () => [
      { 
        Header: "ID", 
        accessor: "col1", 
        Cell: ({ value }) => <div style={{ textAlign: 'center' }}>{value}</div>, 
      },
      { 
        Header: "Nombre", 
        accessor: "nombrePermiso", 
        Cell: ({ value }) => <div style={{ textAlign: 'center' }}>{value}</div>, 
      },
      { 
        Header: "Descripcion", 
        accessor: "descripcionPermiso", 
        Cell: ({ value }) => <div style={{ textAlign: 'center' }}>{value}</div>, 
      },
    ],
    []
  );

  const openModal = (id: string, nombrePermisoDato: string, descripcionPermisoDato: string) => {
    setModalData({ id, nombrePermiso: nombrePermisoDato, descripcionPermiso: descripcionPermisoDato });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setNombrePermiso('')
    setDescripcionPermiso('')
    setIsModalOpen(false);
  };

  const abrirModalAgregar = () => {
    setIsModalAgregar(true);
  };

  const cerrarModalAgregar = () => {
    setNombrePermiso('')
    setDescripcionPermiso('')
    setIsModalAgregar(false);
  };

  const agregarPeso = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((nombrePermiso && nombrePermiso !== '') && (descripcionPermiso && descripcionPermiso !== '')) {
      try {
        const response = await AgregarPermiso(nombrePermiso, descripcionPermiso);
        if (response) {
          Swal.fire({
            title: '¡Exitoso!',
            text: '¡Color editada exitosamente!',
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
            text: '¡La color no pudo ser editada!',
            icon: 'error',
            timerProgressBar: true,
            timer: 1500,
            showConfirmButton: false,
          });
          setIsModalAgregar(false);
          setNombrePermiso('')
          setDescripcionPermiso('')
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
        setNombrePermiso('')
        setDescripcionPermiso('')
      }
    }
  };  

  const editarPeso = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (modalData?.id && modalData?.nombrePermiso && modalData?.descripcionPermiso) {
      try {
        const response = await EditarPermiso(modalData?.id,  modalData?.nombrePermiso, modalData?.descripcionPermiso); 
        if (response) {
          Swal.fire({
            title: '¡Exitoso!',
            text: '¡Color editada exitosamente!',
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
            text: '¡La color no pudo ser editada!',
            icon: 'error',
            timerProgressBar: true,
            timer: 1500,
            showConfirmButton: false,
          });
          setIsModalOpen(false);
          setNombrePermiso('')
          setDescripcionPermiso('')
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
        setNombrePermiso('')
        setDescripcionPermiso('')
      }
    }
  };

  const eliminarPermiso = async (identificador: string) => {
    if (identificador) {
      try {
        const response = await EliminarPermiso(identificador); 
        if (response) {
          Swal.fire({
            title: '¡Exitoso!',
            text: '¡Color eliminada exitosamente!',
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
            text: '¡La color no pudo ser eliminada!',
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

      <Table<DataRowPermiso> columns={columns} data={data} setRefreshData={() => {}}/>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Edit Modal"
        className="Modal"
        overlayClassName="Overlay"
      >
        <div className="ModalContentSinImagen">
          <h2>Editar</h2>
          <form className="formularioEditar" onSubmit={editarPeso}>
            <div>
              <label
                htmlFor="labelPermiso"
                className="labelPermiso"
              >
                Nombre
              </label>
              <input
                id="nombrePermisoEditar"
                type="string"
                name="nombrePermisoEditar"
                value={modalData?.nombrePermiso || ""}
                onChange={(e) => {
                if (modalData) {
                    setModalData({ ...modalData, nombrePermiso: e.target.value });
                }
                setNombrePermiso(e.target.value);
                }}
                className="inputEditarForm"
              />
                <label
                    htmlFor="labeldescripcion"
                    className="labeldescripcion"
                >
                    Descripcion
                </label>
                <input
                    id="descripcionPermiso"
                    type="string"
                    name="descripcionPermiso"
                    value={modalData?.descripcionPermiso || ""}
                    onChange={(e) => {
                    if (modalData) {
                        setModalData({ ...modalData, descripcionPermiso: e.target.value });
                    }
                    setDescripcionPermiso(e.target.value);
                    }}
                    className="inputEditarForm"
                />
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="submit"
              className="botonEditarModal"
            >
              Editar
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
        <div className="ModalContentSinImagen">
          <h2>Agregar</h2>
          <form
          className="formularioAgregar"
          onSubmit={agregarPeso}
          >
            <div>
                <label htmlFor="labelNombre" className="LabelModal">Nombre</label>
                <input
                    id="nombrePermisoAgregar"
                    type="string"
                    name="nombrePermisoAgregar"
                    value={nombrePermiso}
                    onChange={(e) => setNombrePermiso(e.target.value)}
                    className="inputEditarForm"
                />
                <label htmlFor="labelNombre" className="LabelModal">Descripcion</label>
                <input
                    id="descripcionPermisoAgregar"
                    type="string"
                    name="descripcionPermisoAgregar"
                    value={descripcionPermiso}
                    onChange={(e) => setDescripcionPermiso(e.target.value)}
                    className="inputEditarForm"
                />
            </div>
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
      </Modal>
    </div>
  );
};

export default DataTable;