/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import '../../../tablas/catalogo/selects/PrecioSelect.css';

import React, { useState, useMemo, useEffect, useCallback } from "react";
import { Column } from "react-table";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Modal from "react-modal";
import Swal from 'sweetalert2';
import Image from "next/image";

import ProductoSelectXmedidaProducto from '@/components/administrador/tablas/catalogo/selects/productoXmedidaProducto';
import InputFormato from '@/components/layaout/elementos/inputLog';

import MedidaCompraSelect from '../../catalogo/selects/SelectMedidasCompra';
import Table from '@/components/administrador/tablas/tabla/formatoTabla';
import {DataRowCompraGet, CompraDetalle, CompraDetalleGet, MedidaProducto as MedidaProductoCompra, Colores, PrecioVenta, PesoValor, UnidadMedida  } from '@/components/administrador/tablas/tiposFilas/compra';

import { getMedidaProducto, MedidaProducto } from "@/service/api/catalogo/medidaProducto/TodoMedidaProducto";
import { getProveedores, DataRowProveedor } from "@/service/api/compra/proveedor/TodoProveedor";

import AgregarCompra , {CompraDetalle as CompraDetalle2}  from '@/service/api/compra/Compra/AgregaCompra';
import EditarCompra from '@/service/api/compra/Compra/EditarCompra';
import EliminarCompra from '@/service/api/compra/Compra/EliminarCompra';

import { Pencil, Trash2, Eye, SquareX } from "lucide-react";
import { formatearFecha } from '../../funcionesGlobales/formatearFecha';
import { formatearNumero } from '../../funcionesGlobales/convertirMiles';


Modal.setAppElement('#root');

interface DataTableProps {
  data: DataRowCompraGet[];
  setRefreshData: React.Dispatch<React.SetStateAction<boolean>>;
}

