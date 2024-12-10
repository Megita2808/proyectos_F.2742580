/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import { Column } from "react-table";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Modal from "react-modal";
import Swal from 'sweetalert2';

import { DataRowPeso } from '../tiposFilas/peso';

import Table from '../tabla/formatoTabla';
import StatusBoton from './estado/estado';

import EditarPeso from '@/service/api/catalogo/peso/EditarPeso';
import EliminarPeso from '@/service/api/catalogo/peso/EliminarPeso';
import AgregarPeso from '@/service/api/catalogo/peso/AgregaPeso';
 
import { getUnidadMedidaTipo } from "@/service/api/unidadMedida/TipoUnidadMedida";

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
  data: DataRowPeso[];
  setRefreshData: React.Dispatch<React.SetStateAction<boolean>>;
}

const DataTable: React.FC<DataTableProps> = ({ data, setRefreshData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ModalAgregarAbrir, setIsModalAgregar] = useState(false);
  const [modalData, setModalData] = useState<{ id: string; PesoNumero: number; nombreUnidadMedida: string; idUnidadMedidaApi: string } | null>(null);

  const [selectedUnidadMedida, setSelectedUnidadMedida] = useState<string>('');

  const [pesoNumero, setPesoNumero] = useState<number>(0);
  const [datosUnidadMedida, setDatosUnidadMedida] = useState<{ idUnidadMedida: string; nombreUnidadMedida: string}[]>([]);

  const fetchUnidadesMedida = useCallback(async () => {
    try {
      const unidadesMedida = await getUnidadMedidaTipo("peso");
      const datosUnidades = unidadesMedida.map((unidad) => ({
        idUnidadMedida: unidad._id,
        nombreUnidadMedida: unidad.nombre,
        simboloUnidadMedida: unidad.simbolo 
      }));
      setDatosUnidadMedida(datosUnidades);
    } catch (error) {
      console.error('Error al obtener las unidades de medida:', error);
    }
  }, []);

  useEffect(() => {
    fetchUnidadesMedida();
  }, [fetchUnidadesMedida]);


  const columns: Column<DataRowPeso>[] = useMemo(
    () => [
      { 
        Header: "ID", 
        accessor: "col1", 
        Cell: ({ value }) => <div style={{ textAlign: 'center' }}>{value}</div>, 
      },
      { 
        Header: "Peso", 
        accessor: "col2", 
        Cell: ({ value }) => <div style={{ textAlign: 'center' }}>{value}</div>, 
      },
      { 
        Header: "Unidad de medida", 
        accessor: "col5", 
        Cell: ({ value }) => <div style={{ textAlign: 'center' }}>{value}</div>, 
      },
      {
        Header: "Estado",
        accessor: "enabled",
        Cell: ({ value, row }) => (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <StatusBoton isEnabled={value} id={row.original.col3} modulo="peso" disabled={false}/>
          </div>
        ),
      },
      {
        Header: "Editar",
        Cell: ({ row }) => (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <button className="" onClick={() => openModal(row.original.col3, row.original.col2, row.original.col6, row.original.col5)}>
              <Pencil className="h-6 w-6 hover:text-green-600" />
            </button>
          </div>
        ),
      },
      {
        Header: "Eliminar",
        Cell: ({ row }) => (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <button onClick={() => eliminarPeso(row.original.col3)}>
              <Trash2 className="h-6 w-6 hover:text-red-600" />
            </button>
          </div>
        ),
      },
    ],
    []
  );

  const handleChangeUnidadMedida = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedUnidadMedida(e.target.value);
  };

  const openModal = (id: string, PesoNumero: number, idUnidadMedidaApi: string, nombreUnidadMedida: string) => {
    setModalData({ id, PesoNumero, nombreUnidadMedida, idUnidadMedidaApi });
    setSelectedUnidadMedida(idUnidadMedidaApi)
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setPesoNumero(0);
    setIsModalOpen(false);
  };

  const abrirModalAgregar = () => {
    setIsModalAgregar(true);
  };

  const cerrarModalAgregar = () => {
    setPesoNumero(0);
    setIsModalAgregar(false);
  };

  const agregarPeso = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pesoNumero) {
      try {
        const response = await AgregarPeso(pesoNumero, selectedUnidadMedida);
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
          setPesoNumero(0);
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
        setPesoNumero(0);
      }
    }
  };  

  const editarPeso = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (modalData?.id ) {
      const id = modalData?.id || ""
      try {
        let pesoNumeros
        if (pesoNumero == undefined || pesoNumero == 0) {
          pesoNumeros = modalData?.PesoNumero;
        }else {
          pesoNumeros = pesoNumero
        }
        const response = await EditarPeso(pesoNumeros, id, selectedUnidadMedida); 
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
          setPesoNumero(0);
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
        setPesoNumero(0);
      }
    }
  };

  const eliminarPeso = async (identificador: string) => {
    if (identificador) {
      try {
        const response = await EliminarPeso(identificador); 
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
      <button type="button" className="botonAgregado"  onClick={abrirModalAgregar}>Agregar peso</button>
      
      <Table<DataRowPeso> columns={columns} data={data} setRefreshData={() => {}}/>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Edit Modal"
        className="Modal"
        overlayClassName="Overlay"
      >
        <div className="ModalContentSinImagen">
          <h2>Editar Peso</h2>
          <form className="formularioEditar" onSubmit={editarPeso}>
            <div>
              <label
                htmlFor="categoryName"
                className="labelModalNombre"
              >
                Peso
              </label>
              <input
                id="categoryName"
                type="number"
                name="categoryName"
                value={modalData?.PesoNumero || ""}
                onChange={(e) => {
                  const value = parseFloat(e.target.value);
                  if (modalData) {
                    setModalData({ ...modalData, PesoNumero: value });
                  }
                  setPesoNumero(value);
                }}
                className="inputEditarForm"
              />
            </div>
            <div>
              <label htmlFor="unidadMedida" className="LabelModal">Unidad de Medida</label>
              <select
                id="unidadMedida"
                className="selectModal"
                value={selectedUnidadMedida}
                onChange={handleChangeUnidadMedida}
              >
                {modalData && (
                  <option value={modalData.idUnidadMedidaApi}>
                    {modalData.nombreUnidadMedida}
                  </option>
                )}
                {datosUnidadMedida
                  .filter((unidad) => unidad.idUnidadMedida !== modalData?.idUnidadMedidaApi)
                  .map((unidad) => (
                    <option key={unidad.idUnidadMedida} value={unidad.idUnidadMedida}>
                      {unidad.nombreUnidadMedida}
                    </option>
                  ))
                }
              </select>
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
          <h2>Agregar peso</h2>
          <form
          className="formularioAgregar"
          onSubmit={agregarPeso}
          >
            <div>
              <label htmlFor="categoryName" className="LabelModal">Peso</label>
              <input
                id="categoryName"
                type="number"
                name="categoryName"
                value={pesoNumero}
                onChange={(e) => setPesoNumero(parseFloat(e.target.value))}
                className="inputEditarForm"
              />
            </div>
            <div>
              <label htmlFor="unidadMedida" className="LabelModal">Unidad de Medida</label>
              <select
                id="unidadMedida"
                className="selectModal"
                value={selectedUnidadMedida}
                onChange={handleChangeUnidadMedida}
              >
                <option value="">Selecciona una unidad de medida</option>
                {datosUnidadMedida.map((unidad) => (
                  <option key={unidad.idUnidadMedida} value={unidad.idUnidadMedida}>
                    {unidad.nombreUnidadMedida}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="submit"
                className="botonEditarModal"
              >
                Agregar Peso
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