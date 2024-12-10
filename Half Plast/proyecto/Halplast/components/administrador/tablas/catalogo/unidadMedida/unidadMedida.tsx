/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useState, useMemo} from "react"
import {Column} from "react-table";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Modal from "react-modal";
import Swal from 'sweetalert2';
import Table from '../../tabla/formatoTabla';

import EditarUnidadMedida from '@/service/api/unidadMedida/EditarUnidadMedida';
import EliminarUnidadMedida from '@/service/api/unidadMedida/EliminarUnidadMedida';
import AgregarUnidadMedida from '@/service/api/unidadMedida/AgregarUnidadMedida';

import { DataRowUnidadMedida } from '../../tiposFilas/unidadMedida';

import StatusBoton from '../estado/estado';

import {
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
  data: DataRowUnidadMedida[];
  setRefreshData: React.Dispatch<React.SetStateAction<boolean>>;
}

const DataTable: React.FC<DataTableProps> = ({ data, setRefreshData }) => {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ModalAgregarAbrir, setIsModalAgregar] = useState(false);

  const [nombreUnidad, setNombreUnidad] = useState<string>("");
  const [simbolo, setSimbolo] = useState<string>("");
  const [tipo, setTipo] = useState<string>("");
  const [modalData, setModalData] = useState<any>(null);

  const columns: Column<DataRowUnidadMedida>[] = useMemo(
    () => [
      { 
        Header: "ID", 
        accessor: "col1", 
        Cell: ({ value }) => <div style={{ textAlign: 'center' }}>{value}</div>, 
      },
      { 
        Header: "Nombre unidad de medida", 
        accessor: "col2", 
        Cell: ({ value }) => <div style={{ textAlign: 'center' }}>{value}</div>, 
      },
      { 
        Header: "Simbolo", 
        accessor: "col4", 
        Cell: ({ value }) => <div style={{ textAlign: 'center' }}>{value}</div>, 
      },
      { 
        Header: "Tipo", 
        accessor: "col5", 
        Cell: ({ value }) => <div style={{ textAlign: 'center' }}>{value}</div>, 
      },
    ],
    []
  );

  const openModal = (id: string, nombre: string, simbolo: string, tipo: string ) => {
    setModalData({ id, nombre, simbolo, tipo });
    setIsModalOpen(true);
  };
  
  const limpiarDato = () => {
    setNombreUnidad('');
    setSimbolo('');
    setTipo('');
  }

  const closeModal = () => {
    limpiarDato()
    setIsModalOpen(false);
  };

  const abrirModalAgregar = () => {
    setIsModalAgregar(true);
  };

  const cerrarModalAgregar = () => {
    limpiarDato()
    setIsModalAgregar(false);
  };

  const agregarUnidadMedida = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (nombreUnidad && simbolo && tipo) {
      try {
        const response = await AgregarUnidadMedida(nombreUnidad, simbolo, tipo);
        Swal.fire({
          title: response ? '¡Exitoso!' : '¡Error!',
          text: response ? 'Unidad de medida agregada exitosamente!' : '¡La unidad de medida no pudo ser agregada!',
          icon: response ? 'success' : 'error',
          timerProgressBar: true,
          timer: 1500,
          showConfirmButton: false,
        });
        if (response) {
          cerrarModalAgregar();
          setRefreshData(true);
          limpiarDato()
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
        cerrarModalAgregar();
      }
    } else {
      Swal.fire({
        title: '¡Error!',
        text: '¡Todos los campos son obligatorios!',
        icon: 'error',
        timerProgressBar: true,
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };

  const editarUnidadMedida = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (modalData?.nombre && modalData?.id && modalData?.simbolo && modalData?.tipo) {
      const { nombre, id, simbolo, tipo } = modalData;
      
      try {
        const response = await EditarUnidadMedida(nombre, id, simbolo, tipo);
        Swal.fire({
          title: response ? '¡Exitoso!' : '¡Error!',
          text: response ? 'Unidad de medida editada exitosamente!' : '¡La unidad de medida no pudo ser editada!',
          icon: response ? 'success' : 'error',
          timerProgressBar: true,
          timer: 1500,
          showConfirmButton: false,
        });
  
        if (response) {
          closeModal();
          setRefreshData(true);
          setModalData(null);
        } else {
          setModalData({ ...modalData, nombre: '' });
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
        closeModal();
      }
    } else {
      Swal.fire({
        title: '¡Error!',
        text: '¡Todos los campos son obligatorios!',
        icon: 'error',
        timerProgressBar: true,
        timer: 1500,
        showConfirmButton: false,
      });
      limpiarDato()
    }
  };

  const eliminarUnidadMedida = async (identificador: string) => {
    if (identificador) {
      try {
        const response = await EliminarUnidadMedida(identificador); 
        Swal.fire({
          title: response ? '¡Exitoso!' : '¡Error!',
          text: response ? 'Unidad de medida eliminado exitosamente!' : '¡La unidad de medida no pudo ser eliminado!',
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
      
      <Table<DataRowUnidadMedida> columns={columns} data={data} setRefreshData={() => {}}/>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Edit Modal"
        className="Modal"
        overlayClassName="Overlay"
      >
        <div className="ModalContentSinImagen">
          <h2>Editar Unidad de Medida</h2>
          <form
            className="formularioEditar"
            onSubmit={editarUnidadMedida}
          >
            <div>
              <label
                htmlFor="nombreUnidad"
                className="LabelModal"
              >
                Nombre de la Unidad
              </label>
              <input
                id="nombreUnidad"
                type="text"
                name="nombreUnidad"
                value={modalData?.nombre || ""}
                onChange={(e) => {
                  setModalData({ ...modalData, nombre: e.target.value });
                }}
                className="inputEditarForm"
              />
              <label
                htmlFor="nombreUnidad"
                className="LabelModal"
              >
                Simbolo
              </label>
              <input
                id="nombreUnidad"
                type="text"
                name="nombreUnidad"
                value={modalData?.simbolo || ""}
                onChange={(e) => {
                  setModalData({ ...modalData, simbolo: e.target.value });
                }}
                className="inputEditarForm"
              />
              <label
                htmlFor="nombreUnidad"
                className="LabelModal"
              >
                Tipo
              </label>
              <input
                id="nombreUnidad"
                type="text"
                name="nombreUnidad"
                value={modalData?.tipo || ""}
                onChange={(e) => {
                  setModalData({ ...modalData, tipo: e.target.value });
                }}
                className="inputEditarForm"
              />
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="submit"
                className="botonEditarModal"
              >
                Editar Unidad
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
        contentLabel="Add Modal"
        className="Modal"
        overlayClassName="Overlay"
      >
        <div className="ModalContentSinImagen">
          <h2>Agregar Unidad de Medida</h2>
          <form
            className="formularioAgregar"
            onSubmit={agregarUnidadMedida}
          >
            <div>
              <label
                htmlFor="nombreUnidad"
                className="LabelModal"
              >
                Nombre de la Unidad
              </label>
              <input
                id="nombreUnidad"
                type="text"
                name="nombreUnidad"
                value={nombreUnidad}
                onChange={(e) => setNombreUnidad(e.target.value)}
                className="inputEditarForm"
              />
              <label
                htmlFor="nombreUnidad"
                className="LabelModal"
              >
                Simbolo
              </label>
              <input
                id="nombreUnidad"
                type="text"
                name="nombreUnidad"
                value={simbolo}
                onChange={(e) => setSimbolo(e.target.value)}
                className="inputEditarForm"
              />
              <label
                htmlFor="nombreUnidad"
                className="LabelModal"
              >
                Tipo
              </label>
              <input
                id="nombreUnidad"
                type="text"
                name="nombreUnidad"
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
                className="inputEditarForm"
              />
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="submit"
                className="botonEditarModal"
              >
                Agregar Unidad
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