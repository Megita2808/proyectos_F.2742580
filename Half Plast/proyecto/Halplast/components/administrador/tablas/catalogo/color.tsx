/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useState, useMemo, useRef } from "react"
import { Column } from "react-table";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Modal from "react-modal";
import Swal from 'sweetalert2';

import { DataRowColor } from '../tiposFilas/color';

import Table from '../tabla/formatoTabla';
import StatusBoton from './estado/estado';

import EditarColor from '@/service/api/catalogo/color/EditarColor';
import EliminarColor from '@/service/api/catalogo/color/EliminarColor';
import AgregarColor from '@/service/api/catalogo/color/AgregarColor';

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
  data: DataRowColor[];
  setRefreshData: React.Dispatch<React.SetStateAction<boolean>>;
}
const DataTable: React.FC<DataTableProps> = ({ data, setRefreshData }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [filters, setFilters] = useState<{ [key: string]: string }>({});

  const [activeColumn, setActiveColumn] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ModalAgregarAbrir, setIsModalAgregar] = useState(false);
  const [modalData, setModalData] = useState<{ id: string; name: string } | null>(null);

  const [color, setNombreColor] = useState<string>('');
  
  const columns: Column<DataRowColor>[] = useMemo(
    () => [
      { 
        Header: "ID", 
        accessor: "col1", 
        Cell: ({ value }) => <div style={{ textAlign: 'center' }}>{value}</div>, 
      },
      { 
        Header: "Nombre color", 
        accessor: "col2", 
        Cell: ({ value }) => <div style={{ textAlign: 'center' }}>{value}</div>, 
      },
      {
        Header: "Estado",
        accessor: "enabled",
        Cell: ({ value, row }) => (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <StatusBoton isEnabled={value} id={row.original.col3} modulo="color" disabled={false}/>
        </div>
        ),
      },
      {
        Header: "Editar",
        Cell: ({ row }) => (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <button className="" onClick={() => openModal(row.original.col3, row.original.col2)}>
              <Pencil className="h-6 w-6 hover:text-green-600" />
            </button>
          </div>
        ),
      },
      {
        Header: "Eliminar",
        Cell: ({ row }) => (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <button onClick={() => eliminarColor(row.original.col3)}>
              <Trash2 className="h-6 w-6 hover:text-red-600" />
            </button>
          </div>
        ),
      },
    ],
    []
  );

  const openModal = (id: string, name: string) => {
    setModalData({ id, name });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setNombreColor('');
    setIsModalOpen(false);
  };

  const abrirModalAgregar = () => {
    setIsModalAgregar(true);
  };

  const cerrarModalAgregar = () => {
    setNombreColor('');
    setIsModalAgregar(false);
  };

  const agregarColor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (color) {
      try {
        const response = await AgregarColor(color);
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
          setNombreColor('');
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
        setNombreColor('');
      }
    }
  };  

  const editarColor = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (modalData?.id) {
      const id = modalData?.id || ""
      try {
        const response = await EditarColor(color, id); 
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
          setNombreColor('');
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
        setNombreColor('');
      }
    }
  };

  const eliminarColor = async (identificador: string) => {
    if (identificador) {
      try {
        const response = await EliminarColor(identificador); 
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
      <button type="button" className="botonAgregado"  onClick={abrirModalAgregar}>Agregar color</button>
      
      <Table<DataRowColor> columns={columns} data={data} setRefreshData={() => {}}/>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Edit Modal"
        className="Modal"
        overlayClassName="Overlay"
      >
        <div className="ModalContentSinImagen">
          <h2>Editar Color</h2>
          <form className="formularioEditar" onSubmit={editarColor}>
            <div>
              <label
                htmlFor="categoryName"
                className="LabelModal"
              >
                Nombre del color
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
                  setNombreColor(e.target.value)
                }}
                className="inputEditarForm"
              />
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="submit"
              className="botonEditarModal"
            >
              Editar Color
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
          <h2>Agregar Color</h2>
          <form
          className="formularioAgregar"
          onSubmit={agregarColor}
          >
            <div>
              <label
                htmlFor="categoryName"
                className="LabelModal"
              >
                Nombre del color
              </label>
              <input
                id="categoryName"
                type="text"
                name="categoryName"
                value={color}
                onChange={(e) => {
                  setNombreColor(e.target.value)
                }}
                className="inputEditarForm"
              />
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="submit"
                className="botonEditarModal"
              >
                Agregar Color
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