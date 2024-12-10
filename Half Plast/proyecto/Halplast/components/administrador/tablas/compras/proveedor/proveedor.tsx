/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Column } from "react-table";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Modal, { setAppElement } from "react-modal";
import Swal from 'sweetalert2';

import { DataRowProveedor } from '@/components/administrador/tablas/tiposFilas/proveedor';

import Table from '@/components/administrador/tablas/tabla/formatoTabla';
import StatusBoton from '@/components/administrador/tablas/catalogo/estado/estado';

import EditarProveedor from '@/service/api/compra/proveedor/EditarProveedor';
import EliminarProveedor from '@/service/api/compra/proveedor/EliminarProveedor';
import AgregarProveedor from '@/service/api/compra/proveedor/AgregaProveedor';

import FormularioDireccion from "@/components/cliente/envio/microFormularioDireccion";
import obtenerDepartamentos from '@/service/api/ubicacion/DepartamentosApi';

import { motion } from "framer-motion";

import { Pencil, Trash2, MapPinCheck, MapPinPlusInside } from "lucide-react";

import { useModal } from '@/components/administrador/Sidebar/use-modale';
import { useSidebar } from '@/components/administrador/Sidebar/use-sidebar'; 
import { Direccion } from "@/service/api/compra/proveedor/TodoProveedor";

Modal.setAppElement('#root');

interface MunicipioPorDepartamento {
  codigoDANEDepartamento: string;
  nombreDepartamento: string;
  municipios: string[];
}

interface RegionAgrupada {
  nombreRegion: string;
  departamentos: MunicipioPorDepartamento[];
}

declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: any) => void;
  }
}

interface DataTableProps {
  data: DataRowProveedor[];
  setRefreshData: React.Dispatch<React.SetStateAction<boolean>>;
}

const libraries: ("places")[] = ["places"];

