/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import '../../tablas/catalogo/selects/PrecioSelect.css';

import React, { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { Column } from "react-table";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Modal from "react-modal";
import Swal from 'sweetalert2';
import "react-datepicker/dist/react-datepicker.css";

import DatePicker from "react-datepicker";
import { addDays, setHours, setMinutes, getDay, longFormatters } from 'date-fns';

import ProductoSelectXmedidaProducto from '@/components/administrador/tablas/catalogo/selects/productoXmedidaProducto';
import InputFormato from '@/components/layaout/elementos/inputLog';
import FormularioDireccion from "@/components/cliente/envio/microFormularioDireccion";

import MedidaVentaSelect from '@/components/administrador/tablas/catalogo/selects/SelectMedidasVenta';
import obtenerDepartamentos from '@/service/api/ubicacion/DepartamentosApi';

import Table from '@/components/administrador/tablas/tabla/formatoTabla';
import { DataRowVenta, DetalleVenta ,DetalleVentaEnviar, Usuario, MedidaVentaEnviar, MedidaProductoEnviar, MedidaProducto as MedidaProductoPersonalizado, MedidaVenta as MedidaVentaPersonalizado, Area, PesoPersonalizado as PesoPersonalizadoEnviar } from '@/components/administrador/tablas/tiposFilas/venta';
import { getMedidaProducto, MedidaProducto, MedidaVenta, PesoValor } from "@/service/api/catalogo/medidaProducto/TodoMedidaProductoConMedidasVenta";
import { getClientes, DataRowCliente } from "@/service/api/usuarios/TodoCliente";
import { getPesos, Peso as interfacePeso } from "@/service/api/catalogo/peso/TodoPeso";

import { getMedidasVenta, MedidaVenta as MedidaVentaTodoApi } from "@/service/api/catalogo/medidaVenta/TodoMedidaVenta";

import { useModal } from '@/components/administrador/Sidebar/use-modale';
import { useSidebar } from '@/components/administrador/Sidebar/use-sidebar'; 

import AgregarVenta from '@/service/api/ventas/agregarVenta';
// import EditarVenta from '@/service/api/ventas/editarVenta';
// import EliminarVenta from '@/service/api/ventas/eliminarVenta';

import StatusBoton from '../catalogo/estado/estado';

import { Pencil, Trash2, Eye, MapPinCheck, MapPinPlusInside, SquareX } from "lucide-react";

import { PrecioVenta } from "../tiposFilas/compra";
import { getLocacionesDelUsuarioFind } from "@/service/api/ubicacion/todoLocacionUsuarioUnicoFind";
import { motion } from "framer-motion";
import { warn } from "console";
import { formatearFecha } from '../funcionesGlobales/formatearFecha';
import { formatearNumero } from '../funcionesGlobales/convertirMiles';

interface MunicipioPorDepartamento {
  codigoDANEDepartamento: string;
  nombreDepartamento: string;
  municipios: string[];
}

interface RegionAgrupada {
  nombreRegion: string;
  departamentos: MunicipioPorDepartamento[];
}

interface Coordenadas {
  latitud: number;
  longitud: number;
}

interface Locacion {
  departamento: string;
  ciudad: string;
  locacion: string;
  coordenadas: Coordenadas;
  identificadorLocacion: string;
}

Modal.setAppElement('#root');

interface DataTableProps {
  data: DataRowVenta[];
  setRefreshData: React.Dispatch<React.SetStateAction<boolean>>;
}

const DataTable: React.FC<DataTableProps> = ({ data, setRefreshData }) => {
  const { isSidebarOpen, toggleSidebar } = useSidebar();
  const { setModalOpen, setModalAgregar, setModalAbrirImagen } = useModal();

  const [MedidaProductoSeleccionado, setSelectedMedidaProducto] = useState<MedidaProducto>();
  const [MedidaVentaSeleccionado, setSelectedMedidaVenta] = useState<MedidaVenta>();
  const [datosMedidaVenta, setDataMedidaVenta] = useState<MedidaVentaTodoApi[]>([]);
  const [datosMedidaProducto, setDataMedidaProducto] = useState<MedidaProducto[]>([]);
  const [datosPeso, setDataPesos] = useState<interfacePeso[]>([]);

  const [ListaPesosUnicaMedida, setListaPesosUnicaMedida] = useState<interfacePeso[]>([]);

  const [UsuarioUnico, setUsuario] = useState<DataRowCliente>();
  const [datosUsuarios, setDataUsuarios] = useState<DataRowCliente[]>();

  const [datosDireccionesUsuario, setDataDireccionesUsuario] = useState<Locacion[]>();
  const [DatoLocacionCliente, setDatoLocacionCliente] = useState<Locacion | null>(null);

  const [UnidadMedidaBasePeso, setUnidadMedidaBasePeso] = useState<string>('gm');
  const [ProductoIdentificador, setProducto] = useState<string>('');
  const [PrecioVentaSeleccionado, setPrecioVenta] = useState<PrecioVenta>();
  const [PesoSeleccionado, setPesoVentaSeleccionado] = useState<interfacePeso>();

  const [direccion, setDireccion] = useState<string>('');
  const esDomingo = (date: Date) => date.getDay() !== 0;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalVisualizar, setIsModalVisualizar] = useState(false);
  const [isModalAgregar, setIsModalAgregar] = useState(false);
  const [modalData, setModalData] = useState<DetalleVentaEnviar | null>({
    medidasProducto: null,
    medidasVenta: null,
  });

  const [medidas, setMedidas] = useState<DetalleVentaEnviar>({
    medidasProducto: null,
    medidasVenta: null,
  });

  const [cantidad, setCantidad] = useState<number>();
  const [total, setTotal] = useState<number>();

  const [longitudPersonalizada, setLontitudPersonalizada] = useState<number>();
  const [anchoPersonalizada, setAnchoPersonalizada] = useState<number>();
  const [pesoPersonalizado, setPesoPersonalizado] = useState<number>();

  const [TipoLocacion, setTipoLocacion] = useState<string>('');
  const [TipoDireccion, setTipoDireccion] = useState<string>('');
  const [TipoEnvio, setTipoEnvio] = useState<string>('');
  const [direccionGuardada, setDireccionGuardada] = useState<any | null>(null);

  const [selected, setSelected] = useState<google.maps.LatLngLiteral | null>(null);
  const puntoPartidaRef = useRef<google.maps.LatLngLiteral | null>(null);
  const limiteDistancia = 70;

  const [Departamentos, setDepartamentos] = useState<RegionAgrupada[]>([]);
  const [RegionSeleccionadaNombre, setRegionSeleccionadaNombre] = useState<string>('');
  const [DepartamentoSeleccionado, setDepartamentoSeleccionado] = useState<{ identificador: string; nombre: string }>({ identificador: '', nombre: '' });
  const [MunicipioSeleccionado, setMunicipioSeleccionado] = useState<{ identificador: string; nombre: string }>({ identificador: '', nombre: '' });
 
  const [modalFormularioDireccion, setModalFormularioDireccion] = useState<boolean>(false);
  const [editando, setEditando] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);

  const [Fecha, setStarFecha] = useState<Date | null>(null);

  const itemsPorPagina = 12;
  const [paginaActual, setPaginaActual] = useState(1);

  const medidasProductoPaginacion = medidas?.medidasProducto || [];
  const medidasVentaPaginacion = medidas?.medidasVenta || [];

  const todasLasMedidas = [...medidasProductoPaginacion, ...medidasVentaPaginacion];

  const totalPaginas = Math.ceil(todasLasMedidas.length / itemsPorPagina);
  const paginado = todasLasMedidas.slice(
    (paginaActual - 1) * itemsPorPagina,
    paginaActual * itemsPorPagina
  );

  const columns: Column<DataRowVenta>[] = useMemo(
    () => [
      { 
        Header: "ID", 
        accessor: "col1", 
        Cell: ({ value }) => <div style={{ textAlign: 'center' }}>{value}</div>, 
      },
      { 
        Header: "Fecha venta", 
        accessor: "fechaVenta", 
        Cell: ({ value }) => <div style={{ textAlign: 'center' }}>{value}</div>, 
      },
      { 
        Header: "Fecha entrega", 
        accessor: "fechaEntrega", 
        Cell: ({ value }) => <div style={{ textAlign: 'center' }}>{value}</div>, 
      },
      { 
        Header: "Total", 
        accessor: "totalVenta", 
        Cell: ({ value }) => <div style={{ textAlign: 'center' }}>{formatearNumero(value)}</div>, 
      },
      { 
        Header: "Tipo venta", 
        accessor: "tipoVenta", 
        Cell: ({ value }) => <div style={{ textAlign: 'center' }}>{value}</div>, 
      },
      {
        Header: "Cliente",
        accessor: (row) => row.usuario.nombre,
        Cell: ({ cell }: { cell: { value: string } }) => (
          <div style={{ textAlign: 'center' }}>{cell.value}</div>
        ),
      },
      {
        Header: "Detalle venta",
        Cell: ({ row }) => (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <button onClick={() => abrirModalVisualizar(row.original)}>
              <Eye className="h-6 w-6 hover:text-blue-600" />
            </button>
          </div>
        ),
      },
      {
        Header: "Estado",
        accessor: "estado",
        Cell: ({ value, row }) => (          
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <StatusBoton isEnabled={value} id={row.original._id} modulo="ventas" disabled={false}/>
        </div>
        ),
      },
      {
        Header: "Eliminar",
        Cell: ({ row }) => (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <button onClick={() => eliminarVenta(row.original._id)}>
              <Trash2 className="h-6 w-6 hover:text-red-600" />
            </button>
          </div>
        ),
      },
    ],
    []
  );

  const fetchPesos = useCallback(async () => {
    try {
      const datosPeso = await getPesos();
      setDataPesos(datosPeso);
    } catch (error) {
      console.error('Error al obtener los pesos:', error);
    }
  }, []);

  const fetchMedidasProducto = useCallback(async () => {
    try {
      const medidasProducto = await getMedidaProducto();
      setDataMedidaProducto(medidasProducto);
    } catch (error) {
      console.error('Error al obtener las medidas de producto:', error);
    }
  }, []);

  const fetchUsuarios = useCallback(async () => {
    try {
      const usuarios = await getClientes();
      setDataUsuarios(usuarios);
    } catch (error) {
      console.error('Error al obtener las medidas de producto:', error);
    }
  }, []);

  const fetchDireccionUnica = useCallback(async () => {
    try {
      if(UsuarioUnico){
        const DireccionesUsuario = await getLocacionesDelUsuarioFind(UsuarioUnico?._id);
        if (DireccionesUsuario){
          setDataDireccionesUsuario(DireccionesUsuario);
        }
      } 
    } catch (error) {
      console.error('Error al obtener las medidas de producto:', error);
    }
  }, [datosDireccionesUsuario, UsuarioUnico]);

  const fetchMedidasVenta = useCallback(async () => {
    try {
      const datosMedidaVenta = await getMedidasVenta();
      setDataMedidaVenta(datosMedidaVenta);
    } catch (error) {
      console.error('Error al obtener los pesos:', error);
    }
  }, []);

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

  const openModal = useCallback(async (compra: any) => {
    let medidasProductoDatos
    if (!datosMedidaProducto || datosMedidaProducto.length === 0) {
      medidasProductoDatos = await getMedidaProducto();
    }else{
      medidasProductoDatos = datosMedidaProducto
    }

    if (compra.detalleCompra){
      const datosCompleto = compra.detalleCompra.map((detalle: { 
        color: { _id: any }; 
        medidaProducto: { _id: string }; 
      }) => ({
        ...detalle,
        color: {
          ...detalle.color,
          PrecioVenta: medidasProductoDatos
            .find((datoUnico) => datoUnico._id === detalle.medidaProducto._id)
            ?.colores.find((color) => color?._id === detalle.color._id)
            || '',
        },
        producto: medidasProductoDatos
          .find((datoUnico) => datoUnico._id === detalle.medidaProducto._id)
          ?.producto?.idProducto || '',
      }));
      if (datosCompleto) {
        setModalData(datosCompleto as DetalleVentaEnviar);
        setMedidas(datosCompleto as DetalleVentaEnviar);
      }
    
      setIsModalOpen(true);
    }

  }, [datosMedidaProducto]);
  
  const closeModal = () => {
    setCantidad(0);
    setMedidas({    
      medidasProducto: null,
      medidasVenta: null,
    });
    setIsModalOpen(false);
  };

  const abrirModalAgregar = () => {
    setIsModalAgregar(true);
  };

  const cerrarModalAgregar = () => {
    setCantidad(0);
    setMedidas({    
      medidasProducto: null,
      medidasVenta: null,
    });
    setIsModalAgregar(false);
  };

  const abrirModalVisualizar = useCallback((compra: DataRowVenta) => {
    setMedidas({
      medidasProducto: compra.detalleVenta.medidasProducto?.map((producto) => ({
        _id: producto._id || '',
        medida: producto.medida || '',
        longitud: producto.longitud || 0,
        peso: producto.peso ? producto.peso : '',
        color: producto.color || '',
        nombercolor: '',
        precioVenta: producto.precioVenta || '',
        cantidad: Number(producto.cantidad) || 0,
        total: producto.total || 0,
        producto: '',
      })) || null,
  
      medidasVenta: compra.detalleVenta.medidasVenta?.map((venta) => ({
        _id: venta._id || '',
        medida: venta.medida || '',
        longitud: venta.longitud || 0,
        peso: venta.peso || '',
        color: venta.color || '',
        nombercolor: '',
        precioVenta: venta.precioVenta || '',
        cantidad: Number(venta.cantidad) || 0,
        total: venta.total || 0,
        producto: '',
      })) || null,
    });
    setIsModalVisualizar(true);
  },[medidas]);
  
  const cerrarModalVisualizar = () => {
    setIsModalVisualizar(false);
    setCantidad(0);
    setMedidas({    
      medidasProducto: null,
      medidasVenta: null,
    });
  };

  const ObtenerDatosPeso = (IdentificadorPeso : string) => {
    const datoPesoUnico = datosPeso.find(pesoUnico => pesoUnico._id === IdentificadorPeso);
    return datoPesoUnico
  };

  const ObtenerDatosMedida =(IdentificadorMedida : string) => {
    const medidaUnicaOProducto = datosMedidaVenta.find(medida => medida._id === IdentificadorMedida);
    if (!medidaUnicaOProducto && datosMedidaProducto){
      const extramedidaUnicaOProducto = datosMedidaProducto.find(medida => medida._id === IdentificadorMedida);
      return extramedidaUnicaOProducto
    }else{
      return medidaUnicaOProducto
    }
  };

  const ObtenerNombreProducto =(IdentificadorMedida : string) => {
    const medidaUnicaOProducto = datosMedidaProducto.find(medida => medida.medidaVenta.some( (medidaVentaUnica) => medidaVentaUnica._id === IdentificadorMedida));
    if (!medidaUnicaOProducto &&datosMedidaProducto){
      const extramedidaUnicaOProducto = datosMedidaProducto.find(medida => medida._id === IdentificadorMedida);
      return extramedidaUnicaOProducto?.producto.nombreProducto
    }else{
      return medidaUnicaOProducto?.producto.nombreProducto
    }
  };

  const handleRegionSelect = (e: React.ChangeEvent<HTMLSelectElement>) =>{
    const selectedNombre = e.target.value;
    setRegionSeleccionadaNombre(selectedNombre);
    setDepartamentoSeleccionado({ identificador:'', nombre: '' });
    setMunicipioSeleccionado({ identificador:'', nombre: '' });
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

  const handleTipoLocacionSelect = (e: React.ChangeEvent<HTMLSelectElement>) =>{
    const selectedTipo = e.target.value;
    setTipoLocacion(selectedTipo);
    setDatoLocacionCliente(null);
    setSelected(null);
    setModalFormularioDireccion(false);
    setEditando(false);
    setDireccionGuardada(null);
    setRegionSeleccionadaNombre('');
    setDepartamentoSeleccionado({ identificador: '', nombre: '' });
    setMunicipioSeleccionado({ identificador: '', nombre: '' });
  };

  const filtroTiempo = (date: Date) => {
    const day = getDay(date);
    const hour = date.getHours();
    const minute = date.getMinutes();

    if (day >= 1 && day <= 5) { 
      return hour >= 7 && hour <= 17;
    } else if (day === 6) { 
      return (hour > 7 || (hour === 7 && minute >= 30)) && hour <= 11;
    }
    return false;
  };

  const obtenerPrimeraHoraDisponible = (date: Date) => {
    const day = getDay(date);
    let primeraHora;

    if (day >= 1 && day <= 5) {
      primeraHora = setHours(setMinutes(date, 0), 7);
    } else if (day === 6) {
      primeraHora = setHours(setMinutes(date, 30), 7);
    }

    return primeraHora;
  };

  const redondearCoordenadas = (coord: number, decimales: number = 6) => {
    return parseFloat(coord.toFixed(decimales));
  };

  const manejarCambioFecha = (date: Date | null) => {
    if (date) {
      const horasSeleccionadas = date.getHours();
      const minutosSeleccionados = date.getMinutes();
  
      if ((horasSeleccionadas === 0 && minutosSeleccionados === 0) || date.getDay() !== Fecha?.getDay()) {
        const primeraHora = obtenerPrimeraHoraDisponible(date);
        setStarFecha(primeraHora || date);
      } else {
        setStarFecha(date);
      }
    } else {
      setStarFecha(null);
    }
  };
  
  const calcularDistanciaEnMetros = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371000;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLng = (lng2 - lng1) * (Math.PI / 180);
  
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
  
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
    const distancia = R * c;
  
    return distancia;
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
    const municipio = MunicipioSeleccionado.nombre;
    const departamento = DepartamentoSeleccionado.nombre;
    return `${departamento}, ${municipio}, ${direccionCompleta}`;
  };

  const convertirYOrdenarPesos = useCallback ((pesos: any[], unidadBase: string): any[] => {
    const conversiones: { [unidad: string]: number } = {
      gm: 1,
      Kg: 1000,
      Tn: 1000000,
    };
  
    if (!conversiones[unidadBase]) {
      console.error("Unidad base no soportada:", unidadBase);
      return [];
    }

    const pesosConvertidos = pesos.map((peso) => {
      const factor = conversiones[peso.unidadMedida?.simbolo || 'gm'] || 1;
      const valorConvertido = peso.peso * factor / conversiones[unidadBase];
      return {
        ...peso,
        pesoConvertido: valorConvertido,
      };
    });

    pesosConvertidos.sort((a, b) => a.pesoConvertido - b.pesoConvertido);
  
    if (pesosConvertidos[0] && pesosConvertidos[0].pesoConvertido < 1) {
      pesosConvertidos.sort((a, b) => b.pesoConvertido - a.pesoConvertido);
    }
  
    return pesosConvertidos;
  },[UnidadMedidaBasePeso]);

  const handleAddressSubmit = (data: any, tipoDireccion: string) => {
    const direccionCompleta = `${data.tipoVia} ${data.numeroVia} ${data.prefijoVia} ${data.cardinalidadVia} # ${data.numeroViaCrl} ${data.prefijoViaCrl} ${data.cardinalidadViaCrl} - ${data.numeroPlaca}`;
    setTipoDireccion(tipoDireccion);
    setDireccionGuardada(data);
    setDireccion(direccionCompleta)
    obtenerCoordenadasPorDireccion(direccionCompleta);
    setEditando(false);
  };

  const eliminarVenta = async (id: string) => {
    try {
    //   const response = await EliminarVenta(id);
    //   if (response) {
    //     Swal.fire("¡Exitoso!", "¡Compra eliminada exitosamente!", "success");
    //     setRefreshData(true);
    //   } else {
    //     Swal.fire("¡Error!", "¡La compra no pudo ser eliminada!", "error");
    //   }
    } catch (error) {
      Swal.fire("¡Error!", "¡Error al eliminar la compra!", "error");
    }
  };

  //   const response = await AgregarCompra(medidas);
  //   if (response) {
  //     Swal.fire("¡Exitoso!", "¡Compra agregada exitosamente!", "success");
  //     setRefreshData(true);
  //     cerrarModalAgregar();
  //   } else {
  //     Swal.fire("¡Error!", "¡Error al agregar la compra!", "error");
  //   }
  // };

  // const handleEditarCompra = async () => {
  //   if (modalData) {
  //     const response = await EditarCompra(modalData._id, medidas);
  //     if (response) {
  //       Swal.fire("¡Exitoso!", "¡Compra editada exitosamente!", "success");
  //       setRefreshData(true);
  //       closeModal();
  //     } else {
  //       Swal.fire("¡Error!", "¡Error al editar la compra!", "error");
  //     }
  //   }
  // };

  const LimpiarDatos = () => {
    setProducto('')
    setSelectedMedidaProducto(undefined)
    setSelectedMedidaVenta(undefined)
    setPrecioVenta(undefined);
    setPesoVentaSeleccionado(undefined);
    setUnidadMedidaBasePeso('gm');
    setListaPesosUnicaMedida([]);
    setAnchoPersonalizada(undefined);
    setPesoPersonalizado(undefined);
    setLontitudPersonalizada(undefined);
    setCantidad(0);
    setTotal(0);
  };

  const handleChangeUsuario = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const nuevoUsuario = datosUsuarios?.find((usuario) => usuario._id === e.target.value);
  
      if (nuevoUsuario) {
        setUsuario(nuevoUsuario);
  
        setDatoLocacionCliente(null);
        setDataDireccionesUsuario([]);
      }
    },
    [datosUsuarios]
  );
  
  const handleChangeProducto = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setProducto(e.target.value);
    let medidasUnicaOProducto = datosMedidaProducto.filter(medida => medida.producto.idProducto === e.target.value);
    if(medidasUnicaOProducto.length === 1){
      if(medidasUnicaOProducto[0].medidaVenta.length < 1){
        setSelectedMedidaProducto(medidasUnicaOProducto[0]);
        setSelectedMedidaVenta(undefined)
        setListaPesosUnicaMedida([])
        if(medidasUnicaOProducto[0]?.colores.length === 1 && (medidasUnicaOProducto[0].colores[0].PrecioVenta.unidadMedida)){
          setPrecioVenta({
            PrecioVenta: {
              _id: medidasUnicaOProducto[0].colores[0].PrecioVenta._id,
              precioUnitario: medidasUnicaOProducto[0].colores[0].PrecioVenta.precioUnitario.toString(),
              unidadMedida: medidasUnicaOProducto[0].colores[0].PrecioVenta.unidadMedida,
              color: {
                _id: medidasUnicaOProducto[0].colores[0].PrecioVenta.color._id,
                nombreColor: medidasUnicaOProducto[0].colores[0].PrecioVenta.color.nombreColor,
              },
            }
          })
        }
      }else{
        setSelectedMedidaProducto(undefined)
        setSelectedMedidaVenta(medidasUnicaOProducto[0].medidaVenta[0]);
        setListaPesosUnicaMedida([])
        if(medidasUnicaOProducto[0].medidaVenta[0]?.colores.length === 1 && medidasUnicaOProducto[0].medidaVenta[0].colores[0].PrecioVenta.unidadMedida){
          setPrecioVenta({
            PrecioVenta: {
              _id: medidasUnicaOProducto[0].medidaVenta[0].colores[0].PrecioVenta._id,
              precioUnitario: medidasUnicaOProducto[0].medidaVenta[0].colores[0].PrecioVenta.precioUnitario.toString(),
              unidadMedida: medidasUnicaOProducto[0].medidaVenta[0].colores[0].PrecioVenta.unidadMedida,
              color: {
                _id: medidasUnicaOProducto[0].medidaVenta[0].colores[0].PrecioVenta.color._id,
                nombreColor: medidasUnicaOProducto[0].medidaVenta[0].colores[0].PrecioVenta.color.nombreColor,
              },
            }
          })
        }
      }
    }else{
      setSelectedMedidaProducto(undefined)
      setSelectedMedidaVenta(undefined)
      setPrecioVenta(undefined)
      setLontitudPersonalizada(0)
      setAnchoPersonalizada(0)
      setPesoPersonalizado(0)
      setTotal(0)
      setCantidad(0)
      setListaPesosUnicaMedida([])
    }

  }, [ProductoIdentificador, MedidaProductoSeleccionado, MedidaVentaSeleccionado, PrecioVentaSeleccionado, datosMedidaProducto, datosMedidaVenta]);

  const handleChangeMedidaProducto = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {

    let medidaUnicaOProducto = datosMedidaProducto.find(medida => medida._id === e.target.value);
    let medidaUnicaVenta2

    if (!medidaUnicaOProducto) {
      medidaUnicaOProducto = datosMedidaProducto.find(medida => medida.medidaVenta.some( (medidaVentaUnica) => medidaVentaUnica._id === e.target.value));
      const medidaUnicaVenta = medidaUnicaOProducto?.medidaVenta
      if (medidaUnicaOProducto?.medidaVenta && medidaUnicaVenta){
        medidaUnicaVenta2 = medidaUnicaVenta?.find(medida => medida._id === e.target.value);
      }
    }

    if ((medidaUnicaOProducto && !medidaUnicaVenta2) && medidaUnicaOProducto.producto !== MedidaProductoSeleccionado?.producto){
      setSelectedMedidaVenta(undefined); 
    }else if (medidaUnicaVenta2 && !medidaUnicaOProducto){
      setSelectedMedidaProducto(undefined);
    }

    if(!medidaUnicaVenta2 ||( medidaUnicaVenta2 === null || undefined) && (!medidaUnicaOProducto?.medidaVenta || medidaUnicaOProducto?.medidaVenta.length === 0)){
      setSelectedMedidaProducto(medidaUnicaOProducto);
      if(medidaUnicaOProducto?.colores.length === 1 && medidaUnicaOProducto.colores[0].PrecioVenta.unidadMedida){
        setPrecioVenta({PrecioVenta: {
          _id: medidaUnicaOProducto.colores[0].PrecioVenta._id,
          precioUnitario: medidaUnicaOProducto.colores[0].PrecioVenta.precioUnitario.toString(),
          unidadMedida: medidaUnicaOProducto.colores[0].PrecioVenta.unidadMedida,
          color: {
            _id: medidaUnicaOProducto.colores[0].PrecioVenta.color._id,
            nombreColor: medidaUnicaOProducto.colores[0].PrecioVenta.color.nombreColor,
          },
        }})
      }
    }else{
      setSelectedMedidaVenta(medidaUnicaVenta2);
      if(medidaUnicaVenta2?.colores.length === 1 && medidaUnicaVenta2.colores[0].PrecioVenta.unidadMedida){
        setPrecioVenta({PrecioVenta: {
          _id: medidaUnicaVenta2.colores[0].PrecioVenta._id,
          precioUnitario: medidaUnicaVenta2.colores[0].PrecioVenta.precioUnitario.toString(),
          unidadMedida: medidaUnicaVenta2.colores[0].PrecioVenta.unidadMedida,
          color: {
            _id: medidaUnicaVenta2.colores[0].PrecioVenta.color._id,
            nombreColor: medidaUnicaVenta2.colores[0].PrecioVenta.color.nombreColor,
          },
        }})
      }
    }

  },[MedidaProductoSeleccionado, MedidaVentaSeleccionado, datosMedidaProducto, datosMedidaVenta, PrecioVentaSeleccionado]);

  const handleChangeCantidad = (e: React.ChangeEvent<HTMLInputElement>) => { 
    const value = Math.floor(Number(e.target.value));
    if (value > 0) {
      setCantidad(value);
    }
  };

  const handleChangeLongitudPersonalizada = (e: React.ChangeEvent<HTMLInputElement>) => { 
    const value = Number(e.target.value);
    if (value > 0) {
      setLontitudPersonalizada(value);
    }
  };

  const handleChangeAnchoPersonalizado = (e: React.ChangeEvent<HTMLInputElement>) => { 
    const value = Number(e.target.value);
    if (value > 0) {
      setAnchoPersonalizada(value);
    }
  };

  const handleChangePesoPersonalizado = (e: React.ChangeEvent<HTMLInputElement>) => { 
    const value = Number(e.target.value);
    if (value > 0) {
      setPesoPersonalizado(value);
    }
  };

  const handleChangeColorPrecioVenta = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
  
    const precioVentaDatos = MedidaProductoSeleccionado?.colores.find(
      (color) => color?.PrecioVenta._id === selectedId
    );
    
    if (precioVentaDatos && precioVentaDatos !== undefined && precioVentaDatos.PrecioVenta.unidadMedida) {
      setPrecioVenta({PrecioVenta: {      
        _id: precioVentaDatos.PrecioVenta._id,
        precioUnitario: precioVentaDatos.PrecioVenta.precioUnitario.toString(),
        unidadMedida: precioVentaDatos.PrecioVenta.unidadMedida ,
        color: {
          _id: precioVentaDatos.PrecioVenta.color._id,
          nombreColor: precioVentaDatos.PrecioVenta.color.nombreColor,
        }
      }});
    }
  }, [MedidaProductoSeleccionado]);

  const handleChangeColorPrecioVentaMedidaVenta = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;

    const Color = MedidaVentaSeleccionado?.colores.find(
      (color) => color?.PrecioVenta._id === selectedId
    );

    if (Color && Color !== undefined && Color.PrecioVenta.unidadMedida) {
      setPrecioVenta({PrecioVenta: {      
        _id: Color.PrecioVenta._id,
        precioUnitario: Color.PrecioVenta.precioUnitario.toString(),
        unidadMedida: Color.PrecioVenta.unidadMedida,
        color: {
          _id: Color.PrecioVenta.color._id,
          nombreColor: Color.PrecioVenta.color.nombreColor,
        }
      }});
    }
  };

  const handleChangePesoVenta = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;

    const PesoDatos = datosPeso.find(
      (peso) => peso._id === selectedId
    );

    if (PesoDatos && PesoDatos !== undefined) {
      setPesoVentaSeleccionado(PesoDatos);
    }
  };

  const handleUnidadBaseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nuevaUnidad = e.target.value;
    setUnidadMedidaBasePeso(nuevaUnidad);
  };

  const manejarPaginaAnterior = () => {
    if (paginaActual > 1) setPaginaActual(paginaActual - 1);
  };

  const manejarPaginaSiguiente = () => {
    if (paginaActual < totalPaginas) setPaginaActual(paginaActual + 1);
  };

  const ObtenerMedidaProducto =(IdentificadorMedidaVenta : string) => {
    const medidaUnicaOProducto = datosMedidaProducto.find(medida => medida.medidaVenta.some( (medidaVentaUnica) => medidaVentaUnica._id === IdentificadorMedidaVenta));
    return medidaUnicaOProducto?.longitudMedida.valor + ' ' + medidaUnicaOProducto?.longitudMedida.unidadMedida.simbolo
  };

  const ObtenerMedidaProductoLongitud =(IdentificadorMedidaVenta : string) => {
    const medidaUnicaOProducto = datosMedidaProducto.find(medida => medida.medidaVenta.some( (medidaVentaUnica) => medidaVentaUnica._id === IdentificadorMedidaVenta));
    return medidaUnicaOProducto?.longitudMedida.valor || 1
  };

  const agregarVenta = useCallback(async () => {
    try {
        let listaDetalle: DetalleVenta = {
            medidasProducto: [],
            medidasVenta: [],
        };

        if (medidas?.medidasProducto){
            medidas?.medidasProducto.forEach((medidaProducto: MedidaProductoEnviar) => {
                if (listaDetalle && listaDetalle.medidasProducto) {
                  const datosMedida = medidaProducto._id ? ObtenerDatosMedida(medidaProducto._id) : undefined;
                    listaDetalle.medidasProducto.push({
                        _id: medidaProducto._id,
                        medida: medidaProducto.medida,
                        longitud: medidaProducto.longitud,
                        peso: datosMedida && datosMedida?.peso?.valores?.length > 1
                        ? medidaProducto.peso
                        : datosMedida?.peso?.valores?.[0]?._id || medidaProducto.peso,
                        color: medidaProducto.color,
                        cantidad: medidaProducto.cantidad.toString(),
                        total: medidaProducto.total,
                        precioVenta: medidaProducto.precioVenta,
                    });
                }
            });
        }

        if (medidas?.medidasVenta){
            medidas?.medidasVenta.forEach((medidaVenta: MedidaVentaEnviar) => {
                if (listaDetalle && listaDetalle.medidasVenta){
                  const datosMedida = medidaVenta._id ? ObtenerDatosMedida(medidaVenta._id) : undefined;
                    listaDetalle.medidasVenta.push({
                        _id: medidaVenta._id,
                        medida: medidaVenta.medida,
                        longitud: medidaVenta.longitud,
                        peso: datosMedida && datosMedida?.peso?.valores?.length > 1
                        ? medidaVenta.peso
                        : datosMedida?.peso?.valores?.[0]?._id || medidaVenta.peso,

                        color: medidaVenta.color,
                        cantidad: medidaVenta.cantidad.toString(),
                        total: medidaVenta.total,
                        precioVenta: medidaVenta.precioVenta,
                    });   
                }
            });
        }

        if (
          (
            listaDetalle 
            && 
            ( 
              ( listaDetalle.medidasVenta && listaDetalle.medidasVenta.length > 0 )
              ||
              ( listaDetalle.medidasProducto && listaDetalle.medidasProducto.length > 0 )
            ) 
          )
          &&
          (
            TipoEnvio && 
            (
              (
                TipoEnvio === 'enviar' 
                &&
                (
                  TipoLocacion && 
                  (
                    (TipoLocacion === 'SELECCIONAR' && DatoLocacionCliente) 
                    ||
                    (TipoLocacion === 'CREAR' && direccion)
                  )
                )
              )
              ||
              TipoEnvio === 'recoger'
            )
          )
          && 
          (
            UsuarioUnico
            &&
            Fecha
          )
        ) {
            const venta = await AgregarVenta(
              Fecha,
              DatoLocacionCliente ? DatoLocacionCliente.identificadorLocacion : direccion,
              selected ? selected : undefined,
              DepartamentoSeleccionado ? DepartamentoSeleccionado.nombre : '',
              MunicipioSeleccionado.nombre ? MunicipioSeleccionado.nombre : '',
              TipoEnvio,
              UsuarioUnico.correo,
              listaDetalle,
              DatoLocacionCliente ? false : true
            );
            if (venta && venta.status === 200) {

              Swal.fire({
                title: '¡Exito!',
                text: '¡La venta pudo ser guardada.!',
                icon: 'success',
                timerProgressBar: true,
                timer: 1500,
                showConfirmButton: false,
              });

              cerrarModalAgregar();
              setRefreshData(true);
              setCantidad(0);
              setMedidas({    
                medidasProducto: null,
                medidasVenta: null,
              });
              LimpiarDatos();
            }else{
              Swal.fire({
                title: '¡Error!',
                text: '¡Parece que la venta no pudo ser guardada.!',
                icon: 'error',
                timerProgressBar: true,
                timer: 1500,
                showConfirmButton: false,
              });
            }
        }
    } catch (error) {
      console.error('Error al agregar la compra:', error);
    }
  }, [medidas, TipoEnvio, UsuarioUnico, MunicipioSeleccionado, DepartamentoSeleccionado, selected, direccionGuardada]);

  const convertirDecimalAFraccion = (valor: number): string => {
    const parteEntera = Math.floor(valor);
    const parteDecimal = valor - parteEntera;

    if (parteDecimal === 0) {
        return parteEntera.toString();
    }

    const decimalStr = parteDecimal.toString().split('.')[1];
    let denominador = Math.pow(10, decimalStr.length);
    let numerador = Math.round(parteDecimal * denominador);
    const calcularMCD = (a: number, b: number): number => {
        return b === 0 ? a : calcularMCD(b, a % b);
    };

    const mcd = calcularMCD(numerador, denominador);
    numerador /= mcd;
    denominador /= mcd;

    return parteEntera > 0 ? `${parteEntera} ${numerador}/${denominador}` : `${numerador}/${denominador}`;
  };

  useEffect(() => {
    fetchPesos();
    fetchMedidasProducto();
    fetchMedidasVenta();
    fetchUsuarios();
    obtenerDepartamentosRegiones();
  }, []);

  useEffect(() => {
    fetchDireccionUnica();
  }, [UsuarioUnico]);

  useEffect(() => {
    if (selected && puntoPartidaRef.current) {
      const distancia = calcularDistanciaEnMetros(
        puntoPartidaRef.current.lat,
        puntoPartidaRef.current.lng,
        selected.lat,
        selected.lng
      );
    }
  }, [selected]);

  useEffect(() => {
    if (DatoLocacionCliente) {
      const { departamento, ciudad } = DatoLocacionCliente;

      const regionEncontrada = Departamentos.find(region => 
        region.departamentos.some(dep => dep.nombreDepartamento === departamento)
      );

      if (regionEncontrada) {
        setRegionSeleccionadaNombre(regionEncontrada.nombreRegion);

        const departamentoEncontrado = regionEncontrada.departamentos.find(dep => dep.nombreDepartamento === departamento);

        if (departamentoEncontrado) {
          setDepartamentoSeleccionado({ identificador: departamentoEncontrado.codigoDANEDepartamento, nombre: departamento });

          const municipioEncontrado = departamentoEncontrado.municipios.find(municipio => municipio === ciudad);

          if (municipioEncontrado) {
            setMunicipioSeleccionado({ identificador: municipioEncontrado, nombre: ciudad });
          }
          setDireccionGuardada(DatoLocacionCliente.locacion)
          setSelected({lat : DatoLocacionCliente.coordenadas.latitud, lng : DatoLocacionCliente.coordenadas.longitud})
        }
      }
    }
  }, [DatoLocacionCliente, Departamentos]);
  
  useEffect(() => {
    setModalOpen(isModalOpen);
  }, [isModalOpen, setModalOpen]);

  useEffect(() => {
    setModalAgregar(isModalAgregar);
  }, [isModalAgregar, setModalAgregar]);

  useEffect(() => {
    setModalAbrirImagen(isModalVisualizar);
  }, [isModalVisualizar, setModalAbrirImagen]);
  
  useEffect(() => {
    if(PrecioVentaSeleccionado && ((cantidad && cantidad > 0) || (pesoPersonalizado && PrecioVentaSeleccionado.PrecioVenta.unidadMedida.simbolo === 'Kg'))){
      let total = 0;
      if (PrecioVentaSeleccionado.PrecioVenta.unidadMedida.simbolo === 'Kg' && ( pesoPersonalizado && pesoPersonalizado > 0)){
        total= pesoPersonalizado * Number(PrecioVentaSeleccionado.PrecioVenta.precioUnitario)
      }else if ((PrecioVentaSeleccionado.PrecioVenta.unidadMedida.simbolo === 'Mt²' && (anchoPersonalizada && longitudPersonalizada)) && cantidad ){
        total= ((anchoPersonalizada * longitudPersonalizada) * Number(PrecioVentaSeleccionado.PrecioVenta.precioUnitario)) * cantidad
      }else if (PrecioVentaSeleccionado.PrecioVenta.unidadMedida.simbolo === '½' ){
        if (MedidaProductoSeleccionado && cantidad){
          total = ((MedidaProductoSeleccionado?.longitudMedida.valor * 2) * Number(PrecioVentaSeleccionado.PrecioVenta.precioUnitario) ) * cantidad
        }else if (MedidaVentaSeleccionado && cantidad){
          total = ((MedidaVentaSeleccionado?.longitudMedida.valor * 2) * Number(PrecioVentaSeleccionado.PrecioVenta.precioUnitario) * ObtenerMedidaProductoLongitud(MedidaVentaSeleccionado._id)) * cantidad
        }
      }else if ((PrecioVentaSeleccionado.PrecioVenta.unidadMedida.simbolo === 'YD' || PrecioVentaSeleccionado.PrecioVenta.unidadMedida.simbolo === 'mt') && cantidad){
        if (MedidaProductoSeleccionado){
          total= cantidad * (Number(PrecioVentaSeleccionado.PrecioVenta.precioUnitario) * MedidaProductoSeleccionado?.longitudMedida.valor)
        }else if (MedidaVentaSeleccionado){
          total= cantidad * (Number(PrecioVentaSeleccionado.PrecioVenta.precioUnitario) * MedidaVentaSeleccionado?.longitudMedida.valor)
        }
      }else if ((PrecioVentaSeleccionado.PrecioVenta.unidadMedida.simbolo === 'gm' || PrecioVentaSeleccionado.PrecioVenta.unidadMedida.simbolo === 'Kg' || PrecioVentaSeleccionado.PrecioVenta.unidadMedida.simbolo === 'Tn') || (anchoPersonalizada && longitudPersonalizada) ){
        if (PesoSeleccionado?.peso && cantidad){
          total= (PesoSeleccionado?.peso * Number(PrecioVentaSeleccionado.PrecioVenta.precioUnitario)) * cantidad
        }else if (anchoPersonalizada && longitudPersonalizada && cantidad){
          total= ((anchoPersonalizada * longitudPersonalizada) * Number(PrecioVentaSeleccionado.PrecioVenta.precioUnitario)) * cantidad
        }
      }
      setTotal(total);
    }
    
  }, [PrecioVentaSeleccionado, cantidad, MedidaProductoSeleccionado, PesoSeleccionado, pesoPersonalizado, anchoPersonalizada, longitudPersonalizada]);

  useEffect(() => {
    if (datosPeso) {
      if (MedidaProductoSeleccionado || MedidaVentaSeleccionado) {
        let listaPesos: interfacePeso[] = []
        if (MedidaProductoSeleccionado && !MedidaVentaSeleccionado){
          const datos = MedidaProductoSeleccionado.peso.valores.map((pesoUnico) => {
            const encontrado = datosPeso.find((pesoDatoUnico) => {
              return pesoUnico._id === pesoDatoUnico._id;
            });
        
            return encontrado;
          });
          if (datos) {
            datos.forEach((dato) => {
              if (dato?.peso) {
                listaPesos.push(dato);
              }
            });
          }
        }else if (MedidaVentaSeleccionado && !MedidaProductoSeleccionado) {
          const datos = MedidaVentaSeleccionado.peso.valores.map((pesoUnico) => {
            const encontrado = datosPeso.find((pesoDatoUnico) => {
              return pesoUnico.valor._id == pesoDatoUnico._id;
            });
            return encontrado;
          });
          if (datos) {
            datos.forEach((dato) => {
              if (dato?.peso) {
                listaPesos.push(dato);
              }
            });
          }
        }
          
        if(listaPesos){
          setListaPesosUnicaMedida(listaPesos);
        }
      }
    }
  }, [MedidaProductoSeleccionado, MedidaVentaSeleccionado, datosPeso]);;

  useEffect(() => {
    if (anchoPersonalizada && longitudPersonalizada && PrecioVentaSeleccionado) {
      const unidadMedida = PrecioVentaSeleccionado?.PrecioVenta.unidadMedida.simbolo;
      const maximaLongitud =
        MedidaProductoSeleccionado?.longitudMedida.valor ||
        MedidaVentaSeleccionado?.longitudMedida.valor;
      
      if (unidadMedida === "Mt²" && maximaLongitud) {
        const areaActual = anchoPersonalizada * longitudPersonalizada;

        if (areaActual > maximaLongitud) {

          let nuevoAncho = anchoPersonalizada;
          let nuevaLongitud = longitudPersonalizada;

          const factorCorreccion = Math.sqrt(maximaLongitud / areaActual);
          nuevoAncho = Math.max(1, Math.floor(nuevoAncho * factorCorreccion));
          nuevaLongitud = Math.max(1, Math.floor(nuevaLongitud * factorCorreccion));

          setAnchoPersonalizada(nuevoAncho);
          setLontitudPersonalizada(nuevaLongitud);
  
        }
      }
    }
  }, [anchoPersonalizada, longitudPersonalizada, PrecioVentaSeleccionado]);
  
  return (
    <div style={{ padding: "20px" }}>
      <button type="button" className="botonAgregado"  onClick={abrirModalAgregar}>Agregar</button>
      <Table<DataRowVenta> columns={columns} data={data} setRefreshData={setRefreshData} />

      <Modal
        isOpen={isModalOpen || isModalAgregar}
        onRequestClose={isModalOpen ? closeModal : cerrarModalAgregar}
        className="ModalDashboard"
        overlayClassName="Overlay"
        contentLabel="Modal Venta" 
      >
        <div className="ModalDashboard" style={{maxHeight: MedidaProductoSeleccionado || (PrecioVentaSeleccionado || ListaPesosUnicaMedida) ?  '840px': '560px', marginTop:'50px'}}>
          
          <div className="FormContent" style={{maxHeight: (TipoEnvio === 'recoger' || TipoEnvio === '') ? '350px' : '420px', maxWidth:'400px', minWidth:'300px'}}>
            <h2 className="titleSinFondoModal">Datos Cliente</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              {datosUsuarios && datosUsuarios.length > 0  && 
                <>
                  <label htmlFor="proveedor-select" className="LabelModal">Usuarios</label>
                  <select
                    id="proveedor-select"
                    className="selectModal"
                    value={UsuarioUnico?._id || ""}
                    onChange={handleChangeUsuario}
                  >
                    <option value="" disabled>Selecciona un usuario</option>
                    {datosUsuarios.map((usuario) => (
                      <option key={usuario._id} value={usuario._id}>
                        {usuario.nombre + ' ' + `(${usuario.rol.nombreRol})`}
                      </option>
                    ))}
                  </select>
                </>
              }

              <div className="grid grid-cols-2 md:grid-cols-2 gap-4 mb-4">
                <div className="grid grid-item">
                  <p><strong>Fecha Envio</strong></p>
                  <DatePicker
                    selected={Fecha}
                    onChange={(date: Date | null) => manejarCambioFecha(date)}
                    placeholderText="Selecciona una fecha y hora"
                    className="border border-gray-300 rounded px-4 py-2 w-full"
                    minDate={addDays(new Date(), 6)}
                    filterDate={esDomingo}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    timeCaption="Hora"
                    filterTime={filtroTiempo}
                    dateFormat="MMMM d, yyyy h:mm aa"
                  />
                </div>

                { TipoEnvio !== '' && TipoEnvio !== 'recoger' && (
                  <div className="grid grid-item">
                    <p><strong>Precio de envío</strong></p>
                    <input
                      type="text"
                      value={10000} 
                      placeholder="Precio envio"
                      className="border border-gray-300 rounded px-4 py-2 w-full"
                      disabled
                    />
                  </div>
                )}

                <div className="grid grid-item">
                  <p><strong>Subtotal</strong></p>
                  <input
                    type="text"
                    value={10000}
                    placeholder="Total"
                    className="border border-gray-300 rounded px-4 py-2 w-full"
                    disabled
                  />
                </div>

                <div className="grid grid-item">
                  <p><strong>Tipo de envío</strong></p>
                  <select
                    className="border border-gray-300 rounded px-4 py-2 w-full"
                    value={TipoEnvio}
                    onChange={(e) => setTipoEnvio(e.target.value)}
                  >
                    <option value="" disabled>Selecciona una opción</option>
                    <option value="recoger">Recoger en la empresa</option>
                    <option value="enviar">Enviar a una dirección</option>
                  </select>
                </div>

                {TipoEnvio !== '' && TipoEnvio !== 'recoger' && Departamentos && Departamentos.length > 0 && (
                  <>
                  <div className="grid grid-item">
                    <p><strong>Tipos de locación</strong></p>
                    <motion.select
                      name="region"
                      id="region"
                      className="border border-gray-300 rounded px-4 py-2 w-full"
                      onFocus={() => setIsSelecting(true)}
                      onBlur={() => setIsSelecting(false)}
                      onChange={(e) => handleTipoLocacionSelect(e)}
                      style={{ width: "95%", margin: "auto" }}
                      value={TipoLocacion}
                    >
                      <option value="" disabled>Seleccione un tipo de locación</option>
                      <option value="SELECCIONAR" >Seleccione una locación</option>
                      <option value="CREAR" >Crear una locación</option>
                    </motion.select>
                    </div>
                  </>
                )}

                {TipoEnvio !== '' && TipoEnvio !== 'recoger' && Departamentos && Departamentos.length > 0 && TipoLocacion === 'SELECCIONAR' && datosDireccionesUsuario && datosDireccionesUsuario.length > 0 && (
                  <>
                  <div className="grid grid-item">
                    <p><strong>Locaciones</strong></p>
                    <motion.select
                      name="region"
                      id="region"
                      className="border border-gray-300 rounded px-4 py-2 w-full"
                      onFocus={() => setIsSelecting(true)}
                      onBlur={() => setIsSelecting(false)}
                      onChange={(e) => setDatoLocacionCliente(datosDireccionesUsuario.find(locacion => locacion.locacion === e.target.value) || null)}
                      style={{ width: "95%", margin: "auto" }}
                      value={DatoLocacionCliente?.locacion || ""}
                    >
                      <option value="" disabled>Seleccione una locación</option>
                      {datosDireccionesUsuario.map((locacion: Locacion) => (
                        <option 
                          key={`${locacion.coordenadas.latitud}-${locacion.coordenadas.longitud}`} 
                          value={locacion.locacion}
                        >
                          {`${locacion.departamento} - ${locacion.ciudad}: ${locacion.locacion}`}
                        </option>
                      ))}
                    </motion.select>
                    </div>
                  </>
                )}

                { TipoEnvio === 'enviar' && TipoLocacion === 'CREAR' && (
                  <>
                  <div className="grid grid-item">
                    <p><strong>{direccion !== '' ? 'Generar dirección' : 'Editar dirección'}</strong></p>
                    <input
                      type="text"
                      id="direccionResumen"
                      placeholder="Dirección resumen"
                      onClick={abrirFormularioDireccion}
                      value={direccionGuardada ? obtenerDireccionFormateada(direccionGuardada) : ''}
                      onChange={() => { } }
                      required
                      readOnly={direccion !== ''}
                      className="border border-gray-300 rounded px-4 py-2 w-full"
                      style={{ cursor: direccion !== '' ? 'pointer' : 'text' }} />
                    </div>
                  </>
                )}
              </div>
            </form>
          </div>

          <div className="FormContent" style={{maxWidth: '400px', 
          maxHeight: (
            ProductoIdentificador 
            &&             
            (PrecioVentaSeleccionado?.PrecioVenta._id === undefined && 
              (MedidaProductoSeleccionado?._id === undefined && MedidaVentaSeleccionado?._id === undefined)
            )
            && 
            ((PrecioVentaSeleccionado && PrecioVentaSeleccionado.PrecioVenta.unidadMedida.simbolo !== 'Mt²') || !PrecioVentaSeleccionado) 
            ?
            '500px'
            : 
            (
              (MedidaProductoSeleccionado && MedidaProductoSeleccionado.colores.length === 1 || 0) 
              || 
              (MedidaVentaSeleccionado && MedidaProductoSeleccionado?.colores.length === 1 || 0)
            )
            && 
            ((PrecioVentaSeleccionado && PrecioVentaSeleccionado.PrecioVenta.unidadMedida.simbolo !== 'Mt²') || !PrecioVentaSeleccionado) 
            ?  
            '500px' 
            : 
            (
              (MedidaProductoSeleccionado && (MedidaProductoSeleccionado.peso.valores.length === 1 || 0)) 
              || 
              (MedidaVentaSeleccionado &&( MedidaVentaSeleccionado?.peso.valores.length === 1 || 0))
            ) 
            && 
            ((PrecioVentaSeleccionado && PrecioVentaSeleccionado.PrecioVenta.unidadMedida.simbolo !== 'Mt²') || !PrecioVentaSeleccionado) 
            ? 
            '550px' 
            : 
            ' 640px')}}>
            <h2 className="titleSinFondoModal">{isModalAgregar ? "Datos de Venta" : "Editar Datos de Venta"}</h2>
            <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!ProductoIdentificador){
                    return false;
                  }
                  if (!MedidaProductoSeleccionado && !MedidaVentaSeleccionado){
                    return false;
                  }
                  if (!PrecioVentaSeleccionado){
                    return false;
                  }
                  if ((!cantidad || cantidad == 0) && (!pesoPersonalizado || pesoPersonalizado == 0)){
                    return false;
                  }
                  
                  if (!total || total == 0){
                    return false;
                  }
  
                  const datosPeso = !pesoPersonalizado && PesoSeleccionado
                  ?  PesoSeleccionado?._id
                  : pesoPersonalizado ? {
                      valor: pesoPersonalizado?? 0,
                      unidad: PrecioVentaSeleccionado?.PrecioVenta.unidadMedida._id ?? '',
                    } : '';
                  const cantidadIngresar = (cantidad && pesoPersonalizado) ? 1 : cantidad ? cantidad : 1;

                  const nuevaMedida: MedidaVentaEnviar = {
                    _id: (MedidaProductoSeleccionado?._id || MedidaVentaSeleccionado?._id) || '',
                    medida: (MedidaProductoSeleccionado?._id || MedidaVentaSeleccionado?._id) || '',
                    longitud: anchoPersonalizada && longitudPersonalizada ? { 
                      ancho: anchoPersonalizada,
                      largo: longitudPersonalizada,
                    } : 0,
                    peso: datosPeso || '' ,
                    color: PrecioVentaSeleccionado.PrecioVenta.color._id,
                    nombercolor: PrecioVentaSeleccionado.PrecioVenta.color.nombreColor,
                    precioVenta: PrecioVentaSeleccionado.PrecioVenta._id,
                    cantidad: cantidadIngresar,
                    total: total,
                    producto: ProductoIdentificador,
                  };

                  const existeProducto = (lista: MedidaVentaEnviar[]) =>
                    lista.some(
                      (item) =>
                        item.producto === nuevaMedida.producto &&
                        item.color === nuevaMedida.color &&
                        item.medida === nuevaMedida.medida &&
                        JSON.stringify(item.longitud) === JSON.stringify(nuevaMedida.longitud) &&
                        item.peso === nuevaMedida.peso
                    );

                    if (MedidaProductoSeleccionado && nuevaMedida) {
                      setMedidas((medidasAnteriores) => {
                        const medidasProducto = medidasAnteriores?.medidasProducto || [];
                        if (existeProducto(medidasProducto)) {
                          console.log('El producto ya existe en medidasProducto.');
                          return medidasAnteriores;
                        }
                    
                        return {
                          ...medidasAnteriores,
                          medidasProducto: [...medidasProducto, nuevaMedida],
                        };
                      });
                    } else if (MedidaVentaSeleccionado && nuevaMedida) {
                      setMedidas((medidasAnteriores) => {
                        const medidasVenta = medidasAnteriores?.medidasVenta || [];
                        if (existeProducto(medidasVenta)) {
                          console.log('El producto ya existe en medidasVenta.');
                          return medidasAnteriores;
                        }
                    
                        return {
                          ...medidasAnteriores,
                          medidasVenta: [...medidasVenta, nuevaMedida],
                        };
                      });
                    }
                }}
            >

              <label htmlFor="producto-select" className="LabelModal">Productos</label>
              <ProductoSelectXmedidaProducto
                datosMedidaProducto={datosMedidaProducto || []}
                handleChangeProducto={handleChangeProducto}
                ProductoSeleccionado={ProductoIdentificador}
              />

              {ProductoIdentificador !== '' && (
                <>
                  <label htmlFor="medida-producto-select" className="LabelModal">Medidas de producto</label>
                  <select
                    id="medida-producto-select"
                    className="selectModal"
                    value={MedidaProductoSeleccionado?._id && (!MedidaProductoSeleccionado.medidaVenta || MedidaProductoSeleccionado.medidaVenta.length === 0)  ? MedidaProductoSeleccionado?._id : MedidaVentaSeleccionado?._id || ""}
                    onChange={handleChangeMedidaProducto}
                  >
                    <option value="" disabled>Selecciona una medida producto</option>

                    {datosMedidaProducto
                      .filter(medidaProducto => medidaProducto.producto.idProducto === ProductoIdentificador)
                      .flatMap(medidaProducto => 
                        !medidaProducto.medidaVenta || medidaProducto.medidaVenta.length === 0
                          ? [{
                              _id: medidaProducto._id,
                              longitud: medidaProducto.longitudMedida?.valor || 0,
                              unidad: medidaProducto.longitudMedida?.unidadMedida?.simbolo || '',
                              producto: 0,
                              tipo: 'producto',
                            }]
                          : medidaProducto.medidaVenta.map(medidaVenta => ({
                              _id: medidaVenta._id,
                              longitud: medidaVenta.longitudMedida?.valor || 0,
                              unidad: medidaVenta.longitudMedida?.unidadMedida?.simbolo || '',
                              producto: ObtenerMedidaProductoLongitud(medidaVenta._id),
                              tipo: 'venta',
                            }))
                      )
                      .sort((a, b) => {
                        if (a.longitud !== b.longitud && a.unidad !== '½' && b.unidad !== '½') {
                          return a.longitud - b.longitud;
                        }
                      
                        if ( a.producto && b.producto && a.producto !== b.producto) {
                          return a.producto - b.producto;
                        }
                      
                        return 0;
                      })
                      .map(({ _id, longitud, unidad, tipo }) => (
                        <option key={_id} value={_id}>
                          {`${unidad === '½' ? convertirDecimalAFraccion(longitud) + ' x ' + ObtenerMedidaProducto(_id) : longitud + ' ' + unidad}  ${tipo === 'producto' ? '' : '(Medida venta)'}`}
                        </option>
                      ))}
                  </select>
                </>
              )}

              {ProductoIdentificador !== '' && MedidaProductoSeleccionado && MedidaProductoSeleccionado.colores.length > 1 && (
                <>
                  <label htmlFor="precioVenta-select" className="LabelModal">Colores de medida</label>
                  <select
                    id="precioVenta-select"
                    className="selectModal"
                    value={PrecioVentaSeleccionado?.PrecioVenta._id || ""}
                    onChange={handleChangeColorPrecioVenta}
                  >
                    <option value="" disabled>Selecciona un color</option>
                    {MedidaProductoSeleccionado.colores.map(medidaProductoColor => (
                      <option key={medidaProductoColor.PrecioVenta._id} value={medidaProductoColor.PrecioVenta._id}>
                        {medidaProductoColor.PrecioVenta.color.nombreColor}
                      </option>
                    ))}
                  </select>
                </>
              )}

              {ProductoIdentificador !== '' && MedidaVentaSeleccionado && MedidaVentaSeleccionado.colores.length > 1 && (
                <>
                  <label htmlFor="precioVenta-select" className="LabelModal">Colores de medida</label>
                  <select
                    id="precioVenta-select"
                    className="selectModal"
                    value={PrecioVentaSeleccionado?.PrecioVenta._id || ""}
                    onChange={handleChangeColorPrecioVentaMedidaVenta}
                  >
                    <option value="" disabled>Selecciona un color</option>
                    {MedidaVentaSeleccionado.colores.map(medidaVentaColor => (
                      <option key={medidaVentaColor.PrecioVenta._id} value={medidaVentaColor.PrecioVenta._id}>
                        {medidaVentaColor.PrecioVenta.color.nombreColor}
                      </option>
                    ))}
                  </select>
                </>
              )}

              {(ProductoIdentificador !== '' && 
                (
                  ( MedidaProductoSeleccionado && MedidaProductoSeleccionado?.peso.valores.length > 1 ) 
                  || 
                  ( MedidaVentaSeleccionado && MedidaVentaSeleccionado?.peso.valores.length > 1 )
                ) 
                &&
                ListaPesosUnicaMedida && 
                (
                  <>
                    <label htmlFor="precioVenta-select" className="LabelModal">Pesos de medida</label>
                    <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                      <label>
                        <input
                          type="radio"
                          name="unidadBase"
                          value="gm"
                          checked={UnidadMedidaBasePeso === "gm"}
                          onChange={handleUnidadBaseChange}
                        />
                        Gramos (g)
                      </label>
                      <label>
                        <input
                          type="radio"
                          name="unidadBase"
                          value="Kg"
                          checked={UnidadMedidaBasePeso === "Kg"}
                          onChange={handleUnidadBaseChange}
                        />
                        Kilogramos (kg)
                      </label>
                      <label>
                        <input
                          type="radio"
                          name="unidadBase"
                          value="Tn"
                          checked={UnidadMedidaBasePeso === "Tn"}
                          onChange={handleUnidadBaseChange}
                        />
                        Toneladas (t)
                      </label>
                    </div>
                    <select
                      id="precioVenta-select"
                      className="selectModal"
                      value={PesoSeleccionado?._id || ""}
                      onChange={handleChangePesoVenta}
                    >
                      <option value="" disabled>Selecciona un peso</option>
                      {convertirYOrdenarPesos(ListaPesosUnicaMedida, UnidadMedidaBasePeso !== '' ? UnidadMedidaBasePeso : 'gm').map((PesoValor) => (
                        <option key={PesoValor._id} value={PesoValor._id}>
                          {PesoValor.pesoConvertido + ' ' + (UnidadMedidaBasePeso || "gm")}
                        </option>
                      ))}
                    </select>
                  </>
                )
              )}

              { PrecioVentaSeleccionado?.PrecioVenta.unidadMedida.simbolo === 'Mt²' && (
                <>
                  <InputFormato nombreInput="Ancho" tipoInput="number" nameInput="ancho" handleChangeCantidad={handleChangeLongitudPersonalizada} valor={longitudPersonalizada || ''} />

                  <InputFormato nombreInput="Largo" tipoInput="number" nameInput="largo" handleChangeCantidad={handleChangeAnchoPersonalizado} valor={anchoPersonalizada || ''} />
                </>
              )}

              { PrecioVentaSeleccionado?.PrecioVenta.unidadMedida.simbolo === 'Kg' && (
                <>
                  <InputFormato nombreInput="Kilogramos" tipoInput="number" nameInput="kilogramos" handleChangeCantidad={handleChangePesoPersonalizado} valor={pesoPersonalizado || ''} />
                </>
              )}

              { PrecioVentaSeleccionado?.PrecioVenta.unidadMedida.simbolo !== 'Kg' && (
                <>
                 <InputFormato nombreInput="Cantidad" tipoInput="number" nameInput="cantidad" handleChangeCantidad={handleChangeCantidad} valor={cantidad || ''} />
                </>
              )}
              
              <InputFormato nombreInput="Total" tipoInput="number" nameInput="total" handleChangeCantidad={handleChangeCantidad} valor={total || ''} disabled={true}/>

              <div style={{ display: 'flex', gap: '10px'}}>
                <button type="submit" className="botonEditarModal" style={{maxHeight: medidas && (medidas?.medidasProducto && medidas?.medidasProducto?.length > 0 || medidas?.medidasVenta && medidas?.medidasVenta?.length > 0) ? '55px' : '50px', margin:'auto 0', textAlign:'center'}}>
                  {isModalAgregar ? "Agregar medida" : "Guardar"}
                </button>
                {medidas && (medidas?.medidasProducto && medidas?.medidasProducto?.length > 0 || medidas?.medidasVenta && medidas?.medidasVenta?.length > 0) &&
                <>
                  <button type="button" onClick={agregarVenta} className="botonEditarModal" style={{maxHeight:'60px'}}>
                    Finalizar compra
                  </button>
                </>
                }
                <button type="button" onClick={isModalAgregar ? cerrarModalAgregar : closeModal} className="CerrarModalBotonGeneral" style={{maxHeight:'40px', margin:'auto 0', padding:'10px 20px'}}>
                  Cerrar
                </button>
              </div>
            </form>
          </div>

          {medidas && (medidas?.medidasProducto && medidas?.medidasProducto?.length > 0 || medidas?.medidasVenta && medidas?.medidasVenta?.length > 0) && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "240px" }}>
              <div className="ImageContent" style={{ width: '350px', transform: 'scale(0.9)', transformOrigin: 'top left' }}>
                <MedidaVentaSelect
                  DatoCompletosMedida={medidas}
                  onSelect={(datosSelect) => {
                      setMedidas(datosSelect);
                  }}
                />
              </div>
            </div>
          )}

        </div>
      </Modal>

      <Modal
        isOpen={isModalVisualizar}
        onRequestClose={cerrarModalVisualizar}
        contentLabel="Edit Modal"
        className="ModalDashboard"
        overlayClassName="Overlay"
      >
        <div className="ModalDashboard">
          <div className="FormContent" style={{marginTop:'60px', maxHeight:'700px'}}>

          <div
            style={{
              position: 'relative',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              height: '100%',
            }}
          >
            <button
              onClick={cerrarModalVisualizar}
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <SquareX className="h-6 w-6 hover:text-red-600" />
            </button>

            <h2 className="titleSinFondoModal" style={{ textAlign: 'center' }}>
              <strong>Detalle Venta</strong>
            </h2>
          </div>

            <div
              id="DivGeneralVisualizarDatosVentas"
              key={'entradaDivVisualizarDatosVentas'}
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${paginado.length === 9 ? 3 : paginado.length === 6 ? 2 :  paginado.length === 4 ? 2 :paginado.length === 3 || paginado.length === 1 || paginado.length === 2  ? 1 : 4}, 1fr)`,
                gap: '20px',
                alignItems: "center",
                textAlign: 'center',
              }}
            >
              {paginado && paginado?.map((medidaProducto, index) => (
                <div key={medidaProducto._id +' ' + index} className="precio-edit-form">
                  <ul>
                    <li><h1><strong>{ObtenerNombreProducto(medidaProducto.medida)}</strong></h1></li>
                    <li><strong>Medida:</strong> {(typeof medidaProducto.longitud === 'object' ? medidaProducto.longitud.ancho* medidaProducto.longitud.largo : medidaProducto.longitud === 0 ? ObtenerDatosMedida(medidaProducto.medida)?.longitudMedida.valor : medidaProducto.longitud ) + ' ' + ObtenerDatosMedida(medidaProducto.medida)?.longitudMedida.unidadMedida.simbolo}</li>
                    <li><strong>Cantidad:</strong> {medidaProducto.cantidad}</li>
                    {medidaProducto.peso &&
                      <li><strong>Peso:</strong> {typeof medidaProducto.peso === 'object' ? 
                        medidaProducto.peso.valor 
                        : 
                        ObtenerDatosPeso(medidaProducto.peso)?.peso + ' ' + ObtenerDatosPeso(medidaProducto.peso)?.unidadMedida?.simbolo || 'Color no disponible'}</li> 
                    }
                    
                    <li>
                      <strong>Color: </strong> 
                      {ObtenerDatosMedida(medidaProducto.medida)?.colores
                        .find(color => color.PrecioVenta.color._id === medidaProducto.color)?.PrecioVenta.color.nombreColor || 'Color no disponible'}
                    </li>
                    <li><strong>SubTotal:</strong> {formatearNumero(medidaProducto.total)}</li>
                  </ul>
                </div>
              ))}
            </div>
            { totalPaginas > 1 &&
              <>
                <div className="pagination-container" 
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                    height: '100%',
                  }}
                >
                  <button onClick={manejarPaginaAnterior} className={`pagination-button ${paginaActual === 1 ? 'active' : ''}`} disabled={paginaActual === 1}>
                    Anterior
                  </button>
                  <div 
                    style={{
                      flexDirection: 'column', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      textAlign: 'center', 
                    }}
                  >
                    <span>
                      Página
                    </span>
                    <br />
                    <span>
                      {paginaActual} de {Math.ceil(((medidas.medidasProducto?.length || 0) + (medidas.medidasVenta?.length || 0)) / itemsPorPagina)}
                    </span>
                  </div>
                  <button onClick={manejarPaginaSiguiente} disabled={paginaActual === totalPaginas}               
                    className={`pagination-button ${
                      paginaActual === Math.ceil(((medidas.medidasProducto?.length || 0) + (medidas.medidasVenta?.length || 0)) / itemsPorPagina)
                      ? 'active'
                      : ''
                  }`}>
                    Siguiente
                  </button>
                </div>
              </>
            }
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={modalFormularioDireccion}
        onRequestClose={cerrarFormularioDireccion}
        contentLabel="Formulario de dirección"
        className="ModalDashboard"
        overlayClassName="Overlay"
      >
        <div className="ModalDashboard" style={{backgroundColor:'transparent'}}>
          <div className="FormContent" style={{textAlign: 'center', maxHeight:'520px', marginTop:'70px', maxWidth:'350px' }}>
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
                  value={RegionSeleccionadaNombre}
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
                  value={DepartamentoSeleccionado.identificador}
                >
                  <option value="" disabled>Seleccione un departamento</option>
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

            {DepartamentoSeleccionado && DepartamentoSeleccionado.nombre !== '' && (
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
                  value={MunicipioSeleccionado.identificador}
                >
                  <option value="" disabled>Seleccione un municipio</option>
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
                  <input type="text" className="address-form__disabled" style={{width:'100%', marginTop:'5px'}} disabled value={ Departamentos.length > 0 ? DepartamentoSeleccionado.nombre + ' - ' + MunicipioSeleccionado.nombre : ''}/>
                </div>
              </>
            )}
          </div>

          {modalFormularioDireccion && MunicipioSeleccionado.nombre !== '' && (
            <FormularioDireccion
              onSubmit={handleAddressSubmit}
              onCancel={cerrarFormularioDireccion}
              initialData={direccionGuardada}
              TituloFormulario={'Indique su dirección de entrega'}
            />
          )}
        </div>
      </Modal>
    </div>
  );
};

export default DataTable;
