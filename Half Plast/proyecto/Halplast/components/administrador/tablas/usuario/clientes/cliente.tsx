/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useState, useEffect, useMemo, useCallback, useRef, use } from "react";
import { Column } from "react-table";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Modal, { setAppElement } from "react-modal";
import Swal from 'sweetalert2';

import { DataRowUsuario, dataRol } from '@/components/administrador/tablas/tiposFilas/usuario';

import Table from '@/components/administrador/tablas/tabla/formatoTabla';
import StatusBoton from '@/components/administrador/tablas/catalogo/estado/estado';

import FormularioDireccion from "@/components/cliente/envio/microFormularioDireccion";
import obtenerDepartamentos from '@/service/api/ubicacion/DepartamentosApi';

import EditarUsuario from '@/service/api/usuarios/clientes/EditarCliente';
import EliminarUsuario from '@/service/api/usuarios/clientes/EliminarCliente';
import AgregarUsuario from '@/service/api/usuarios/clientes/AgregaCliente';

import { motion } from "framer-motion";

import { getRoles } from "@/service/api/configuracion/rol/TodoRol";

import { useModal } from '@/components/administrador/Sidebar/use-modale';
import { useSidebar } from '@/components/administrador/Sidebar/use-sidebar'; 
import { Direccion } from "@/service/api/compra/proveedor/TodoProveedor";

import {
  Pencil,
  Trash2,
  Eye
} from "lucide-react";

interface MunicipioPorDepartamento {
  codigoDANEDepartamento: string;
  nombreDepartamento: string;
  municipios: string[];
}

interface RegionAgrupada {
  nombreRegion: string;
  departamentos: MunicipioPorDepartamento[];
}

Modal.setAppElement('#root');

declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: any) => void;
  }
}

interface DataTableProps {
  data: DataRowUsuario[];
  setRefreshData: React.Dispatch<React.SetStateAction<boolean>>;
}

