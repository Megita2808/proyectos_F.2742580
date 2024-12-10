/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Column } from "react-table";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Modal from "react-modal";
import Swal from 'sweetalert2';

import { DataRowRol, DatoPermiso } from '../../../tiposFilas/rol';

import Table from '../../../tabla/formatoTabla';
import StatusBoton from '../../../catalogo/estado/estado';

import EditarRol from '@/service/api/configuracion/rol/EditarRol';
import EliminarRol from '@/service/api/configuracion/rol/EliminarRol';
import AgregarRol from '@/service/api/configuracion/rol/AgregaRol';

import { getPermisos } from "@/service/api/configuracion/permiso/TodoPermiso";

import {
  Pencil,
  Trash2,
  Eye,
  SquareX
} from "lucide-react";

Modal.setAppElement('#root');

declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: any) => void;
  }
}

interface DataTableProps {
  data: DataRowRol[];
  setRefreshData: React.Dispatch<React.SetStateAction<boolean>>;
}

const DataTable: React.FC<DataTableProps> = ({ data, setRefreshData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalVisualizar, setIsModalVisualizar] = useState(false);
  const [ModalAgregarAbrir, setIsModalAgregar] = useState(false);
  const [modalData, setModalData] = useState<{ id: string; NombreRol: string; ExtraPorcentaje: number; ListaPermisos: DatoPermiso[];} | null>(null);
  
  const [NombreRol, setNombreRol] = useState<string>('');
  const [ExtraPorcentaje, setExtraPorcentaje] = useState<number>(0);
  const [ListaPermisos, setPermisos] = useState<DatoPermiso[]>([]);
  const [allPermisos, setAllPermisos] = useState<DatoPermiso[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const[ permisosPerPage] = useState(5); 
  const [perPage] = useState(3);

  const permisosEnPaginaActual = ListaPermisos.slice((currentPage - 1) * perPage, currentPage * perPage);
  const numColumns = Math.min(permisosEnPaginaActual.length, 3);

  const indexOfLastPermiso1 = currentPage * perPage;
  const indexOfFirstPermiso1 = indexOfLastPermiso1 - perPage;

  const currentPermisos1 = ListaPermisos.slice(indexOfFirstPermiso1, indexOfLastPermiso1);
  const totalPages = Math.ceil(ListaPermisos.length / perPage);

  const indexOfLastPermiso2 = currentPage * permisosPerPage;
  const indexOfFirstPermiso2= indexOfLastPermiso2 - permisosPerPage;

  const currentPermisos = allPermisos.slice(indexOfFirstPermiso2, indexOfLastPermiso2);
  const totalPagesTodo = Math.ceil(allPermisos.length / permisosPerPage);

  const columns: Column<DataRowRol>[] = useMemo(
    () => [
      { 
        Header: "ID", 
        accessor: "col1", 
        Cell: ({ value }) => <div style={{ textAlign: 'center' }}>{value}</div>, 
      },
      { 
        Header: "Nombre", 
        accessor: "nombreRol", 
        Cell: ({ value }) => <div style={{ textAlign: 'center' }}>{value}</div>, 
      },
      {
        Header: "Visualizar Permisos",
        Cell: ({ row }) => (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <button onClick={() => abrirModalVisualizar(row.original.permisos)}>
              <Eye className="h-6 w-6 hover:text-blue-600" />
            </button>
          </div>
        ),
      },
      {
        Header: "Estado",
        accessor: "enabled",
        Cell: ({ value, row }) => (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <StatusBoton isEnabled={value} id={row.original.identificador} modulo="rol" disabled={false}/>
          </div>
        ),
      },
      {
        Header: "Editar",
        Cell: ({ row }) => (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <button onClick={() => openModal(row.original)}>
              <Pencil className="h-6 w-6 hover:text-green-600" />
            </button>
          </div>
        ),
      },
      {
        Header: "Eliminar",
        Cell: ({ row }) => (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <button onClick={() => eliminarRol(row.original.identificador)}>
              <Trash2 className="h-6 w-6 hover:text-red-600" />
            </button>
          </div>
        ),
      }
    ],
    []
  );

  const openModal = (rolData: DataRowRol) => {
    setModalData({
      id: rolData.identificador,
      NombreRol: rolData.nombreRol,
      ExtraPorcentaje: rolData.extraPorcentaje,
      ListaPermisos: rolData.permisos,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setNombreRol('');
    setExtraPorcentaje(0);
    setPermisos([]);
    setIsModalOpen(false);
  };

  const cerrarModalVisualizar = () => {
    setNombreRol('');
    setExtraPorcentaje(0);
    setPermisos([]);
    setIsModalVisualizar(false);
  };

  const abrirModalAgregar = () => {
    setIsModalAgregar(true);
  };

  const cerrarModalAgregar = () => {
    setNombreRol('');
    setExtraPorcentaje(0);
    setPermisos([]);
    setIsModalAgregar(false);
  };

  const abrirModalVisualizar = async (datosPermisos: DatoPermiso[]) => {
    setPermisos(datosPermisos)
    setCurrentPage(1);
    setIsModalVisualizar(true);
  };

  const eliminarRol = async (identificador: string) => {
    if (identificador) {
      try {
        const response = await EliminarRol(identificador); 
        if (response) {
          Swal.fire({
            title: '¡Exitoso!',
            text: '¡Rol eliminado exitosamente!',
            icon: 'success',
            timerProgressBar: true,
            timer: 1500,
            showConfirmButton: false,
          });
          setRefreshData(true); 
        } else {
          Swal.fire({
            title: '¡Error!',
            text: '¡El rol no pudo ser eliminado!',
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
    } else {
      Swal.fire({
        title: '¡Error!',
        text: '¡El identificador no se reconoce!',
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
        rowData[2] = "Habilitado"; 
      } else {
        rowData[2] = "Inhabilitado";
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

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleNextPage2 = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPagesTodo));
  };

  const handlePermisoClick = (permiso: DatoPermiso) => {
    const isSelected = ListaPermisos.some((p) => p._id === permiso._id);
    if (isSelected) {
      setPermisos((prev) => prev.filter((p) => p._id !== permiso._id));
    } else {
      setPermisos((prev) => [...prev, permiso]);
    }
  };

  useEffect(() => {
    const fetchPermisos = async () => {
      const permisos = await getPermisos();
      setAllPermisos(permisos);
    };
    fetchPermisos();
  }, []); 

  useEffect(() => {
    if (modalData?.ListaPermisos) {
      setPermisos(modalData.ListaPermisos);
    }
  }, [modalData]);
  
  return (
    <div style={{ padding: "20px" }}>
      <button type="button" className="botonAgregado"  onClick={abrirModalAgregar}>Agregar</button>

      <Table<DataRowRol> columns={columns} data={data} setRefreshData={() => {}}/>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Edit Modal"
        className="ModalDashboard"
        overlayClassName="Overlay"
      >
        <div className="ModalDashboard">
          <div className="ModalContentSinImagen" style={{maxHeight:'200px'}}>
            <form className="formularioAgregar" 
              onSubmit={async (e) => {
                e.preventDefault();

                const response = await EditarRol(modalData!.id, modalData!.NombreRol !== NombreRol ? modalData!.NombreRol : NombreRol , modalData!.ExtraPorcentaje !== ExtraPorcentaje ? modalData!.ExtraPorcentaje : ExtraPorcentaje , modalData!.ListaPermisos !== ListaPermisos ? ListaPermisos : modalData!.ListaPermisos); 
                if (response) {
                  Swal.fire({
                    title: '¡Exitoso!',
                    text: '¡Rol actualizado exitosamente!',
                    icon: 'success',
                    timerProgressBar: true,
                    timer: 1500,
                    showConfirmButton: false,
                  });
                  setRefreshData(true); 
                  closeModal();
                } else {
                  Swal.fire({
                    title: '¡Error!',
                    text: '¡El rol no pudo ser actualizado!',
                    icon: 'error',
                    timerProgressBar: true,
                    timer: 1500,
                    showConfirmButton: false,
                  });
                }
              }}>
              <div>
                <h2 className="titleSinFondoModal">Editar</h2>
                <label htmlFor="nombreRol" className="LabelModal">Nombre</label>
                <input
                  id="nombreRol"
                  value={modalData?.NombreRol || NombreRol}
                  onChange={(e) => {
                    if (modalData) {
                      setModalData({ ...modalData, NombreRol: e.target.value });
                    }
                    setNombreRol(e.target.value)
                  }}
                  className="inputEditarForm"
                />
                {/* <label htmlFor="extraPorcentaje" className="LabelModal">Porcentaje Extra:</label>
                <input
                  id="extraPorcentaje"
                  type="number"
                  value={modalData?.ExtraPorcentaje || ExtraPorcentaje}
                  onChange={(e) => {
                    if (modalData) {
                      setModalData({ ...modalData, ExtraPorcentaje: Number(e.target.value) });
                    }
                    setExtraPorcentaje(Number(e.target.value))}
                  }
                  className="inputEditarForm"
                /> */}
                  <div style={{ display: 'flex', gap: '10px', marginTop:'10px' }}>
                    <button type="submit" className="botonEditarModal">
                    Actualizar
                    </button>
                    <button type="button" onClick={closeModal} className="CerrarModalBotonGeneral">
                      Cerrar
                    </button>
                  </div>
              </div>
            </form>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px', width: '400px' }}>
            <div style={{ background: 'white', padding: '20px', borderRadius: '7px', width: '100%' , maxWidth:'400px' }}>
              <h3 style={{ textAlign: 'center', marginTop: '10px', marginBottom: '20px' }} className="titleSinFondoModal">
                Permisos
              </h3>
              <div style={{ padding: '10px', gap: '10px' }}>
                {currentPermisos.map((permiso) => (
                  <div
                    key={permiso._id}
                    onClick={() => handlePermisoClick(permiso)}
                    className={`permiso-item ${ListaPermisos.some((p) => p._id === permiso._id) ? 'selected' : ''}`}
                    style={{
                      cursor: 'pointer',
                      padding: '10px',
                      marginBottom: '10px',
                      border: '1px solid #ccc',
                      borderRadius: '7px',
                      backgroundColor: ListaPermisos.some((p) => p._id === permiso._id) ? '#007bff' : 'white',
                      color: ListaPermisos.some((p) => p._id === permiso._id) ? 'white' : 'black',
                    }}
                  >
                    {permiso.nombrePermiso}: {permiso.descripcionPermiso}
                  </div>
                ))}
                {allPermisos.length > 5 && (
                  <div className="pagination" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                    <button onClick={handlePrevPage} disabled={currentPage === 1}>
                      Anterior
                    </button>
                    <span style={{ alignSelf: 'center' }}>
                      {currentPage} de {totalPagesTodo}
                    </span>
                    <button onClick={handleNextPage2} disabled={currentPage === totalPages}>
                      Siguiente
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </Modal>

      <Modal
        isOpen={ModalAgregarAbrir}
        onRequestClose={cerrarModalAgregar}
        contentLabel="Agregar Rol"
        className="ModalDashboard"
        overlayClassName="Overlay"
      >
        <div className="ModalDashboard">
          <div className="ModalContentSinImagen" style={{maxHeight:'200px'}}>
            <form className="formularioAgregar" onSubmit={async (e) => {
                e.preventDefault();
                const response = await AgregarRol(NombreRol, ExtraPorcentaje, ListaPermisos); 
                if (response) {
                  Swal.fire({
                    title: '¡Exitoso!',
                    text: '¡Rol agregado exitosamente!',
                    icon: 'success',
                    timerProgressBar: true,
                    timer: 1500,
                    showConfirmButton: false,
                  });
                  setRefreshData(true); 
                  cerrarModalAgregar();
                } else {
                  Swal.fire({
                    title: '¡Error!',
                    text: '¡El rol no pudo ser agregado!',
                    icon: 'error',
                    timerProgressBar: true,
                    timer: 1500,
                    showConfirmButton: false,
                  });
                }
              }}>
              <div>
                <h2 className="titleSinFondoModal">Agregar</h2>
                <label htmlFor="nombreRol" className="LabelModal">Nombre</label>
                <input
                  id="nombreRol"
                  value={NombreRol}
                  onChange={(e) => setNombreRol(e.target.value)}
                  className="inputEditarForm"
                />
                {/* <label htmlFor="extraPorcentaje" className="LabelModal">Porcentaje Extra:</label>
                <input
                  id="extraPorcentaje"
                  type="number"
                  value={ExtraPorcentaje}
                  onChange={(e) => setExtraPorcentaje(Number(e.target.value))}
                  className="inputEditarForm"
                /> */}
                  <div style={{ display: 'flex', gap: '10px', marginTop:'10px' }}>
                    <button type="submit" className="botonEditarModal">
                    Agregar
                    </button>
                    <button type="button" onClick={cerrarModalAgregar} className="CerrarModalBotonGeneral">
                      Cerrar
                    </button>
                  </div>
                </div>
            </form>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px', maxWidth: '400px' }}>
            <div style={{ background: 'white', padding: '20px', borderRadius: '7px', width: '100%' }}>
              <h3 style={{ textAlign: 'center', marginTop: '10px', marginBottom: '20px' }} className="titleSinFondoModal">
                Permisos
              </h3>
              <div style={{ padding: '10px', gap: '10px' }}>
                {currentPermisos.map((permiso) => (
                  <div
                    key={permiso._id}
                    onClick={() => handlePermisoClick(permiso)}
                    className={`permiso-item ${ListaPermisos.some((p) => p._id === permiso._id) ? 'selected' : ''}`}
                    style={{
                      cursor: 'pointer',
                      padding: '10px',
                      marginBottom: '10px',
                      border: '1px solid #ccc',
                      borderRadius: '7px',
                      backgroundColor: ListaPermisos.some((p) => p._id === permiso._id) ? '#007bff' : 'white',
                      color: ListaPermisos.some((p) => p._id === permiso._id) ? 'white' : 'black',
                    }}
                  >
                    {permiso.nombrePermiso}: {permiso.descripcionPermiso}
                  </div>  
                ))}
                {allPermisos.length > 5 && 
                  <>
                  <div className="pagination" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                    <button onClick={handlePrevPage} disabled={currentPage === 1}>
                      Anterior
                    </button>
                    <span style={{ alignSelf: 'center' }}>{currentPage} de {totalPagesTodo}</span>
                    <button onClick={handleNextPage2} disabled={currentPage === totalPagesTodo}>
                      Siguiente
                    </button>
                  </div>
                  </>
                }
              </div>
            </div>
          </div>

        </div>
      </Modal>

      <Modal
        isOpen={isModalVisualizar}
        onRequestClose={cerrarModalVisualizar}
        contentLabel="Visualizar Permisos"
        className="ModalRoles"
        overlayClassName="Overlay"
      >
        <div className="ModalContentRoles">

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 className="titleSinFondoModal"><strong>Permisos Activos</strong></h2>
            <button 
              onClick={cerrarModalVisualizar} 
              style={{ 
                position:'relative',
                left: '250px',
                top: '-8px',
                background: 'none', 
                border: 'none', 
                cursor: 'pointer'
              }}
            >
              <SquareX className="h-6 w-6 hover:text-red-600" />
            </button>
          </div>

          <div
            className="grid gap-4"
            style={{ gridTemplateColumns: `repeat(${numColumns}, minmax(200px, 1fr))` }}
          >
            {currentPermisos1.map(permiso => (
              <div key={permiso._id} className="border p-2 rounded">
                  <strong>{permiso.nombrePermiso}</strong>
                  <p>{permiso.descripcionPermiso}</p>
              </div>
            ))}
          </div>

            {ListaPermisos.length > perPage && (
              <div className="pagination-container">
                <button
                onClick={handlePrevPage}
                  className={`pagination-button ${currentPage === 1 ? 'active' : ''}`}
                  disabled={currentPage === 1}
                >
                  Anterior
                </button>
                <span>Página {currentPage}</span>
                <button
                  onClick={handleNextPage}
                  className={`pagination-button ${currentPage === 1 ? 'active' : ''}`}
                  disabled={currentPage === Math.ceil(ListaPermisos.length / perPage)}
                >
                  Siguiente
                </button>
              </div>
            )}
        </div>
      </Modal>
    </div>
  );
};

export default DataTable;