const DataTable: React.FC<DataTableProps> = ({ data, setRefreshData }) => {
  const [isMounted, setIsMounted] = useState(false);

  const { isSidebarOpen, toggleSidebar } = useSidebar();
  const { setModalOpen, setModalAgregar, setModalAbrirImagen } = useModal();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ModalAgregarAbrir, setIsModalAgregar] = useState(false);
  const [modalData, setModalData] = useState<{ id: string; NombreProveedor: string; CorreoProveedor: string; TelefonoProveedor: string; numeroDocumento:string; tipoDocumento: string; direccion: Direccion[] } | null>(null);
  
  const [NombreProveedor, setNombreProveedor] = useState<string>('');
  const [CorreoProveedor, setCorreoProveedor] = useState<string>('');
  const [TelefonoProveedor, setTelefonoProveedor] = useState<string>('');
  
  const [tipoDocumento, setTipoDocumento] = useState<string>('');
  const [numeroDocumento, setNumeroDocumento] = useState<string>('');

  const [direccion, setDireccion] = useState<string>('');
  const [direccionGuardada, setDireccionGuardada] = useState<any | null>(null);
  
  const [editando, setEditando] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);

  const [modalFormularioDireccion, setModalFormularioDireccion] = useState<boolean>(false);

  const [TipoDireccion, setTipoDireccion] = useState<string>('');
  const [selected, setSelected] = useState<google.maps.LatLngLiteral>();
  const puntoPartidaRef = useRef<google.maps.LatLngLiteral | null>(null);
  const limiteDistancia = 70;

  const [Departamentos, setDepartamentos] = useState<RegionAgrupada[]>([]);
  const [RegionSeleccionadaNombre, setRegionSeleccionadaNombre] = useState<string>('');
  const [DepartamentoSeleccionado, setDepartamentoSeleccionado] = useState<{ identificador: string; nombre: string }>({ identificador: '', nombre: '' });
  const [MunicipioSeleccionado, setMunicipioSeleccionado] = useState<{ identificador: string; nombre: string }>({ identificador: '', nombre: '' });
  
  const columns: Column<DataRowProveedor>[] = useMemo(
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
        Header: "Documento",
        accessor: (row) => `${row.tipoDocumento} ${row.numeroDocumento}`,
        Cell: ( cell : any ) => (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>{cell.value}</div>
        ),
      },
      {
        Header: "Estado",
        accessor: "enabled",
        Cell: ({ value, row }) => (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <StatusBoton isEnabled={value} id={row.original.identificador} modulo="proveedor" disabled={false}/>
          </div>
        ),
      },
      {
        Header: "Editar",
        Cell: ({ row }) => (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <button onClick={() => openModal(row.original.identificador, row.original.nombre, row.original.correo, row.original.telefono, row.original.numeroDocumento, row.original.tipoDocumento, row.original.direccion)}>
              <Pencil className="h-6 w-6 hover:text-green-600" />
            </button>
          </div>
        ),
      },
      {
        Header: "Eliminar",
        Cell: ({ row }) => (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <button onClick={() => eliminarProveedor(row.original.identificador)}>
              <Trash2 className="h-6 w-6 hover:text-red-600" />
            </button>
          </div>
        ),
      }
    ],
    []
  );

  const openModal = (identificador: string, nombre: string, correo: string, telefono: string, numeroDocumento: string, tipoDocumento: string, direccion: Direccion[]) => {
    setModalData({id: identificador, NombreProveedor: nombre, CorreoProveedor: correo, TelefonoProveedor: telefono, numeroDocumento, tipoDocumento, direccion});
    setIsModalOpen(true);

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
  
  const limpiarDatos = () => {
    setNombreProveedor('');
    setCorreoProveedor('');
    setTelefonoProveedor('');
    setTipoDocumento('');
    setNumeroDocumento('');
    if (isSidebarOpen) {
      toggleSidebar();
    }
  };

  const closeModal = () => {
    limpiarDatos();
    if (isSidebarOpen) {
      toggleSidebar();
    }
    setIsModalOpen(false);
  };

  const abrirModalAgregar = useCallback(() => {
    if (isSidebarOpen) {
      toggleSidebar();
    }
    setIsModalAgregar(true);
  }, []);

  const cerrarModalAgregar = () => {
    limpiarDatos();
    if (isSidebarOpen) {
      toggleSidebar();
    }
    setIsModalAgregar(false);
  };

  const obtenerDepartamentosRegiones = useCallback(async () => {
    obtenerDepartamentos().then((datosDepartamento) => {
      if (datosDepartamento) {
          setDepartamentos(datosDepartamento);
      }
    });
  }, []);

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

  const validarNumeroDocumento = () => {
    let numeroDocumentoEntrada
    let tipoDocumentoEntrada
    if (isModalOpen && (!numeroDocumento || numeroDocumento === modalData?.numeroDocumento) && (!tipoDocumento || tipoDocumento === modalData?.tipoDocumento) ) {
      numeroDocumentoEntrada = modalData?.numeroDocumento
      tipoDocumentoEntrada = modalData?.tipoDocumento
    }else {
      numeroDocumentoEntrada = numeroDocumento
      tipoDocumentoEntrada = tipoDocumento
    }

    if (numeroDocumentoEntrada === undefined || tipoDocumentoEntrada === undefined) {
      return false;
    }

    switch (tipoDocumentoEntrada) {
      case 'CC':
        return /^[0-9]{10}$/.test(numeroDocumentoEntrada);
      case 'NIT':
        return /^[0-9]{9}$/.test(numeroDocumentoEntrada);
      case 'CE':
        return /^[0-9]{7,11}$/.test(numeroDocumentoEntrada);
      default:
        return false;
    }
  };

  const agregarProveedor = async () => {
    if (selected) {
      const response = await AgregarProveedor(
          NombreProveedor, 
          CorreoProveedor, 
          TelefonoProveedor, 
          tipoDocumento, 
          numeroDocumento, 
          direccion, 
          DepartamentoSeleccionado.nombre, 
          MunicipioSeleccionado.nombre, 
          selected
      );

      if (response && typeof response.status === 'number') {
          if (response.status === 201) {
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
              text: 'Error desconocido al registrar el proveedor.',
              icon: 'error',
              timerProgressBar: true,
              timer: 1500,
              showConfirmButton: false,
          });
      }
    }
  };

  const editarProveedor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validarNumeroDocumento()) {
      Swal.fire({
        title: 'Error',
        text: 'Número de documento no válido para el tipo seleccionado.',
        icon: 'error',
        timer: 1500,
        showConfirmButton: false,
      });
      return;
    }

    const response = await EditarProveedor(
      modalData!.id, 
      modalData!.NombreProveedor!== NombreProveedor ? modalData!.NombreProveedor : NombreProveedor ,
      modalData!.CorreoProveedor !== CorreoProveedor ? modalData!.CorreoProveedor : CorreoProveedor ,
      modalData!.TelefonoProveedor !== TelefonoProveedor ? modalData!.TelefonoProveedor : TelefonoProveedor,
      modalData!.numeroDocumento === numeroDocumento ? modalData!.numeroDocumento : numeroDocumento,
      modalData!.tipoDocumento === tipoDocumento ? modalData!.tipoDocumento : tipoDocumento,
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
      (modalData!.direccion[0].locaciones[0].locacion !== direccion) || (modalData!.direccion[0].departamento !== DepartamentoSeleccionado.nombre) || (modalData!.direccion[0].ciudad !== MunicipioSeleccionado.nombre) ? true : false
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
          setIsModalOpen(false);
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
            text: 'Error desconocido al editar el proveedor.',
            icon: 'error',
            timerProgressBar: true,
            timer: 1500,
            showConfirmButton: false,
        });
    }
  }

  const eliminarProveedor = async (identificador: string) => {
    if (identificador) {
      try {
        const response = await EliminarProveedor(identificador); 
        console.log(response);
        if (response && (response.status === 200 || response.msg === "Proveedor eliminado exitosamente")) {
          Swal.fire({
            title: '¡Exitoso!',
            text: '¡Proveedor eliminado exitosamente!',
            icon: 'success',
            timerProgressBar: true,
            timer: 1500,
            showConfirmButton: false,
          });
          setRefreshData(true); 
        } else {
          Swal.fire({
            title: '¡Error!',
            text: '¡El proveedor no pudo ser eliminado!',
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
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    obtenerDepartamentosRegiones();
  }, [obtenerDepartamentosRegiones]);

  useEffect(() => {
    setModalOpen(isModalOpen);
  }, [isModalOpen, setModalOpen]);

  useEffect(() => {
    setModalAgregar(ModalAgregarAbrir);
  }, [ModalAgregarAbrir, setModalAgregar]);

  return (
    <div style={{ padding: "20px" }}>
      <button type="button" className="botonAgregado"  onClick={abrirModalAgregar}>Agregar</button>

      <Table<DataRowProveedor> columns={columns} data={data} setRefreshData={() => {}}/>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Edit Modal"
        className="ModalDashboard"
        overlayClassName="Overlay"
      >
        <div className="ModalDashboard">
          <div className="ModalContentSinImagen" style={{minWidth:'400px', maxWidth:'500px'}}>
            <form className="formularioAgregar" onSubmit={async (e) => {editarProveedor(e)}}>
              <div>
                <h2 className="titleSinFondoModal">Editar proveedor</h2>

                <label htmlFor="tipoDocumento" className="LabelModal">Tipo de Documento</label>
                <select id="tipoDocumento" value={(modalData?.tipoDocumento && isModalOpen && !tipoDocumento) ? modalData?.tipoDocumento : tipoDocumento} onChange={(e) => setTipoDocumento(e.target.value)} className="selectModal">
                  <option value="" disabled>Seleccione</option>
                  <option value="CC">Cédula de Ciudadanía</option>
                  <option value="NIT">NIT</option>
                  <option value="CE">Cédula de Extranjería</option>
                </select>

                <label htmlFor="numeroDocumento" className="LabelModal">Número de Documento</label>
                <input
                  id="numeroDocumento"
                  value={modalData?.numeroDocumento || numeroDocumento}
                  onChange={(e) => {
                    if (modalData) {
                      setModalData({ ...modalData, numeroDocumento: e.target.value });
                    }
                    setNumeroDocumento(e.target.value)
                  }}
                  className="inputEditarForm"
                />
                
                <label htmlFor="nombreEditarProveedor" className="LabelModal">Nombre</label>
                <input
                  id="nombreEditarProveedor"
                  value={modalData?.NombreProveedor || NombreProveedor}
                  onChange={(e) => {
                    if (modalData) {
                      setModalData({ ...modalData, NombreProveedor: e.target.value });
                    }
                    setNombreProveedor(e.target.value)
                  }}
                  className="inputEditarForm"
                />
                <label htmlFor="correoEditarProveedor" className="LabelModal">Correo</label>
                <input
                  id="correoEditarProveedor"
                  value={modalData?.CorreoProveedor || CorreoProveedor}
                  onChange={(e) => {
                    if (modalData) {
                      setModalData({ ...modalData, CorreoProveedor: e.target.value });
                    }
                    setCorreoProveedor(e.target.value)
                  }}
                  className="inputEditarForm"
                />
                <label htmlFor="telefonoEditarProveedor" className="LabelModal">Teléfono</label>
                <input
                  id="telefonoEditarProveedor"
                  value={modalData?.TelefonoProveedor || TelefonoProveedor}
                  onChange={(e) => {
                    if (modalData) {
                      setModalData({ ...modalData, TelefonoProveedor: e.target.value });
                    }
                    setTelefonoProveedor(e.target.value)
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

        </div>
      </Modal>

      <Modal
        isOpen={ModalAgregarAbrir}
        onRequestClose={cerrarModalAgregar}
        contentLabel="Agregar Proveedor"
        className="ModalDashboard"
        overlayClassName="Overlay"
      >
        <div className="ModalDashboard">
          <div className="ModalContentSinImagen" style={{width:'400px'}}>
            <form className="formularioAgregar" onSubmit={async (e) => {
              e.preventDefault();
                if (!validarNumeroDocumento()) {
                  Swal.fire({
                    title: 'Error',
                    text: 'Número de documento no válido para el tipo seleccionado.',
                    icon: 'error',
                    timer: 1500,
                    showConfirmButton: false,
                  });
                  return;
                } else {
                  agregarProveedor();
                }
              }}>
              <div>
                <h2 className="titleSinFondoModal">Agregar proveedor</h2>

                <label htmlFor="tipoDocumento" className="LabelModal">Tipo de Documento</label>
                <select id="tipoDocumento" value={tipoDocumento} onChange={(e) => setTipoDocumento(e.target.value)} className="selectModal">
                  <option value="">Seleccione</option>
                  <option value="CC">Cédula de Ciudadanía</option>
                  <option value="NIT">NIT</option>
                  <option value="CE">Cédula de Extranjería</option>
                </select>

                <label htmlFor="numeroDocumento" className="LabelModal">Número de Documento</label>
                <input
                  id="numeroDocumento"
                  value={numeroDocumento}
                  onChange={(e) => setNumeroDocumento(e.target.value)}
                  className="inputEditarForm"
                />

                <label htmlFor="nombreProveedor" className="LabelModal">Nombre</label>
                <input
                  id="nombreProveedor"
                  value={NombreProveedor}
                  onChange={(e) => setNombreProveedor(e.target.value)}
                  className="inputEditarForm"
                />

                <label htmlFor="correoProveedor" className="LabelModal">Correo</label>
                <input
                  id="correoProveedor"
                  value={CorreoProveedor}
                  onChange={(e) => setCorreoProveedor(e.target.value)}
                  className="inputEditarForm"
                />
                <label htmlFor="telefonoProveedor" className="LabelModal">Teléfono</label>
                <input
                  id="telefonoProveedor"
                  value={TelefonoProveedor}
                  onChange={(e) => setTelefonoProveedor(e.target.value)}
                  className="inputEditarForm"
                />
                <label htmlFor="direccionResumen" className="LabelModal">Dirección</label>
                <input
                  type="text"
                  id="direccionResumen"
                  placeholder="Dirección resumen"
                  onClick={abrirFormularioDireccion}
                  defaultValue={direccionGuardada ? obtenerDireccionFormateada(direccionGuardada) : ''}
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
                  value={isModalOpen && RegionSeleccionadaNombre === '' && modalData?.direccion[0].departamento ? getNombreRegion(modalData?.direccion[0].departamento)  : RegionSeleccionadaNombre}
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
    </div>
  );
};

export default DataTable;