const DataTable: React.FC<DataTableProps> = ({ data, setRefreshData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ModalAgregarAbrir, setIsModalAgregar] = useState(false);
  const [modalData, setModalData] = useState<{ id: string; NombreUsuario: string; CorreoUsuario: string; TelefonoUsuario: string; RolUnico: dataRol; direccion: Direccion[] } | null>(null);
  
  const [NombreUsuario, setNombreUsuario] = useState<string>('');
  const [PasswordUsuario, setPasswordUsuario] = useState<string>('');
  const [CorreoUsuario, setCorreoUsuario] = useState<string>('');
  const [TelefonoUsuario, setTelefonoUsuario] = useState<string>('');
  const [RolUnico, setRol] = useState<dataRol>({_id: '', nombreRol: '', extraPorcentaje: 0});
  const [allRoles, setAllRoles] = useState<dataRol[]>([]);
  const [perPage] = useState(3);

  const [editando, setEditando] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);

  const [modalFormularioDireccion, setModalFormularioDireccion] = useState<boolean>(false);

  const [direccion, setDireccion] = useState<string>('');
  const [direccionGuardada, setDireccionGuardada] = useState<any | null>(null);

  const [TipoDireccion, setTipoDireccion] = useState<string>('');
  const [selected, setSelected] = useState<google.maps.LatLngLiteral>();
  const puntoPartidaRef = useRef<google.maps.LatLngLiteral | null>(null);
  const limiteDistancia = 70;

  const [Departamentos, setDepartamentos] = useState<RegionAgrupada[]>([]);
  const [RegionSeleccionadaNombre, setRegionSeleccionadaNombre] = useState<string>('');
  const [DepartamentoSeleccionado, setDepartamentoSeleccionado] = useState<{ identificador: string; nombre: string }>({ identificador: '', nombre: '' });
  const [MunicipioSeleccionado, setMunicipioSeleccionado] = useState<{ identificador: string; nombre: string }>({ identificador: '', nombre: '' });

  const [apiResponse, setApiResponseEstado] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const rolesPorPagina = 5; 

  const totalPages = Math.ceil(allRoles.length / perPage);

  const indexOfLastRol = currentPage * perPage;

  const startIndex = (currentPage - 1) * rolesPorPagina;
  const currentRoles = allRoles.slice(startIndex, startIndex + rolesPorPagina);

  const columns: Column<DataRowUsuario>[] = useMemo(
    () => [
      { 
        Header: "ID", 
        accessor: "col1", 
        Cell: ({ value }) => <div style={{ textAlign: 'center' }}>{value}</div>, 
      },
      { 
        Header: "Nombre", 
        accessor: "nombre", 
        Cell: ({ value }) => <div style={{ textAlign: 'center' }}>{value}</div>, 
      },
      { 
        Header: "Correo", 
        accessor: "correo", 
        Cell: ({ value }) => <div style={{ textAlign: 'center' }}>{value}</div>, 
      },
      { 
        Header: "Teléfono", 
        accessor: "telefono", 
        Cell: ({ value }) => <div style={{ textAlign: 'center' }}>{value}</div>, 
      },
      { 
        Header: "Rol", 
        accessor: "nombreRol", 
        Cell: ({ value }) => <div style={{ textAlign: 'center' }}>{value}</div>, 
      },
      {
        Header: "Estado",
        accessor: "enabled",
        Cell: ({ value, row }) => {
          const isDisabled = row.original.nombreRol === "Administrador";
      
          return (
            <div   
              style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                cursor: isDisabled ? 'not-allowed' : 'pointer', 
                opacity: isDisabled ? 0.5 : 1 
              }}
            >
              <StatusBoton 
                isEnabled={value} 
                id={row.original.identificador} 
                modulo="usuarios" 
                onStatusChange={handleStatusChange} 
                disabled={isDisabled}
              />
            </div>
          );
        },
      },
      {
        Header: "Editar",
        Cell: ({ value, row }) => {
          const isDisabled = row.original.nombreRol === "Administrador";
          return (
            <div 
              style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center' ,               
              }}
            >
              <button style={{cursor: isDisabled ? 'not-allowed' : 'pointer', opacity: isDisabled ? 0.5 : 1 }}  onClick={() => openModal(row.original.identificador, row.original.nombre, row.original.correo, row.original.telefono, row.original.rol, row.original.direccion)} disabled={isDisabled}>
                <Pencil className="h-6 w-6 hover:text-green-600" />
              </button>
            </div>
          );
        },
      },
      {
        Header: "Eliminar",
        Cell: ({ value, row }) => {
          const isDisabled = row.original.nombreRol === "Administrador";
          return(
            <div 
              style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
              }}
            >
              <button style={{cursor: isDisabled ? 'not-allowed' : 'pointer', opacity: isDisabled ? 0.5 : 1 }} onClick={() => eliminarUsuario(row.original.identificador)} disabled={isDisabled}>
                <Trash2 className="h-6 w-6 hover:text-red-600" />
              </button>
            </div>
          );
        },
      }
    ],
    []
  );

  const handleStatusChange = (response: any) => {
    setApiResponseEstado(response);
  };

  const openModal = (identificador: string, nombre: string, correo: string, telefono: string, rolData: dataRol, direccion: Direccion[]) => {
    setRol(rolData);
    setModalData({id: identificador, NombreUsuario: nombre, CorreoUsuario: correo, TelefonoUsuario: telefono, RolUnico: rolData, direccion});
    setIsModalOpen(true)
    if (direccion && direccion.length > 0 ){
      const parsedAddress = parseAddress(direccion[0].locaciones[0].locacion);
      setDireccionGuardada({
        tipoVia: parsedAddress.tipoVia,
        numeroVia: parsedAddress.numeroVia,
        prefijoVia: parsedAddress.prefijoVia,
        cardinalidadVia: parsedAddress.cardinalidadVia,
        numeroViaCrl: parsedAddress.numeroViaCrl,
        prefijoViaCrl: parsedAddress.prefijoViaCrl,
        cardinalidadViaCrl: parsedAddress.cardinalidadViaCrl,
        numeroPlaca: parsedAddress.numeroPlaca,
        unidadUrbanizacion: parsedAddress.unidadUrbanizacion,
        ruralAddress: ''
      });
    }
  };

  const closeModal = () => {
    setNombreUsuario('');
    setCorreoUsuario('');
    setTelefonoUsuario('');
    setRol({_id: '', nombreRol: '', extraPorcentaje: 0});
    setIsModalOpen(false);
  };

  const abrirModalAgregar = () => {
    setIsModalAgregar(true);
  };

  const cerrarModalAgregar = () => {
    setNombreUsuario('');
    setCorreoUsuario('');
    setTelefonoUsuario('');
    setRol({_id: '', nombreRol: '', extraPorcentaje: 0});
    setIsModalAgregar(false);
  };

  type ParsedAddress = {
    tipoVia: string;
    numeroVia: string;
    prefijoVia: string;
    cardinalidadVia: string;
    numeroViaCrl: string;
    prefijoViaCrl: string;
    cardinalidadViaCrl: string;
    numeroPlaca: string;
    unidadUrbanizacion: string;
  };

  const obtenerDepartamentosRegiones = useCallback(async () => {
    obtenerDepartamentos().then((datosDepartamento) => {
      if (datosDepartamento) {
          setDepartamentos(datosDepartamento);
      }
    });
  }, []);

  const parseAddress = (direccion: string): ParsedAddress => {
    const cleanedDireccion = direccion.replace(/\s+/g, ' ').trim();
  
    const addressPattern = /^(?<tipoVia>\w+)\s+(?<numeroVia>\d+)\s*(?<prefijoVia>[A-Za-z]*)\s*(?<cardinalidadVia>[NESO]?)?\s*#\s*(?<numeroViaCrl>[0-9\-]+)\s*(?<prefijoViaCrl>[A-Za-z]*)?\s*(?<cardinalidadViaCrl>[NESO]?)?\s*-\s*(?<numeroPlaca>\d+)(?:\s*,\s*(?<unidadUrbanizacion>.+))?$/;

    const match = cleanedDireccion.match(addressPattern);

    if (!match || !match.groups) {
      return {
        tipoVia: '',
        numeroVia: '',
        prefijoVia: '',
        cardinalidadVia: '',
        numeroViaCrl: '',
        prefijoViaCrl: '',
        cardinalidadViaCrl: '',
        numeroPlaca: '',
        unidadUrbanizacion: ''
      };
    }
  
    const { tipoVia, numeroVia, prefijoVia, cardinalidadVia, numeroViaCrl, prefijoViaCrl, cardinalidadViaCrl, numeroPlaca, unidadUrbanizacion } = match.groups as { [key: string]: string };
  
    return {
      tipoVia: tipoVia || '',
      numeroVia: numeroVia || '',
      prefijoVia: prefijoVia || '',
      cardinalidadVia: cardinalidadVia || '',
      numeroViaCrl: numeroViaCrl || '',
      prefijoViaCrl: prefijoViaCrl || '',
      cardinalidadViaCrl: cardinalidadViaCrl || '',
      numeroPlaca: numeroPlaca || '',
      unidadUrbanizacion: unidadUrbanizacion || ''
    };
  };

  const abrirFormularioDireccion = async () => {
    setModalFormularioDireccion(true);
  };

  const cerrarFormularioDireccion = () => {
    setModalFormularioDireccion(false);
    setEditando(false);
  };

  const handleAddressSubmit = (data: any, tipoDireccion: string) => {
    const direccionCompleta = `${data.tipoVia} ${data.numeroVia} ${data.prefijoVia} ${data.cardinalidadVia} # ${data.numeroViaCrl} ${data.prefijoViaCrl} ${data.cardinalidadViaCrl} - ${data.numeroPlaca}`;
    setTipoDireccion(tipoDireccion);
    setDireccionGuardada(data);
    setDireccion(direccionCompleta)
    obtenerCoordenadasPorDireccion(direccionCompleta);
    setEditando(false);
  };

  const handleRegionSelect = (e: React.ChangeEvent<HTMLSelectElement>) =>{
    const selectedNombre = e.target.value;
    setRegionSeleccionadaNombre(selectedNombre);
    setDepartamentoSeleccionado({ identificador:'', nombre: '' });
    setMunicipioSeleccionado({ identificador:'', nombre: '' });
  };

  const getNombreRegion = (Departamento: string) =>{
    const regioSeleccionada = Departamentos.find(Region => Region.departamentos.find(departamento => departamento.nombreDepartamento === Departamento))
    if (regioSeleccionada?.nombreRegion){
      setRegionSeleccionadaNombre(regioSeleccionada?.nombreRegion);
      setDepartamentoSeleccionado({ identificador:'', nombre: '' });
      setMunicipioSeleccionado({ identificador:'', nombre: '' });
      return regioSeleccionada?.nombreRegion;
    }
  };

  const getDepartamentoDatosCompleto = (Departamento: string) =>{
    const regioSeleccionada = Departamentos.find(Region => Region.nombreRegion === RegionSeleccionadaNombre)
    const departamentoCompleto = regioSeleccionada?.departamentos.find(departamento => departamento.nombreDepartamento === Departamento)
    
    if (departamentoCompleto?.nombreDepartamento && departamentoCompleto?.codigoDANEDepartamento){
      setDepartamentoSeleccionado({
        identificador: departamentoCompleto?.codigoDANEDepartamento, 
        nombre: departamentoCompleto?.nombreDepartamento
      });
      setMunicipioSeleccionado({ identificador: '', nombre: '' });
      return departamentoCompleto?.codigoDANEDepartamento;
    }
  };
  
  const handleDepartamentoSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedIdentificador = e.target.value;
    const selectedDepartamentoNombre = e.target.options[e.target.selectedIndex].text;
    setDepartamentoSeleccionado({
      identificador: selectedIdentificador, 
      nombre: selectedDepartamentoNombre
    });
    setMunicipioSeleccionado({ identificador: '', nombre: '' });
  };

  const handleMunicipioSelect = (e: React.ChangeEvent<HTMLSelectElement>) =>{
    const selectedIdentificador = e.target.value;
    const selectedMunicipioNombre = e.target.options[e.target.selectedIndex].text;
    setMunicipioSeleccionado({ identificador: selectedIdentificador, nombre: selectedMunicipioNombre });
  };

  const obtenerCoordenadasPorDireccion = async (direccionDatos: string) => {
    const apiKey = "AIzaSyCM0IAKKlIGcBq0T9dU4UphG49CP_napAI";
    const direccionFormateada = obtenerDireccionFormateada(direccionDatos);

    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(direccionFormateada)}&key=${apiKey}`;
  
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.status === "OK" && data.results.length > 0) {
        const latLng = {
          lat: data.results[0].geometry.location.lat,
          lng: data.results[0].geometry.location.lng,
        };
        setSelected(latLng);
      } else {
        console.error("No se encontraron resultados para la dirección proporcionada.");
      }
    } catch (error) {
      console.error("Error obteniendo las coordenadas:", error);
    }
  };

  const obtenerDireccionFormateada = (direccion: any) => {
    let direccionCompleta = `${direccion.tipoVia} ${direccion.numeroVia} ${direccion.prefijoVia} ${direccion.cardinalidadVia} # ${direccion.numeroViaCrl} ${direccion.prefijoViaCrl} ${direccion.cardinalidadViaCrl} - ${direccion.numeroPlaca}`;
    direccionCompleta = direccionCompleta.replace(/\s+/g, ' ').trim();
    const municipio = MunicipioSeleccionado.nombre === '' ? modalData?.direccion[0].ciudad : MunicipioSeleccionado.nombre ;
    const departamento = DepartamentoSeleccionado.nombre === '' ? modalData?.direccion[0].departamento : DepartamentoSeleccionado.nombre;
    return `${departamento}, ${municipio}, ${direccionCompleta}`;
  };

  const agregarUsuario = async () => {
    if(selected){
      const response = await AgregarUsuario(
        NombreUsuario,PasswordUsuario,
        CorreoUsuario,
        TelefonoUsuario,
        RolUnico._id,
        direccion, 
        DepartamentoSeleccionado.nombre, 
        MunicipioSeleccionado.nombre, 
        selected 
      ); 
      if (response && typeof response.status === 'number') {
        if (response.status === 200) {
            Swal.fire({
                title: '¡Exitoso!',
                text: response.msg,
                icon: 'success',
                timerProgressBar: true,
                timer: 1500,
                showConfirmButton: false,
            });
            setIsModalAgregar(false);
            setRefreshData(true);
        } else if (response.status === 409) {
            Swal.fire({
                title: '¡Advertencia!',
                text: response.msg,
                icon: 'warning',
                timerProgressBar: true,
                timer: 1500,
                showConfirmButton: false,
            });
        } else {
            Swal.fire({
                title: '¡Error!',
                text: response.msg,
                icon: 'error',
                timerProgressBar: true,
                timer: 1500,
                showConfirmButton: false,
            });
        }
      } else {
        Swal.fire({
            title: '¡Error!',
            text: 'Error desconocido al registrar el usuario.',
            icon: 'error',
            timerProgressBar: true,
            timer: 1500,
            showConfirmButton: false,
        });
      }
    }
  };

  const eliminarUsuario = async (identificador: string) => {
    if (identificador) {
      try {
        const response = await EliminarUsuario(identificador); 
        if (response) {
          Swal.fire({
            title: '¡Exitoso!',
            text: '¡Usuario eliminado exitosamente!',
            icon: 'success',
            timerProgressBar: true,
            timer: 1500,
            showConfirmButton: false,
          });
          setRefreshData(true); 
        } else {
          Swal.fire({
            title: '¡Error!',
            text: '¡El usuario no pudo ser eliminado!',
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

  const handleRolClick = (rol: dataRol) => {
    setRol({_id: rol._id, nombreRol: rol.nombreRol, extraPorcentaje: rol.extraPorcentaje});
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePaginaSiguiente = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePaginaAnterior = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const roles = await getRoles();
        setAllRoles(roles);
      } catch (error) {
        console.error('Error al obtener los roles:', error);
      }
    };
  
    fetchRoles();
  }, []);

  useEffect(() => {
    obtenerDepartamentosRegiones();
  }, [obtenerDepartamentosRegiones]);

  useEffect(() => {
    setIsModalOpen(isModalOpen);
  }, [isModalOpen, ModalAgregarAbrir]);

  useEffect(() => {
    setIsModalAgregar(ModalAgregarAbrir);
  }, [ModalAgregarAbrir, isModalOpen]);

  return (
    <div style={{ padding: "20px" }}>
      <button type="button" className="botonAgregado"  onClick={abrirModalAgregar}>Agregar</button>
      <Table<DataRowUsuario> columns={columns} data={data} setRefreshData={() => {}}/>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Edit Modal"
        className="ModalDashboard"
        overlayClassName="Overlay"
      >
        <div className="ModalDashboard">
          <div className="ModalContentSinImagen" style={{marginTop:'-40px'}}>
            <form className="formularioAgregar" 
              onSubmit={async (e) => {
                e.preventDefault();

                const response = await EditarUsuario(
                  modalData!.id, modalData!.NombreUsuario !== NombreUsuario ? modalData!.NombreUsuario : NombreUsuario , modalData!.CorreoUsuario !== CorreoUsuario ? modalData!.CorreoUsuario : CorreoUsuario , modalData!.TelefonoUsuario !== TelefonoUsuario ?  modalData!.TelefonoUsuario: TelefonoUsuario, modalData!.RolUnico._id !== RolUnico._id ?  modalData!.RolUnico._id : RolUnico._id,
                  modalData!.direccion[0].locaciones[0].locacion === direccion || !direccion ?  modalData!.direccion[0].locaciones[0].locacion : direccion,
                  modalData!.direccion[0].departamento === DepartamentoSeleccionado.nombre || DepartamentoSeleccionado.nombre === ''  ? modalData!.direccion[0].departamento : DepartamentoSeleccionado.nombre,
                  modalData!.direccion[0].ciudad == MunicipioSeleccionado.nombre || MunicipioSeleccionado.nombre === '' ? modalData!.direccion[0].ciudad : MunicipioSeleccionado.nombre,
                  (
                    modalData!.direccion[0].locaciones[0].coordenadas.latitud !== selected?.lat 
                    || 
                    modalData!.direccion[0].locaciones[0].coordenadas.longitud !== selected?.lng
                  )
                  ? { 
                    lat: modalData!.direccion[0].locaciones[0].coordenadas.latitud,
                    lng: modalData!.direccion[0].locaciones[0].coordenadas.longitud 
                  } : selected,
                  modalData!.direccion[0].locaciones[0]._id,
                  (modalData!.direccion[0].locaciones[0].locacion !== direccion) || (modalData!.direccion[0].departamento !== DepartamentoSeleccionado.nombre) || (modalData!.direccion[0].ciudad !== MunicipioSeleccionado.nombre) ? true : false); 
                  console.log(response)
                  if (response && response.status === 200) {
                  Swal.fire({
                    title: '¡Exitoso!',
                    text: '¡Usuario actualizado exitosamente!',
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
                    text: '¡El Usuario no pudo ser actualizado!',
                    icon: 'error',
                    timerProgressBar: true,
                    timer: 1500,
                    showConfirmButton: false,
                  });
                }
              }}>
              <div>
                <h2 className="titleSinFondoModal">Editar usuario</h2>
                <label htmlFor="nombreRol" className="LabelModal">Nombre</label>
                <input
                  id="nombreRol"
                  value={modalData?.NombreUsuario || NombreUsuario}
                  onChange={(e) => {
                    if (modalData) {
                      setModalData({ ...modalData, NombreUsuario: e.target.value });
                    }
                    setNombreUsuario(e.target.value)
                  }}
                  className="inputEditarForm"
                />
                <label htmlFor="nombreRol" className="LabelModal">Correo</label>
                <input
                  id="nombreRol"
                  value={modalData?.CorreoUsuario || CorreoUsuario}
                  onChange={(e) => {
                    if (modalData) {
                      setModalData({ ...modalData, CorreoUsuario: e.target.value });
                    }
                    setCorreoUsuario(e.target.value)
                  }}
                  className="inputEditarForm"
                />
                <label htmlFor="nombreRol" className="LabelModal">Teléfono</label>
                <input
                  id="nombreRol"
                  value={modalData?.TelefonoUsuario || TelefonoUsuario}
                  onChange={(e) => {
                    if (modalData) {
                      setModalData({ ...modalData, TelefonoUsuario: e.target.value });
                    }
                    setTelefonoUsuario(e.target.value)
                  }}
                  className="inputEditarForm"
                />

                <label htmlFor="direccionResumen" className="LabelModal">Dirección</label>
                <input
                  type="text"
                  id="direccionResumen"
                  placeholder="Dirección resumen"
                  onClick={abrirFormularioDireccion}
                  value={direccionGuardada ? obtenerDireccionFormateada(direccionGuardada) : ''}
                  onChange={() => {}}
                  required
                  readOnly={direccion !== ''}
                  style={{ cursor: direccion !== '' ? 'pointer' : 'text' }}
                  className="inputEditarForm"
                />
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
            <div style={{ background: 'white', padding: '20px', borderRadius: '7px', width: '100%' }}>
              <h3 style={{ textAlign: 'center', marginTop: '10px', marginBottom: '20px' }} className="titleSinFondoModal">
                Roles
              </h3>
              <div style={{ padding: '10px', gap: '10px' }}>
                {currentRoles.map((rol) => (
                  <div
                  key={rol._id}
                  onClick={() => handleRolClick(rol)}
                  className={`rol-item ${rol._id === RolUnico._id ? 'selected' : ''}`}
                  style={{
                      cursor: 'pointer',
                      padding: '10px',
                      marginBottom: '10px',
                      border: '1px solid #ccc',
                      borderRadius: '7px',
                      backgroundColor: rol._id === RolUnico._id ? '#007bff' : 'white',
                      color: rol._id === RolUnico._id ? 'white' : 'black',
                  }}
                  >
                  {rol.nombreRol}
                  </div>
                ))}
                {allRoles.length > 5 && (
                  <div className="pagination" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                    <button onClick={handlePaginaAnterior} disabled={currentPage === 1}>
                      Anterior
                    </button>
                    <span style={{ alignSelf: 'center' }}>
                      {currentPage} de {totalPages}
                    </span>
                    <button onClick={handlePaginaSiguiente} disabled={currentPage === totalPages}>
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
          <div className="ModalContentSinImagen" style={{marginTop:'-40px'}}>
            <form className="formularioAgregar" onSubmit={async (e) => {
                e.preventDefault();
                agregarUsuario();
              }}>
              <div style={{maxWidth:'400px'}}>
                <h2 className="titleSinFondoModal">Agregar usuario</h2>
                <label htmlFor="nombreUsuario" className="LabelModal">Nombre</label>
                <input
                  id="nombreUsuario"
                  value={NombreUsuario}
                  onChange={(e) => setNombreUsuario(e.target.value)}
                  className="inputEditarForm"
                />
                <label htmlFor="passwordUsuario" className="LabelModal">Password</label>
                <input
                  id="passwordUsuario"
                  value={PasswordUsuario}
                  onChange={(e) => setPasswordUsuario(e.target.value)}
                  className="inputEditarForm"
                />
                <label htmlFor="correoUsuario" className="LabelModal">Correo</label>
                <input
                  id="correoUsuario"
                  value={CorreoUsuario}
                  onChange={(e) => setCorreoUsuario(e.target.value)}
                  className="inputEditarForm"
                />
                <label htmlFor="telefonoUsuario" className="LabelModal">Teléfono</label>
                <input
                  id="telefonoUsuario"
                  value={TelefonoUsuario}
                  onChange={(e) => setTelefonoUsuario(e.target.value)}
                  className="inputEditarForm"
                />
                 <label htmlFor="direccionResumen" className="LabelModal">Dirección</label>
                  <input
                    type="text"
                    id="direccionResumen"
                    placeholder="Dirección resumen"
                    onClick={abrirFormularioDireccion}
                    value={direccionGuardada ? obtenerDireccionFormateada(direccionGuardada) : ''}
                    onChange={() => {}}
                    required
                    readOnly={direccion !== ''}
                    style={{ cursor: direccion !== '' ? 'pointer' : 'text' }}
                    className="inputEditarForm"
                  />
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

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px', width:'400px' }}>
            <div style={{ background: 'white', padding: '20px', borderRadius: '7px', width: '100%' }}>
              <h3 style={{ textAlign: 'center', marginTop: '10px', marginBottom: '20px' }} className="titleSinFondoModal">
              Roles
              </h3>
              <div style={{ padding: '10px', gap: '10px' }}>
              {currentRoles.map((rol) => (
                  <div
                  key={rol._id}
                  onClick={() => handleRolClick(rol)}
                  className={`rol-item ${rol._id === RolUnico._id ? 'selected' : ''}`}
                  style={{
                      cursor: 'pointer',
                      padding: '10px',
                      marginBottom: '10px',
                      border: '1px solid #ccc',
                      borderRadius: '7px',
                      backgroundColor: rol._id === RolUnico._id ? '#007bff' : 'white',
                      color: rol._id === RolUnico._id ? 'white' : 'black',
                  }}
                  >
                  {rol.nombreRol}
                  </div>
              ))}
              {currentRoles.length > 5 && (
                <div className="pagination" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                <button onClick={handlePrevPage} disabled={currentPage === 1}>
                    Anterior
                </button>
                <span style={{ alignSelf: 'center' }}>{currentPage} de {totalPages}</span>
                <button onClick={handleNextPage} disabled={currentPage === totalPages}>
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
        isOpen={modalFormularioDireccion}
        onRequestClose={cerrarFormularioDireccion}
        contentLabel="Agregar Direccion"
        className="ModalDashboard"
        overlayClassName="Overlay"
      >
        <div className="ModalDashboard" style={{backgroundColor:'transparent'}}>
          <div className="ModalContentSinImagen" style={{textAlign: 'center', backgroundColor:'white', maxWidth:'350px', maxHeight:'550px', marginTop:'73px'}}>
            <label className="titleSinFondoModal" style={{marginTop: '20px'}}>Agregar zona del país</label>
            
            {Departamentos && Departamentos.length > 0 && (
              <>
                <label 
                  htmlFor="region" 
                  style={{ 
                    display: 'block', 
                    marginBottom: '15px',
                    marginTop: '10px',
                  }}>
                  Región
                </label>

                <motion.select
                  name="region"
                  id="region"
                  className="address-form__select"
                  onFocus={() => setIsSelecting(true)}
                  onBlur={() => setIsSelecting(false)}
                  onChange={(e) => handleRegionSelect(e)}
                  style={{ 
                    width: "80%", 
                    margin: "0 auto 20px auto",
                    display: "block",
                  }}
                  value={isModalOpen && RegionSeleccionadaNombre === '' && (modalData && modalData?.direccion && modalData?.direccion.length > 0 && modalData?.direccion[0].departamento) ? getNombreRegion(modalData?.direccion[0].departamento)  : RegionSeleccionadaNombre}
                >
                  <option value="" disabled>Seleccione una región</option>
                  {Departamentos.map((Region) => (
                    <option key={Region.nombreRegion} value={Region.nombreRegion}>
                      {Region.nombreRegion}
                    </option>
                  ))}
                </motion.select>
              </>
            )}

            {RegionSeleccionadaNombre && RegionSeleccionadaNombre !== '' && (
              <>
                <label 
                  htmlFor="departamento" 
                  style={{ 
                    display: 'block', 
                    marginBottom: '15px', 
                    marginTop: '10px', 
                  }}
                >
                  Departamentos
                </label>
                <motion.select
                  name="departamento"
                  id="departamento"
                  className="address-form__select"
                  onFocus={() => setIsSelecting(true)}
                  onBlur={() => setIsSelecting(false)}
                  onChange={(e) => handleDepartamentoSelect(e)}
                  style={{ 
                    width: "80%", 
                    margin: "0 auto 20px auto", 
                    display: "block",
                  }}
                  value={isModalOpen && DepartamentoSeleccionado.identificador === '' && DepartamentoSeleccionado.nombre === ''  && modalData?.direccion[0].departamento ? getDepartamentoDatosCompleto(modalData?.direccion[0].departamento) : DepartamentoSeleccionado.identificador}
                >
                  <option value="Seleccione">Seleccione un departamento</option>
                  {Departamentos.filter((region) => region.nombreRegion === RegionSeleccionadaNombre)
                    .flatMap((Region) =>
                      Region.departamentos.map((Departamento) => (
                        <option key={Departamento.codigoDANEDepartamento} value={Departamento.codigoDANEDepartamento}>
                          {Departamento.nombreDepartamento}
                        </option>
                      ))
                    )}
                </motion.select>
              </>
            )}
            {DepartamentoSeleccionado && DepartamentoSeleccionado.nombre !== 'Seleccione un departamento' && DepartamentoSeleccionado.nombre !== '' && (
              <>
                <label 
                  htmlFor="municipio" 
                  style={{ 
                    display: 'block', 
                    marginBottom: '15px', 
                    marginTop: '10px', 
                  }}
                >
                  Municipios
                </label>
                <motion.select
                  name="municipio"
                  id="municipio"
                  className="address-form__select"
                  onFocus={() => setIsSelecting(true)}
                  onBlur={() => setIsSelecting(false)}
                  onChange={(e) => handleMunicipioSelect(e)}
                  style={{ 
                    width: "80%", 
                    margin: "0 auto 20px auto", 
                    display: "block",
                  }}
                  value={isModalOpen && modalData?.direccion[0].ciudad && MunicipioSeleccionado.identificador === '' && MunicipioSeleccionado.nombre === '' ? modalData?.direccion[0].ciudad : MunicipioSeleccionado.identificador}
                >
                  <option value="">Seleccione un municipio</option>
                  {Departamentos.filter((Region) => Region.nombreRegion === RegionSeleccionadaNombre)
                    .flatMap((Region) =>
                      Region.departamentos
                        .filter((departamento) => departamento.nombreDepartamento === DepartamentoSeleccionado.nombre)
                        .flatMap((departamento) =>
                          departamento.municipios.map((municipio) => (
                            <option key={municipio} value={municipio}>
                              {municipio}
                            </option>
                          ))
                        )
                    )}
                </motion.select>
                <div className="address-form__summary">
                  <h4><strong>Resumen zona del pais</strong></h4>
                  <input type="text" className="address-form__disabled" style={{width:'100%', marginTop:'5px'}} disabled value={ Departamentos.length > 0 ? DepartamentoSeleccionado.nombre + ' - ' + (MunicipioSeleccionado.nombre === '' && isModalOpen && (modalData?.direccion[0].departamento === DepartamentoSeleccionado.nombre)  ? modalData?.direccion[0].ciudad : MunicipioSeleccionado.nombre ) : ''}/>
                </div>
              </>
            )}
          </div>

          {modalFormularioDireccion && ((MunicipioSeleccionado.nombre !== '') || (isModalOpen && modalData?.direccion[0].ciudad && isModalOpen && modalData?.direccion[0].departamento === DepartamentoSeleccionado.nombre)) && (
            <FormularioDireccion
              onSubmit={handleAddressSubmit}
              onCancel={cerrarFormularioDireccion}
              initialData={direccionGuardada}
              TituloFormulario={'Indique su direccion de entrega'}
            />
          )}
        </div>
      </Modal>

      {/* <Modal
        isOpen={isModalVisualizar}
        onRequestClose={cerrarModalVisualizar}
        contentLabel="Visualizar Permisos"
        className="ModalRoles"
        overlayClassName="Overlay"
        style={{
          content: {
            width: '250px',
            height: 'auto',
            margin: 'auto',
            padding: '10px',
            borderRadius: '10px',
            backgroundColor: '#fff',
            border: '1px solid #ccc',
          }
        }}
      >
        <div className="ModalContentRoles">
          <h2 className="titleSinFondoModal">Rol activo</h2>
          <div  style={{width:'90%', textAlign:'center'}}>
            <div key={RolUnico._id} className="border p-2 rounded">
            <strong>{RolUnico.nombreRol}</strong>
            <p>Cobro extra: {RolUnico.extraPorcentaje*100}%</p>
            </div>
          </div>
          <button onClick={cerrarModalVisualizar} className="CerrarModalBotonGeneral" style={{marginTop:'10px'}}>Cerrar</button>
        </div>
      </Modal> */}

    </div>
  );
};

export default DataTable;
