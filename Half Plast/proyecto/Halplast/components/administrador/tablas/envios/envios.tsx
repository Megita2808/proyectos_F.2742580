/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import '../../tablas/catalogo/selects/PrecioSelect.css';

import React, { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { Column } from "react-table";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Modal from "react-modal";
import Swal from 'sweetalert2';
import Image from "next/image";
import "react-datepicker/dist/react-datepicker.css";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";

import DatePicker from "react-datepicker";
import { addDays, setHours, setMinutes, getDay, longFormatters } from 'date-fns';

import ProductoSelectXmedidaProducto from '@/components/administrador/tablas/catalogo/selects/productoXmedidaProducto';
import InputFormato from '@/components/layaout/elementos/inputLog';
import FormularioDireccion from "@/components/cliente/envio/microFormularioDireccion";

import MedidaVentaSelect from '@/components/administrador/tablas/catalogo/selects/SelectMedidasVenta';
import obtenerDepartamentos from '@/service/api/ubicacion/DepartamentosApi';

import OpcionesImagen from '../catalogo/checkBox/opcionesEstadoEnvioRadio';

import Table from '@/components/administrador/tablas/tabla/formatoTabla';
import { DataRowVenta, DetalleVenta ,DetalleVentaEnviar, Usuario, MedidaVentaEnviar, MedidaProductoEnviar, MedidaProducto as MedidaProductoPersonalizado, MedidaVenta as MedidaVentaPersonalizado, Area, PesoPersonalizado as PesoPersonalizadoEnviar } from '@/components/administrador/tablas/tiposFilas/venta';
import { DataRowEnvio,} from '@/components/administrador/tablas/tiposFilas/envios';
import { getMedidaProducto, MedidaProducto, MedidaVenta, PesoValor } from "@/service/api/catalogo/medidaProducto/TodoMedidaProductoConMedidasVenta";
import { getClientes, DataRowCliente } from "@/service/api/usuarios/TodoCliente";
import { getPesos, Peso as interfacePeso } from "@/service/api/catalogo/peso/TodoPeso";
import { ObtenerDatosEstadoUnico, DatosResponseEstado, FormatoDatoEstado } from "@/service/api/EstadoVentaGeneral/obtenerDatosEstadoUnicoDocumento";

import { getMedidasVenta, MedidaVenta as MedidaVentaTodoApi } from "@/service/api/catalogo/medidaVenta/TodoMedidaVenta";

import { useModal } from '@/components/administrador/Sidebar/use-modale';
import { useSidebar } from '@/components/administrador/Sidebar/use-sidebar'; 

import { Pencil, Trash2, Eye, MapPinCheck, MapPinPlusInside, SquarePen, FileBox, SquareX } from "lucide-react";

import EditarEstadoVentaGeneral from '@/service/api/EstadoVentaGeneral/editarEstadoVentaGeneral';
import { formatearFecha } from '../funcionesGlobales/formatearFecha';
import { formatearNumero } from '../funcionesGlobales/convertirMiles';
import { LocacionCell } from './elemento/locacionDiv';

Modal.setAppElement('#root');

interface DataTableProps {
  data: DataRowEnvio[];
  setRefreshData: React.Dispatch<React.SetStateAction<boolean>>;
}

const DataTable: React.FC<DataTableProps> = ({ data, setRefreshData }) => {
  const { isSidebarOpen, toggleSidebar } = useSidebar();
  const { setModalOpen, setModalAgregar, setModalAbrirImagen } = useModal();

  const [datosMedidaVenta, setDataMedidaVenta] = useState<MedidaVentaTodoApi[]>([]);
  const [datosMedidaProducto, setDataMedidaProducto] = useState<MedidaProducto[]>([]);
  const [datosEstadoUnicoDocumento, setDataEstadoUnicoDocumento] = useState<DatosResponseEstado | null>(null);

  const [IdentificadorEnvio, setIdentificadorEnvio] = useState<string>('');
  const [SelectEstadoEnvioOpcionBase, setSelectEstadoEnvioOpcionBase] = useState<string>('');
  const [SelectEstadoEnvioOpcion, setSelectEstadoEnvioOpcion] = useState<string>('');
  const [OpcionEstadoEnvioRadio, setOpcionEstadoEnvioRadio] = useState<string>('base');
  
  const [EstadoPersonalizado, setEstadoPersonalizado] = useState<string>('');
  const [EstadoMotivoPersonalizado, setEstadoMotivoPersonalizado] = useState<string>('');
  const [EstadoDescripcionPersonalizado, setEstadoDescripcionPersonalizado] = useState<string>('');

  const [isModalVisualizar, setIsModalVisualizar] = useState(false);
  const [isModalCambiarEstado, setIsModalCambiarEstado] = useState(false);
  const [isModalVisualizarEstados, setIsModalVisualizarEstados] = useState(false);

  const [errors, setErrors] = useState<any>({});

  const [medidas, setMedidas] = useState<DetalleVentaEnviar>({
    medidasProducto: null,
    medidasVenta: null,
  });

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

  const itemsPorPagina2 = 2;
  const [paginaActual2, setPaginaActual2] = useState(1);
  
  const todoDatos = Array.isArray(datosEstadoUnicoDocumento?.EstadoEnvio)
    ? datosEstadoUnicoDocumento.EstadoEnvio
    : [];

  const totalPaginas2 = Math.ceil(todoDatos.length / itemsPorPagina2);

  const paginado2 = todoDatos.slice(
    (paginaActual2 - 1) * itemsPorPagina2,
    paginaActual2 * itemsPorPagina2
  );


  const fetchEstadosEnvio = useCallback(async (datoBuscarID: string) => {
    try {
      const datosEstadoUnico = await ObtenerDatosEstadoUnico(datoBuscarID, '');
      if(datosEstadoUnico){
        setDataEstadoUnicoDocumento(datosEstadoUnico);
      }else{
        Swal.fire({
          title: '¡Error!',
          text: '¡Parece que el envío no tiene ningún estado disponible.!',
          icon: 'error',
          timerProgressBar: true,
          timer: 1500,
          showConfirmButton: false,
        });
        setIsModalVisualizarEstados(false);
        setIdentificadorEnvio('');
      }
    } catch (error) {
      console.error('Error al obtener los pesos:', error);
    }
  }, [IdentificadorEnvio]);

  const fetchMedidasProducto = useCallback(async () => {
    try {
      const medidasProducto = await getMedidaProducto();
      setDataMedidaProducto(medidasProducto);
    } catch (error) {
      console.error('Error al obtener las medidas de producto:', error);
    }
  }, []);

  const fetchMedidasVenta = useCallback(async () => {
    try {
      const datosMedidaVenta = await getMedidasVenta();
      setDataMedidaVenta(datosMedidaVenta);
    } catch (error) {
      console.error('Error al obtener los pesos:', error);
    }
  }, []);
  
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

  const columns: Column<DataRowEnvio>[] = useMemo(
    () => [
      { 
        Header: "ID", 
        accessor: "col1", 
        Cell: ({ value }) => <div style={{ textAlign: 'center' }}>{value}</div>, 
      },
      { 
        Header: "Estado envio", 
        accessor: "estadoEnvio",
        Cell: ({ value }) => <div style={{ textAlign: 'center' }}>{value}</div>, 
      },
      {
        Header: "Cliente",
        accessor: (row: DataRowEnvio) => row.usuario?.nombre || "Sin nombre",
        Cell: ({ value }: { value: string }) => ( 
          <div style={{ textAlign: 'center' }}>{value}</div>
        ),
      },
      { 
        Header: "Total Venta", 
        accessor: (row: DataRowEnvio) => row.totalEnvio || 1,
        Cell: ({ value }: { value: string }) => ( 
          <div style={{ textAlign: 'center' }}>{formatearNumero(Number(value))}</div>
        ),
      },
      {
        Header: 'Locacion',
        accessor: (row: DataRowEnvio) =>
          row.locaciones.departamento  +' '+ row.locaciones.ciudad +' '+row.locaciones.locacion || 'Sin nombre',
        Cell: ({ value }: { value: string }) => <LocacionCell value={value} />,
      },
      {
        Header: "Detalle venta",
        Cell: ({ row }) => (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <button onClick={() => abrirModalVisualizar(row.original.detalleVenta.detalleVenta)}>
              <Eye className="h-6 w-6 hover:text-blue-600" />
            </button>
          </div>
        ),
      },
      {
        Header: "Detalle estados",
        Cell: ({ row }) => (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <button onClick={() => abrirModalVisualizarTodosEstados(row.original._id)}>
              <FileBox className="h-6 w-6 hover:text-blue-600" />
            </button>
          </div>
        ),
      },
      {
        Header: "Cambiar estado",
        Cell: ({ row }) => (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <button onClick={() => abrirModalCambiarEstado(row.original._id, row.original.estadoEnvio)}>
              <SquarePen className="h-6 w-6 hover:text-blue-600" />
            </button>
          </div>
        ),
      },
    ],
    []
  );

  const abrirModalCambiarEstado = (identificadorEnvio: string, estadoEnvioActual: string) => {
    setSelectEstadoEnvioOpcion(estadoEnvioActual);
    setIdentificadorEnvio(identificadorEnvio);
    setSelectEstadoEnvioOpcionBase(estadoEnvioActual);
    setIsModalCambiarEstado(true); 
  };

  const cerrarModalCambiarEstado = () => {
    setIsModalCambiarEstado(false);
    limpiarDatos();
  };

  const abrirModalVisualizar = useCallback((compra: DetalleVenta) => {
    setMedidas({
      medidasProducto: compra.medidasProducto?.map((producto) => ({
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
  
      medidasVenta: compra.medidasVenta?.map((venta) => ({
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
    setMedidas({    
      medidasProducto: null,
      medidasVenta: null,
    });
  };

  const abrirModalVisualizarTodosEstados = (identificadorEnvio: string) => {
    setIsModalVisualizarEstados(true);
    setIdentificadorEnvio(identificadorEnvio);
  };

  const cerrarModalVisualizarTodosEstados = () => {
    setIsModalVisualizarEstados(false);
    setIdentificadorEnvio('')
    setDataEstadoUnicoDocumento(null)
  };
  
  const manejarPaginaAnterior = () => {
    if (paginaActual > 1) setPaginaActual(paginaActual - 1);
  };

  const manejarPaginaSiguiente = () => {
    if (paginaActual < totalPaginas) setPaginaActual(paginaActual + 1);
  };

  const manejarPaginaAnteriorEstadoUnico = () => {
    if (paginaActual2 > 1) setPaginaActual2(paginaActual2 - 1);
  };

  const manejarPaginaSiguienteEstadoUnico = () => {
    if (paginaActual2 < totalPaginas2) setPaginaActual2(paginaActual2 + 1);
  };

  const limpiarDatos = () => {
    setEstadoPersonalizado('');
    setEstadoMotivoPersonalizado('');
    setEstadoDescripcionPersonalizado('');
    setOpcionEstadoEnvioRadio('base');
    setSelectEstadoEnvioOpcion('');
    setSelectEstadoEnvioOpcionBase('');
    setIdentificadorEnvio('');
  };

  const handleSubmitFormularioEstado = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (validateForm()) {
      if (IdentificadorEnvio && (SelectEstadoEnvioOpcion !== SelectEstadoEnvioOpcionBase)) {
        let estadoEntradaDato;
        
        if (SelectEstadoEnvioOpcion && SelectEstadoEnvioOpcion === 'personalizar') {
          estadoEntradaDato = EstadoPersonalizado;
        } else {
          estadoEntradaDato = SelectEstadoEnvioOpcion;
        }
    
        let estadoMotivoDato = '';
        let estadoDescripcionDato = '';
    
        if ((OpcionEstadoEnvioRadio && OpcionEstadoEnvioRadio === 'personalizar') && 
            EstadoMotivoPersonalizado && EstadoDescripcionPersonalizado) {
          
          estadoMotivoDato = EstadoMotivoPersonalizado;
          estadoDescripcionDato = EstadoDescripcionPersonalizado;
        } else {
          estadoMotivoDato = '';
          estadoDescripcionDato = '';
        }
        const response = await EditarEstadoVentaGeneral(IdentificadorEnvio, '', estadoEntradaDato, estadoDescripcionDato, estadoMotivoDato);
        if(response && response.msg === "Datos modificados con exito"){
          Swal.fire({
            title: '¡Exitoso!',
            text: '¡Estado del envío editado exitosamente!',
            icon: 'success',
            timerProgressBar: true,
            timer: 1500,
            showConfirmButton: false,
          });
          limpiarDatos();
          setRefreshData(true);
        }else{
          Swal.fire({
            title: '¡Error!',
            text: '¡Por favor, asegúrese de enviar los datos correctamente.!',
            icon: 'error',
            timerProgressBar: true,
            timer: 1500,
            showConfirmButton: false,
          });
        }

      } else {
        if((SelectEstadoEnvioOpcion !== '' && SelectEstadoEnvioOpcionBase!== '') && (SelectEstadoEnvioOpcion === SelectEstadoEnvioOpcionBase)){
          Swal.fire({
            title: '¡Error!',
            text: '¡Por favor, asegúrese de cambiar el estado para enviar.!',
            icon: 'error',
            timerProgressBar: true,
            timer: 1500,
            showConfirmButton: false,
          });
        }
      }
    }
  };

  const handleChangeEstadoEnvio = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setSelectEstadoEnvioOpcion(value);
  };
  
  const handleChangeEstadoPersonalizado = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setEstadoPersonalizado(value);
  }; 

  const handleChangeMotivoEstadoPersonalizado = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setEstadoMotivoPersonalizado(value);
  }; 

  const handleChangeDescripcionEstadoPersonalizado = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setEstadoDescripcionPersonalizado(value);
  };

  const validateForm = () => {
    const newErrors: any = {};
    if (SelectEstadoEnvioOpcion === 'personalizar') {
      if (!EstadoMotivoPersonalizado || !/[a-zA-Z]/.test(EstadoMotivoPersonalizado)) {
        newErrors.motivo = 'El motivo debe contener al menos una letra.';
      }
      if (!EstadoDescripcionPersonalizado || !/[a-zA-Z]/.test(EstadoDescripcionPersonalizado)) {
        newErrors.descripcion = 'La descripción debe contener al menos una letra.';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; 
  };

  useEffect(() => {
    setModalAbrirImagen(isModalVisualizar);
  }, [isModalVisualizar, setModalAbrirImagen]);

  useEffect(() => {
    setModalAgregar(isModalCambiarEstado);
  }, [isModalCambiarEstado, setModalAgregar]);

  useEffect(() => {
    setModalOpen(isModalVisualizarEstados);
  }, [isModalVisualizarEstados, setModalOpen]);

  useEffect(() => {
    fetchMedidasProducto();
    fetchMedidasVenta();
  }, []);

  useEffect(() => {
    if (isModalVisualizarEstados && (IdentificadorEnvio && IdentificadorEnvio !== '')){
      fetchEstadosEnvio(IdentificadorEnvio);
    }
  }, [isModalVisualizarEstados]);

  return (
    <div style={{ padding: "20px" }}>
      {/* <button type="button" className="botonAgregado" >Agregar</button> */}
      
      <Table<DataRowEnvio> columns={columns} data={data} setRefreshData={setRefreshData} />

      <Modal
        isOpen={isModalVisualizar}
        onRequestClose={cerrarModalVisualizar}
        contentLabel="Edit Modal"
        className="ModalDashboard"
        overlayClassName="Overlay"
      >
        <div className="ModalDashboard">
          <div className="FormContent" style={{marginTop:'60px'}}>
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
        isOpen={isModalCambiarEstado}
        onRequestClose={cerrarModalCambiarEstado}
        contentLabel="Edit Modal"
        className="ModalDashboard"
        overlayClassName="Overlay"
      >
        <div className="ModalDashboard">
          <div className="FormContent" style={{marginTop:'60px'}}>
            <div className="precio-edit-form">
              <form action=""  onSubmit={(e) => {handleSubmitFormularioEstado(e)}}>
                <h2 className="titleSinFondoModal">Cambiar estado</h2>
                  <label htmlFor="estadoEnvio" className="LabelModal" >Estado de envío</label>
                  <select id="estadoEnvio" name="estadoEnvio" className="selectModal" value={SelectEstadoEnvioOpcion || ''} onChange={(e) => handleChangeEstadoEnvio(e)} required>
                    <option value="" disabled>Seleccione un estado</option>
                    <option value="En preparación">En preparación</option>
                    <option value="En tránsito">En tránsito</option>
                    <option value="Entregado">Entregado</option>
                    <option value="Cancelado">Cancelado</option>
                    <option value="Reprogramado">Reprogramado</option>
                    <option value="Pendiente de recolección">Pendiente de recolección</option>
                    <option value="personalizar">Estado personalizado</option>
                  </select>
                  {SelectEstadoEnvioOpcion && SelectEstadoEnvioOpcion === 'personalizar' && (
                    <InputFormato nombreInput="Estado envio personalizado" tipoInput="string" nameInput="estadoEnvioPersonalizado" handleChangeCantidad={handleChangeEstadoPersonalizado} valor={EstadoPersonalizado || ''} />
                  )}
                  {SelectEstadoEnvioOpcion && SelectEstadoEnvioOpcion !== '' && (
                    <OpcionesImagen onChange={setOpcionEstadoEnvioRadio} />
                  )}
                  
                  {OpcionEstadoEnvioRadio && OpcionEstadoEnvioRadio === 'personalizar' && (
                    <>
                      <InputFormato nombreInput="Motivo" tipoInput="string" nameInput="motivo" handleChangeCantidad={handleChangeMotivoEstadoPersonalizado} valor={EstadoMotivoPersonalizado || ''} />
                
                      <InputFormato nombreInput="Descripción" tipoInput="string" nameInput="descripcion" handleChangeCantidad={handleChangeDescripcionEstadoPersonalizado} valor={EstadoDescripcionPersonalizado || ''} />   
                    </>
                  )}
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px', justifyContent: 'center', alignItems: 'center' }}>
                  <button type="submit" className="botonEditarModal">
                    Finalizar
                  </button>

                  <button type="button" onClick={cerrarModalCambiarEstado} className="CerrarModalBotonGeneral">
                    Cerrar
                  </button>
                </div>

              </form>
            </div>
          </div>
        </div>
      </Modal> 

      {paginado2 && paginado2.length > 0 && 
        <>
          <Modal
            isOpen={isModalVisualizarEstados}
            onRequestClose={cerrarModalVisualizarTodosEstados}
            contentLabel="Edit Modal"
            className="ModalDashboard"
            overlayClassName="Overlay"
          >
            <div className="ModalDashboard">
              <div className="FormContent" style={{marginTop:'60px', maxWidth:'650px'}}>
                <h2 className="titleSinFondoModal">Historial de estados</h2>
                <div>
                  <form action=""  onSubmit={(e) => {handleSubmitFormularioEstado(e)}}>
                    {paginado2?.map((datoEstadoUnico : FormatoDatoEstado, index) => (
                      <div key={datoEstadoUnico.timestamp +' ' + index} className="precio-edit-form" style={{textAlign:'center'}}>
                        <ul>
                          <li style={{margin:'0 auto', marginTop:'10px',marginBottom:'10px'}}><h1><strong>{datoEstadoUnico.motivo}</strong></h1></li>
                          { datoEstadoUnico.descripcion && datoEstadoUnico.descripcion !== 'Sin descripcion' 
                            ?                          
                           ( 
                            <>
                              <li style={{margin:'0 auto', marginTop:'10px'}}><strong>Descripcion</strong></li> 
                              <li style={{margin:'0 auto', marginBottom:'10px'}}> {datoEstadoUnico.descripcion}</li>
                            </>
                          )
                            : null
                          }
                          <li><strong>Fecha:</strong> {formatearFecha(datoEstadoUnico.timestamp, true)}</li>
                        </ul>
                      </div>
                  ))}
                  { totalPaginas2 > 1 && 
                    <>
                      <div className="pagination-container" 
                        style={{
                          display: 'flex', 
                          justifyContent: 'center', 
                          alignItems: 'center', 
                          margin: 'auto', 
                          width: '100%', 
                          marginTop:'10px'
                        }}
                      >
                        <button onClick={manejarPaginaAnteriorEstadoUnico} className={`pagination-button ${paginaActual2 === 1 ? 'active' : ''}`} disabled={paginaActual2 === 1}>
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
                            {paginaActual2} de {totalPaginas2}
                          </span>
                        </div>
                        <button onClick={manejarPaginaSiguienteEstadoUnico} disabled={paginaActual2 === totalPaginas2}               
                          className={`pagination-button ${
                            paginaActual2 === (totalPaginas2 / itemsPorPagina2)
                            ? 'active'
                            : ''
                        }`}>
                          Siguiente
                        </button>
                      </div>
                    </>
                  }
                    <div style={{ display: 'flex', marginTop: '10px', marginRight: '10px', justifyContent: 'center', alignItems: 'center' }}>
                      <button type="button" onClick={cerrarModalVisualizarTodosEstados} className="CerrarModalBotonGeneral">
                        Cerrar
                      </button>
                    </div>

                  </form>
                </div>
              </div>
            </div>
          </Modal>  
        </>
      }
    </div>
    );

};

export default DataTable;
