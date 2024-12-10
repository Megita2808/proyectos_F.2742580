/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import { Column } from "react-table";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Modal from "react-modal";
import Swal from 'sweetalert2';
import { Pencil, Trash2 } from "lucide-react";

import { DataRowPrecioVenta } from '../../tiposFilas/precioVenta';
import Table from '../../tabla/formatoTabla';
import StatusBoton from '../../catalogo/estado/estado';

import EditarPrecioVenta from '@/service/api/precioVenta/EditarPrecioVenta';
import EliminarPrecioVenta from '@/service/api/precioVenta/EliminarPrecioVenta';
import AgregarPrecioVenta from '@/service/api/precioVenta/AgregarPrecioVenta';

import { getColores } from "@/service/api/catalogo/color/TodoColor";
import { getUnidadMedida } from "@/service/api/unidadMedida/TodoUnidadMedida";

Modal.setAppElement('#root');

declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: any) => void;
  }
}

interface DataTableProps {
  data: DataRowPrecioVenta[];
  setRefreshData: React.Dispatch<React.SetStateAction<boolean>>;
}

const DataTable: React.FC<DataTableProps> = ({ data, setRefreshData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ModalAgregarAbrir, setIsModalAgregar] = useState(false);

  const [modalData, setModalData] = useState<{ id: string; precioUnitario: number; nombreColorBase: string; nombreUnidadMedidaBase: string; idColorApi: string ,idUnidadMedidaApi: string } | null>(null);

  const [precioUnitario, setPrecioUnitario] = useState<number>(0);

  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedUnidadMedida, setSelectedUnidadMedida] = useState<string>('');

  const [datosColor, setDataColores] = useState<{ idColorApi: string; nombreColorApi: string }[]>([]);
  const [datosUnidadMedida, setDatosUnidadMedida] = useState<{ idUnidadMedida: string; nombreUnidadMedida: string }[]>([]);


  const fetchColores = useCallback(async () => {
    try {
      const colores = await getColores();
      const datosColores = colores.map((color) => ({
        idColorApi: color._id,
        nombreColorApi: color.nombreColor,
      }));
      setDataColores(datosColores);
    } catch (error) {
      console.error('Error al obtener los colores:', error);
    }
  }, []);

  const fetchUnidadesMedida = useCallback(async () => {
    try {
      const unidadesMedida = await getUnidadMedida();
      const datosUnidades = unidadesMedida.map((unidad) => ({
        idUnidadMedida: unidad._id,
        nombreUnidadMedida: unidad.simbolo,
      }));
      setDatosUnidadMedida(datosUnidades);
    } catch (error) {
      console.error('Error al obtener las unidades de medida:', error);
    }
  }, []);

  useEffect(() => {
    fetchColores();
    fetchUnidadesMedida();
  }, [fetchColores, fetchUnidadesMedida]);

  const columns: Column<DataRowPrecioVenta>[] = useMemo(
    () => [
      { 
        Header: "ID", 
        accessor: "col1", 
        Cell: ({ value }) => <div style={{ textAlign: 'center' }}>{value}</div>, 
      },
      { 
        Header: "Color", 
        accessor: "col4", 
        Cell: ({ value }) => <div style={{ textAlign: 'center' }}>{value}</div>, 
      },
      { 
        Header: "Precio unitario", 
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
            <StatusBoton isEnabled={value} id={row.original.col3} modulo="precioVenta" disabled={false} />
          </div>
        ),
      },
      {
        Header: "Editar",
        Cell: ({ row }) => (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <button onClick={() => openModal(row.original.col3, row.original.col2, row.original.col7, row.original.col6, row.original.col4, row.original.col5)}>
              <Pencil className="h-6 w-6 hover:text-green-600" />
            </button>
          </div>
        ),
      },
      {
        Header: "Eliminar",
        Cell: ({ row }) => (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <button onClick={() => eliminarPrecioVenta(row.original.col3)}>
              <Trash2 className="h-6 w-6 hover:text-red-600" />
            </button>
          </div>
        ),
      },
    ],
    [setRefreshData]
  );

  const handleChangeColor = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedColor(e.target.value);
  };

  const handleChangeUnidadMedida = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedUnidadMedida(e.target.value);
  };

  const openModal = async (id: string, precioUnitarioFuc: number, idUnidadMedida: string, idColor: string, nombreColor: string, nombreUnidadMedida: string,) => {
    setModalData({
      id,
      precioUnitario: precioUnitarioFuc,
      idColorApi: idColor,
      idUnidadMedidaApi: idUnidadMedida,
      nombreColorBase: nombreColor,
      nombreUnidadMedidaBase: nombreUnidadMedida,
    });
    setSelectedColor(idColor); 
    setSelectedUnidadMedida(idUnidadMedida); 
  
    setIsModalOpen(true);
  };

  const closeModal = useCallback(() => {
    setSelectedColor('');
    setSelectedUnidadMedida('');
    setIsModalOpen(false);
  }, []);

  const abrirModalAgregar = useCallback(() => {
    setPrecioUnitario(0);
    setIsModalAgregar(true);
  }, []);

  const cerrarModalAgregar = useCallback(() => {
    setSelectedColor('');
    setSelectedUnidadMedida('');
    setIsModalAgregar(false);
  }, []);

  const agregarPrecioVenta = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (precioUnitario && selectedUnidadMedida && selectedColor) {
      try {
        const response = await AgregarPrecioVenta(modalData?.precioUnitario ?? precioUnitario, selectedUnidadMedida, selectedColor);
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
  }, [precioUnitario, selectedUnidadMedida, selectedColor, cerrarModalAgregar, setRefreshData]);

  const editarPrecioVenta = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (modalData?.precioUnitario && selectedUnidadMedida && selectedColor && modalData?.id) {
      try {
        const response = await EditarPrecioVenta(modalData?.id, modalData?.precioUnitario, selectedUnidadMedida, selectedColor);
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
  }, [precioUnitario, selectedUnidadMedida, selectedColor, modalData, closeModal, setRefreshData]);

  const eliminarPrecioVenta = useCallback(async (identificador: string) => {
    try {
      if (!identificador) {
        throw new Error('Identificador no válido');
      }

      const response = await EliminarPrecioVenta(identificador);

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
    <>
      <div style={{ padding: "20px" }}>
        <button className="botonAgregado" onClick={abrirModalAgregar}>
          Agregar precio
        </button>
        
        <Table<DataRowPrecioVenta> columns={columns} data={data} setRefreshData={() => {}} />

        <Modal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          contentLabel="Edit Modal"
          className="Modal"
          overlayClassName="Overlay"
        >
          <div className="ModalContentSinImagen">
            <h2>Editar Producto</h2>
            <form
              className="formularioEditar"
              onSubmit={editarPrecioVenta}
            >
              <div>
                <label htmlFor="precioUnitario" className="LabelModal">Precio Unitario</label>
                <input
                  id="precioUnitario"
                  type="number"
                  name="precioUnitario"
                  value={modalData?.precioUnitario}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value);
                    if (modalData) {
                      setModalData({ ...modalData, precioUnitario: value });
                    }
                    setPrecioUnitario(value);
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
                      {modalData.nombreUnidadMedidaBase}
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

              <div>
                <label htmlFor="color" className="LabelModal">Color</label>
                <select
                  id="color"
                  className="selectModal"
                  value={selectedColor}
                  onChange={handleChangeColor}
                >
                  {modalData && (
                    <option value={modalData.idColorApi}>
                      {modalData.nombreColorBase}
                    </option>
                  )}
                  {datosColor
                    .filter((color) => color.idColorApi !== modalData?.nombreColorBase)
                    .map((color) => (
                      <option key={color.idColorApi} value={color.idColorApi}>
                        {color.nombreColorApi}
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
          contentLabel="Agregar Modal"
          className="Modal"
          overlayClassName="Overlay"
        >
          <div className="ModalContentSinImagen">
            <h2>Agregar Producto</h2>
            <form
              className="formularioAgregar"
              onSubmit={agregarPrecioVenta}
            >
              <div>
                <label htmlFor="precioUnitario" className="LabelModal">Precio Unitario</label>
                <input
                  id="precioUnitario"
                  type="number"
                  name="precioUnitario"
                  value={precioUnitario ?? 0}
                  onChange={(e) => setPrecioUnitario(parseFloat(e.target.value))}
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

              <div>
                <label htmlFor="color" className="LabelModal">Color</label>
                <select
                  id="color"
                  className="selectModal"
                  value={selectedColor}
                  onChange={handleChangeColor}
                >
                  <option value="">Selecciona un color</option>
                  {datosColor.map((color) => (
                    <option key={color.idColorApi} value={color.idColorApi}>
                      {color.nombreColorApi}
                    </option>
                  ))}
                </select>
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