const DataTable: React.FC<DataTableProps> = ({ data, setRefreshData }) => {

  const [Proveedores, setProveedores] = useState<DataRowProveedor[]>([]);
  const [ProveedorUnico, setProveedor] = useState<{identificador: string, nombre: string}>({identificador: '', nombre: ''});

  const [datosMedidaProducto, setDataMedidaProducto] = useState<MedidaProducto[]>([]);
  const [MedidaProductoSeleccionado, setSelectedMedidaProducto] = useState<MedidaProducto>();
  const [ProductoIdentificador, setProducto] = useState<string>('');
  const [PrecioVenta, setPrevioVenta] = useState<PrecioVenta>();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalVisualizar, setIsModalVisualizar] = useState(false);
  const [isModalAgregar, setIsModalAgregar] = useState(false);
  const [modalData, setModalData] = useState<CompraDetalle[] | null>(null);
  const [medidas, setMedidas] = useState<CompraDetalle[]>([]);
  const [medidasGet, setMedidasGet] = useState<CompraDetalleGet[]>([]);
  const [cantidad, setCantidad] = useState<number>();
  const [total, setTotal] = useState<number>();

  const itemsPorPagina = 12;
  const [paginaActual, setPaginaActual] = useState(1);

  const totalPaginas = Math.ceil(medidasGet.length / itemsPorPagina);
  const paginado = medidasGet.slice(
    (paginaActual - 1) * itemsPorPagina,
    paginaActual * itemsPorPagina
  );

  const columns: Column<DataRowCompraGet>[] = useMemo(
    () => [
      { 
        Header: "ID", 
        accessor: "col1", 
        Cell: ({ value }) => <div style={{ textAlign: 'center' }}>{value}</div>, 
      },
      { 
        Header: "Fecha", 
        accessor: "fechaCompra", 
        Cell: ({ value }) => <div style={{ textAlign: 'center' }}>{formatearFecha(value,true)}</div>, 
      },
      { 
        Header: "Total", 
        accessor: "totalCompra", 
        Cell: ({ value }) => <div style={{ textAlign: 'center' }}>{formatearNumero(value)}</div>, 
      },
      {
        Header: "Visualizar Medidas",
        Cell: ({ row }) => (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <button onClick={() => abrirModalVisualizar(row.original)}>
              <Eye className="h-6 w-6 hover:text-blue-600" />
            </button>
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
    ],
    []
  );

  const fetchMedidasProducto = useCallback(async () => {
    try {
      const medidasProducto = await getMedidaProducto();
      setDataMedidaProducto(medidasProducto);
    } catch (error) {
      console.error('Error al obtener las medidas de producto:', error);
    }
  }, []);

  const fetchProveedores = useCallback(async () => {
    try {
      const proveedores = await getProveedores();
      setProveedores(proveedores);
    } catch (error) {
      console.error('Error al obtener las medidas de producto:', error);
    }
  }, []);

  const ObtenerDatosMedida =(IdentificadorMedida : string) => {
    const extramedidaUnicaOProducto = datosMedidaProducto.find(medida => medida._id === IdentificadorMedida);
    return extramedidaUnicaOProducto
  };

  const ObtenerNombreProducto =(IdentificadorMedida : string) => {
    const extramedidaUnicaOProducto = datosMedidaProducto.find(medida => medida._id === IdentificadorMedida);
    return extramedidaUnicaOProducto?.producto.nombreProducto
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
            ?.colores.find((color) => color?.PrecioVenta?._id === detalle.color._id)
            ?.PrecioVenta || '',
        },
        producto: medidasProductoDatos
          .find((datoUnico) => datoUnico._id === detalle.medidaProducto._id)
          ?.producto?.idProducto || '',
      }));
      if (datosCompleto) {
        setModalData(datosCompleto as CompraDetalle[]);
        setMedidas(datosCompleto as CompraDetalle[]);
      }
    
      setIsModalOpen(true);
    }

  }, [datosMedidaProducto]);
  
  const closeModal = () => {
    setCantidad(0);
    setMedidas([]);
    setIsModalOpen(false);
  };

  const abrirModalAgregar = () => {
    setIsModalAgregar(true);
  };

  const cerrarModalAgregar = () => {
    setCantidad(0);
    setMedidas([]);
    setIsModalAgregar(false);
  };

  const abrirModalVisualizar = (compra: DataRowCompraGet) => {
    setMedidasGet(compra.detalleCompra);
    setIsModalVisualizar(true);
  };

  const cerrarModalVisualizar = () => {
    setIsModalVisualizar(false);
    setCantidad(0);
    setMedidasGet([]);
  };

  const eliminarCompra = async (id: string) => {
    try {
      const response = await EliminarCompra(id);
      if (response) {
        Swal.fire("¡Exitoso!", "¡Compra eliminada exitosamente!", "success");
        setRefreshData(true);
      } else {
        Swal.fire("¡Error!", "¡La compra no pudo ser eliminada!", "error");
      }
    } catch (error) {
      Swal.fire("¡Error!", "¡Error al eliminar la compra!", "error");
    }
  };

  const handleChangeProducto = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setProducto(e.target.value);
    setSelectedMedidaProducto(undefined)
    setPrevioVenta(undefined)
  };

  const handleChangeMedidaProducto = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const medidaUnica = datosMedidaProducto.find(medida => medida._id === e.target.value);
    setSelectedMedidaProducto(medidaUnica);
  };

  const handleChangeCantidad = (e: React.ChangeEvent<HTMLInputElement>) => { 
    const value = Math.floor(Number(e.target.value));
    if (value > 0) {
      setCantidad(value);
    }
  };

  const handleChangeColorPrecioVenta = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
  
    const precioVenta = MedidaProductoSeleccionado?.colores.find(
      (color) => color?.PrecioVenta?._id === selectedId
    );
  
    if (precioVenta && precioVenta.PrecioVenta !== undefined && precioVenta.PrecioVenta.unidadMedida) {
      setPrevioVenta({PrecioVenta: {      
        _id: precioVenta.PrecioVenta._id,
        precioUnitario: precioVenta.PrecioVenta._id,
        unidadMedida: precioVenta.PrecioVenta.unidadMedida,
        color: {
          _id: precioVenta.PrecioVenta.color._id,
          nombreColor: precioVenta.PrecioVenta.color.nombreColor,
        }
      }});
    }
  };

  const handleChangeTotal = (e: React.ChangeEvent<HTMLInputElement>) => { 
    const value = Number(e.target.value);
    if (value > 0){
      setTotal(value);
    }
  };

  const handleChangeProveedor = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;

    const selectedProveedor = Proveedores.find((Proveedor) => Proveedor._id === selectedId);
    
    if (selectedProveedor) {
      setProveedor({ identificador: selectedProveedor._id, nombre: selectedProveedor.nombre });
    }
  };

  const agregarCompra = useCallback(async () => {
    try {
      let listaDetalle: CompraDetalle2[] = [];
  
      medidas.forEach((medida) => {
        listaDetalle.push({
          medidaProducto:medida.medidaProducto._id,
          color: medida.color.PrecioVenta._id,
          cantidad: medida.cantidad,
          total: medida.total,
          proveedor: medida.proveedor._id,
        });
      });
  
      const compra = await AgregarCompra(listaDetalle);

      if (compra) {
        cerrarModalAgregar();
        setRefreshData(true);
        setCantidad(0);
        setMedidas([]);
      }

    } catch (error) {
      console.error('Error al agregar la compra:', error);
    }
  }, [medidas]);

  const manejarPaginaAnterior = () => {
    if (paginaActual > 1) setPaginaActual(paginaActual - 1);
  };

  const manejarPaginaSiguiente = () => {
    if (paginaActual < totalPaginas) setPaginaActual(paginaActual + 1);
  };

  useEffect(() => {
    fetchMedidasProducto();
    fetchProveedores();
  },[]);

  return (
    <div style={{ padding: "20px" }}>
      <button type="button" className="botonAgregado"  onClick={abrirModalAgregar}>Agregar</button>
      <Table<DataRowCompraGet> columns={columns} data={data} setRefreshData={setRefreshData} />

      <Modal
        isOpen={isModalOpen || isModalAgregar}
        onRequestClose={isModalOpen ? closeModal : cerrarModalAgregar}
        className="ModalDashboard"
        overlayClassName="Overlay"
        contentLabel="Modal Compra" 
      >
        <div className="ModalDashboard" style={{maxHeight: MedidaProductoSeleccionado || PrecioVenta ?  '640px': '560px', marginTop:'20px'}}>
          <div className="FormContent">
            <h2 className="titleSinFondoModal">{isModalAgregar ? "Agregar Compra" : "Editar Compra"}</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (
                  isModalAgregar &&
                  MedidaProductoSeleccionado &&
                  MedidaProductoSeleccionado.colores.length > 0 &&
                  MedidaProductoSeleccionado.peso.valores[0].valor?._id !== undefined &&
                  cantidad &&
                  total &&
                  cantidad > 0 &&
                  total > 0
                ) {
                  const unidadMedidaEjemplo: UnidadMedida = {
                    _id: '',
                    nombre: '',
                    simbolo: '',
                  };

                  const pesoValorEjemplo: PesoValor = {
                    _id: MedidaProductoSeleccionado.peso.valores[0].valor?._id || '',
                    peso: MedidaProductoSeleccionado.peso.valores[0].valor?.peso || 0,
                  };

                  let precioVentaEjemplo: PrecioVenta;

                  if (
                    MedidaProductoSeleccionado.colores.length === 1 &&
                    MedidaProductoSeleccionado.colores[0].PrecioVenta &&
                    MedidaProductoSeleccionado.colores[0].PrecioVenta.color &&
                    MedidaProductoSeleccionado.colores[0].PrecioVenta.unidadMedida
                  ) {
                    precioVentaEjemplo = {
                      PrecioVenta: {
                        _id: MedidaProductoSeleccionado.colores[0].PrecioVenta._id,
                        precioUnitario: '' + MedidaProductoSeleccionado.colores[0].PrecioVenta.precioUnitario,
                        unidadMedida: MedidaProductoSeleccionado.colores[0].PrecioVenta.unidadMedida,
                        color: {
                          _id: MedidaProductoSeleccionado.colores[0].PrecioVenta.color._id,
                          nombreColor: MedidaProductoSeleccionado.colores[0].PrecioVenta.color.nombreColor,
                        }
                      },
                    };
                  } else if (MedidaProductoSeleccionado.colores.length > 1 && PrecioVenta) {
                    precioVentaEjemplo = PrecioVenta;
                  } else {
                    precioVentaEjemplo = {
                      PrecioVenta: {
                        _id: '',
                        precioUnitario: '0',
                        unidadMedida: unidadMedidaEjemplo,
                        color: {
                          _id: '',
                          nombreColor: '',
                        },
                      },
                    };
                  }

                  const coloresEjemplo: Colores = {
                    _id: '',
                    PrecioVenta: precioVentaEjemplo,
                    imagen: "",
                    idImagen: ""
                  };

                  const medidaProductoEjemplo: MedidaProductoCompra = {
                    _id: MedidaProductoSeleccionado._id,
                    longitudMedida: {
                      valor: MedidaProductoSeleccionado.longitudMedida.valor,
                      unidadMedida: MedidaProductoSeleccionado.longitudMedida.unidadMedida
                    },
                    peso: {
                      valores: [
                        {
                          _id: MedidaProductoSeleccionado.peso.valores[0]._id,
                          valor: pesoValorEjemplo
                        }
                      ],
                      unidadMedida: unidadMedidaEjemplo
                    },
                    colores: [coloresEjemplo]
                  };

                  const nuevoDetalle: CompraDetalle = {
                    medidaProducto: medidaProductoEjemplo,
                    color: precioVentaEjemplo,
                    cantidad: cantidad,
                    total: total,
                    proveedor: {
                      _id: ProveedorUnico.identificador,
                      nombre: ProveedorUnico.nombre,
                    },
                    producto: ProductoIdentificador
                  };

                  setMedidas((medidasAnteriores) => [...medidasAnteriores, nuevoDetalle]);
                  setSelectedMedidaProducto(undefined)
                  setPrevioVenta(undefined)
                } 
                // else if (false) {
                //   handleAgregarCompra();
                // } else {
                //   handleEditarCompra();
                // }
              }}
            >
              <label htmlFor="proveedor-select" className="LabelModal">Proveedores</label>
              <select
                id="proveedor-select"
                className="selectModal"
                value={ProveedorUnico.identificador|| ""}
                onChange={handleChangeProveedor}
              >
                <option value="" disabled>Selecciona un proveedor</option>
                {Proveedores.map((Proveedor) => (
                  <option key={Proveedor._id} value={Proveedor._id}>
                    {Proveedor.nombre}
                  </option>
                ))}
              </select>

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
                    value={MedidaProductoSeleccionado?._id || ""}
                    onChange={handleChangeMedidaProducto}
                  >
                    <option value="" disabled>Selecciona una medida producto</option>
                    {datosMedidaProducto
                      .filter(medidaProducto => medidaProducto.producto.idProducto === ProductoIdentificador)
                      .map(medidaProducto => (
                        <option key={medidaProducto._id} value={medidaProducto._id}>
                          {medidaProducto.longitudMedida?.valor + " " + medidaProducto.longitudMedida?.unidadMedida?.simbolo}
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
                    value={PrecioVenta?.PrecioVenta._id || ""}
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

              <InputFormato nombreInput="Cantidad" tipoInput="number" nameInput="cantidad" handleChangeCantidad={handleChangeCantidad} valor={cantidad || ''} />
              
              <InputFormato nombreInput="Total" tipoInput="number" nameInput="total" handleChangeCantidad={handleChangeTotal} valor={total || ''} />

              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" className="botonEditarModal">
                  {isModalAgregar ? "Agregar medida" : "Guardar"}
                </button>
                {medidas.length > 0 &&
                <>
                  <button type="submit" onClick={agregarCompra} className="botonEditarModal">
                    Finalizar compra
                  </button>
                </>
                }
                <button type="button" onClick={isModalAgregar ? cerrarModalAgregar : closeModal} className="CerrarModalBotonGeneral">
                  Cerrar
                </button>
              </div>
            </form>
          </div>
          {medidas.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "240px" }}>
              <div className="ImageContent" style={{ width: '350px', transform: 'scale(0.9)', transformOrigin: 'top left' }}>
                <MedidaCompraSelect
                  DatoCompletosMedida={medidas}
                  datosPrecioVentaSelect={PrecioVenta || {
                    PrecioVenta: {
                      _id: '',
                    precioUnitario: '',
                    unidadMedida: {
                      _id: '',
                      nombre: '',
                      simbolo: ''
                    },
                    color: {
                      _id: '',
                      nombreColor: ''
                    }
                    },
                  }}
                  onSelect={(datosSelect) => {
                    if (JSON.stringify(datosSelect) !== JSON.stringify(medidas)) {
                      setMedidas(datosSelect);
                    }
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
                <strong>Detalle Compra</strong>
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
              {paginado && paginado?.map((medidaProductoDato, index) => (
                <div key={medidaProductoDato.medidaProducto._id +' ' + index} className="precio-edit-form">
                  <ul>
                    <li><h1><strong>{ObtenerNombreProducto(medidaProductoDato.medidaProducto._id)}</strong></h1></li>
                    <li><strong>Medida:</strong> {medidaProductoDato.medidaProducto.longitudMedida.valor  + ' ' + medidaProductoDato.medidaProducto.longitudMedida.unidadMedida.simbolo}</li>
                    <li><strong>Cantidad:</strong> {medidaProductoDato.cantidad}</li>
                    <li>
                      <strong>Color: </strong> 
                      {ObtenerDatosMedida(medidaProductoDato.medidaProducto._id)?.colores
                        .find(color => color.PrecioVenta.color._id === medidaProductoDato.color.color)?.PrecioVenta.color.nombreColor || 'Color no disponible'}
                    </li>
                    <li><strong>SubTotal:</strong> {formatearNumero(medidaProductoDato.total)}</li>
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
                      {paginaActual} de {Math.ceil((medidasGet?.length || 0) / itemsPorPagina)}
                    </span>
                  </div>
                  <button onClick={manejarPaginaSiguiente} disabled={paginaActual === totalPaginas}               
                    className={`pagination-button ${
                      paginaActual === Math.ceil((medidasGet?.length || 0) / itemsPorPagina)
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
    </div>
  );
};

export default DataTable;
