/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import { Column } from "react-table";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Modal from 'react-modal';
import Swal from 'sweetalert2';
import { Pencil, Trash2 } from "lucide-react";

import { DataRowMedidaProducto } from '../tiposFilas/medidaProducto';

import PrecioSelect from './selects/SelectPrecioNoImagen';
import Table from '../tabla/formatoTabla';
import StatusBoton from './estado/estadoSinPalabra';
import InfoPopover from './inputFlotantes/inputExistencia';

import EditarMedidaProducto from '@/service/api/catalogo/medidaProducto/EditarMedidaProducto';
import EliminarMedidaProducto from '@/service/api/catalogo/medidaProducto/EliminarMedidaProducto';
import AgregarMedidaProducto from '@/service/api/catalogo/medidaProducto/AgregarMedidaProducto';

import { getProductos } from "@/service/api/catalogo/producto/TodoProducto";
import { getPesos } from "@/service/api/catalogo/peso/TodoPeso";
import { getPreciosVenta } from "@/service/api/precioVenta/TodoPrecioVenta";
import { getUnidadMedida } from "@/service/api/unidadMedida/TodoUnidadMedida";
import { Span } from "next/dist/trace";
import { formatearNumero } from "../funcionesGlobales/convertirMiles";

Modal.setAppElement('#root');

interface PrecioVenta {
  idPrecioVentaApi: string;
  simboloUnidadMedida: string;  
  precioUnitarioApi: number;
  color: string;
}

interface DataTableProps {
  data: DataRowMedidaProducto[];
  setRefreshData: React.Dispatch<React.SetStateAction<boolean>>;
}

const DataTable: React.FC<DataTableProps> = ({ data, setRefreshData }) => {
  const [datosProducto, setDataProducto] = useState<{ idProductoApi: string; nombreProductoApi: string }[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ModalAgregarAbrir, setIsModalAgregar] = useState(false);

  const [datosPesoSelect, setDataPeso] = useState<{ idPesoApi: string; PesoApi: number; idUnidadMedida: string; simboloUnidadMedida: string }[]>([]);
  const [datosPrecioVentaSelect, setDataPrecioVenta] = useState<{ idPrecioVentaApi: string; precioUnitarioApi: number; idUnidadMedidaPrecioVenta: string; color: string; simboloUnidadMedida: string; tipoPrecioVenta: string}[]>([]);
  const [datosUnidadMedidaSelect, setDataUnidadMedida] = useState<{ idUnidadMedidaApi: string; nombreUnidadMedida: string; tipoUnidad: string; simboloApi: string;}[]>([]);

  const [modalData, setModalData] = useState<{
    id: string;
    idProductoApi: string;
    nombreProductoBase: string;
    longitud: number;
    unidadMedidaId: string;
    pesoId: string;
    precioVentaId: string;
  } | null>(null);

  const [colorSeleccionadoPorFila, setColorSeleccionadoPorFila] = useState<Record<string, string>>({});
  
  const [UnicaUnidadMedidaUnic, setDataIdUnicaMedia] = useState<string>('');
  const [ProductoSeleccionado, setSelectedProducto] = useState<string>('');
  const [PesoMedidaProductoSeleccionado, setPesoMedidaProducto] = useState<{ valor: string; unidadMedida: string; } | null>(null);
  const [PesoSimboloMedidaProducto, setPesoSimboloMedidaProducto] = useState<string>('gm');
  const [PrecioVentaSeleccionado, setSelectedPrecioVenta] = useState<string>('');
  const [UnidadMedidaSeleccionado, setSelectedUnidadMedida] = useState<string>('');
  const [UnidadMedidaSeleccionadoTipo, setSelectedUnidadMedidaTipo] = useState<string>('');
  const [UnidadMedidaSeleccionadoSimbolo, setSelectedUnidadMedidaSimbolo] = useState<string>('');
  const [ingresarLongitud, setIngresarLongitud] = useState<boolean>(false);
  const [ingresarPeso, setIngresarPeso] = useState<boolean>(false);
  const [IdPesoUnico, setIdPesoUnico] = useState<string>("");
  const [logitudNumero, setLongitudNumero] = useState<{ valor: number; unidadMedida: string } | null>(null);
  const [precioVentaSeleccionado, setPrecioVentaSeleccionado] = useState<string | undefined>(undefined);
  const [preciosSeleccionados, setPreciosSeleccionados] = useState<PrecioVenta[]>([]);

  const fetchProductos = useCallback(async () => {
    try {
      const productos = await getProductos();
      const datosProducto = productos.map((producto) => ({
        idProductoApi: producto._id,
        nombreProductoApi: producto.nombreProducto,
      }));
      setDataProducto(datosProducto);
    } catch (error) {
      console.error('Error al obtener los productos:', error);
    }
  }, []);

  const fetchPesos = useCallback(async () => {
    try {
      const pesos = await getPesos();
      const datosPesoSelect = pesos.map((peso) => ({
        idPesoApi: peso._id,
        PesoApi: peso.peso,
        simboloUnidadMedida: peso.unidadMedida?.simbolo || "sin símbolo de unidad de medida",
        idUnidadMedida: peso.unidadMedida?._id || "sin id de la unidad de medida",
      }));
      setDataPeso(datosPesoSelect);

      const unidadMedidaUnit = datosPesoSelect.find(
        (peso) => peso.PesoApi === 0
      );

      if (unidadMedidaUnit) {
        setIdPesoUnico(unidadMedidaUnit.idPesoApi || "");
      }
      
    } catch (error) {
      console.error('Error al obtener los pesos:', error);
    }
  }, []);

  const fetchPrecioVenta = useCallback(async () => {
    try {
      const preciosVenta = await getPreciosVenta();
      const datosPrecioVentaSelect = preciosVenta.map((precioVenta) => ({
        idPrecioVentaApi: precioVenta._id,
        precioUnitarioApi: precioVenta.precioUnitario,
        idUnidadMedidaPrecioVenta: precioVenta.unidadMedida?._id || "sin id de unidad de medida",
        color: precioVenta.color?.nombreColor || "sin color",
        simboloUnidadMedida: precioVenta.unidadMedida?.simbolo || "sin símbolo de unidad de medida",
        tipoPrecioVenta: precioVenta.unidadMedida?.tipo || "sin tipo",
      }));
      setDataPrecioVenta(datosPrecioVentaSelect);
    } catch (error) {
      console.error('Error al obtener los precios de venta:', error);
    }
  }, []);

  const fetchUnidadMedida = useCallback(async () => {
    try {
      const unidadesMedida = await getUnidadMedida();
      const datosUnidadesMedidaSelect = unidadesMedida
      .filter((unidadMedida) => unidadMedida.tipo !== 'peso')
      .map((unidadMedida) => ({
        idUnidadMedidaApi: unidadMedida._id,
        nombreUnidadMedida: unidadMedida.nombre,
        simboloApi: unidadMedida.simbolo,
        tipoUnidad: unidadMedida.tipo,
      }));
      setDataUnidadMedida(datosUnidadesMedidaSelect);

      const unidadMedidaUnit = datosUnidadesMedidaSelect.find(
        (unidadMedida) => unidadMedida.tipoUnidad === 'unic'
      );
      if (unidadMedidaUnit) {
        setDataIdUnicaMedia(unidadMedidaUnit.idUnidadMedidaApi);
      } else {
        setDataIdUnicaMedia("Sin identificador");
      }
    } catch (error) {
      console.error('Error al obtener las unidades de medida:', error);
    }
  }, []);

  useEffect(() => {
    fetchProductos();
    fetchPesos();
    fetchPrecioVenta();
    fetchUnidadMedida();
  }, [fetchProductos, fetchPesos, fetchPrecioVenta, fetchUnidadMedida]);

  const columns: Column<DataRowMedidaProducto>[] = useMemo(
    () => [
      { 
        Header: "ID", 
        accessor: "col1", 
        Cell: ({ value }) => <div style={{ textAlign: 'center' }}>{value}</div>, 
      },
      { 
        Header: "Producto", 
        accessor: "producto", 
        Cell: ({ value }) => <div style={{ textAlign: 'center' }}>{value}</div>, 
      },
      { 
        Header: "Longitud", 
        accessor: "longitudMedidaModificado", 
        Cell: ({ value }) => <div style={{ textAlign: 'center' }}>{value}</div>, 
      },
      {
        Header: "Colores",
        accessor: "coloresCompleto",
        Cell: ({ row }) => {
          const colores = row.original.coloresCompleto || [];
          const rowId = row.original.id;
  
          const selectedColor = colorSeleccionadoPorFila[rowId] || colores[0]?.PrecioVenta?.color?._id || "";
  
          const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
            const colorId = e.target.value;
            handleColorChange(rowId, colorId);
          };
  
          if (colores.length === 1) {
            return (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <span 
                  className="selectModal" 
                  style={{ padding: '7px', maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textAlign:'center' }}
                  title={colores[0]?.PrecioVenta?.color?.nombreColor || "Sin color"}
                >
                  {colores[0]?.PrecioVenta?.color?.nombreColor?.length > 13
                    ? colores[0]?.PrecioVenta?.color?.nombreColor.substring(0, 13) + "..."
                    : colores[0]?.PrecioVenta?.color?.nombreColor || "Sin color"}
                </span>
              </div>
            );
          }
  
          return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <select
                value={selectedColor}
                onChange={handleChange}
                className="selectModal"
                style={{
                  padding: '5px',
                  width: '100%',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {colores.map((color) => (
                  <option key={color.PrecioVenta._id} value={color.PrecioVenta._id}>
                    {color.PrecioVenta.color.nombreColor}
                  </option>
                ))}
              </select>
            </div>
          );
        },
      },
      { 
        Header: "Costo de medida", 
        accessor: "costoMedida", 
        Cell: ({ value }) => <div style={{ textAlign: 'center' }}>{formatearNumero(value)}</div>, 
      },
      { 
        Header: "Peso", 
        accessor: "pesoModificado", 
        Cell: ({ value }) => <div style={{ textAlign: 'center' }}>{value == '0 Unic' ? '' : value}</div>, 
      },
      {
        Header: "Precio",
        accessor: "precioUnitarioModificado",
        Cell: ({ row }) => {
          const rowId = row.original.id;
          const selectedColorId = colorSeleccionadoPorFila[rowId];
          const colores = row.original.coloresCompleto || [];
          const colorSeleccionado = colores.find((color) => color.PrecioVenta._id === selectedColorId);
  
          const precioActual = colorSeleccionado
            ? `${colorSeleccionado.PrecioVenta.precioUnitario} X ${colorSeleccionado.PrecioVenta.unidadMedida?.simbolo || "sin simbolo"}`
            : row.original.precioUnitarioModificado;
  
          return  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}><span>{precioActual}</span></div>;
        },
      },
      {
        Header: "Información",
        Cell: ({ row }) => {
          const rowId = row.original.id;
          const selectedColorId = colorSeleccionadoPorFila[rowId];
          const colores = row.original.coloresCompleto || [];
          const colorSeleccionado = colores.find((color) => color.PrecioVenta._id === selectedColorId);

          const precioActual = colorSeleccionado;
          if (precioActual) {
            return <InfoPopover
              existencias={precioActual.existencias.cantidad}
              equivalencia={precioActual.existencias.equivalencia.valor + ' ' + precioActual.existencias.equivalencia.unidadMedida.simbolo}
            /> 
          }else{
            return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}><InfoPopover existencias={row.original.existenciasCantidad}equivalencia={row.original.existenciasEquivalenciaSigno}/></div>
          }
        },
      },
      {
        Header: "Estado",
        accessor: "enabled",
        Cell: ({ value, row }) => (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <StatusBoton isEnabled={value} id={row.original.id} modulo="medidaProducto" />
          </div>
        ),
      },
      {
        Header: "Editar",
        Cell: ({ row }) => (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <button onClick={() => openModal(row.original.id, row.original.producto, row.original.idProducto, row.original.longitud, row.original.idUnidadMedida, row.original.idPeso, row.original.idUnidadMedidaPeso, row.original.idPrecioUnitario, row.original.unidadMedidaSimbolo)}>
              <Pencil className="h-6 w-6 hover:text-green-600" />
            </button>
          </div>
        ),
      },
      {
        Header: "Eliminar",
        Cell: ({ row }) => (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <button onClick={() => eliminarMedidaProducto(row.original.id)}>
              <Trash2 className="h-6 w-6 hover:text-red-600" />
            </button>
          </div>
        ),
      },
    ],
    [setRefreshData, colorSeleccionadoPorFila]
  );
  
  const handleColorChange = (rowId: string, colorId: string) => {
    setColorSeleccionadoPorFila((prev) => ({
      ...prev,
      [rowId]: colorId,
    }));
  };

  const handleCheckboxLongitud = (event: { target: { checked: boolean | ((prevState: boolean) => boolean); }; }) => {
    setIngresarLongitud(event.target.checked);
  };

  const handleCheckboxPeso = (event: { target: { checked: boolean | ((prevState: boolean) => boolean); }; }) => {
    setIngresarPeso(event.target.checked);
  };

  const handleChangeProducto = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedProducto(e.target.value);
  };

  const handleChangeLongitudSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nuevoValor = e.target.value;
    if (modalData) {
      setModalData({ ...modalData, unidadMedidaId: nuevoValor });
    }
    setLongitudNumero({ valor: logitudNumero?.valor || modalData?.longitud || 0, unidadMedida: logitudNumero?.unidadMedida || modalData?.unidadMedidaId|| "sin identificador"});
  };
  
  const handleChangeLongitud = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nuevoValor = Number(e.target.value);
    if (modalData) {
      setModalData({ ...modalData, longitud: nuevoValor });
    }
    setLongitudNumero({ valor: nuevoValor, unidadMedida: modalData?.unidadMedidaId || logitudNumero?.unidadMedida || "sin identificador"});
  };

  const handleChangePeso = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOption = datosPesoSelect.find((peso) => peso.idPesoApi === e.target.value);
    if (selectedOption) {
      setPesoMedidaProducto(prevState => ({
        ...prevState,
        valor: selectedOption.idPesoApi,
        unidadMedida: selectedOption.idUnidadMedida || "vacio"
      }));
  
      setPesoSimboloMedidaProducto(selectedOption.simboloUnidadMedida);
    } else {
      console.log("No existen coincidencias de unidad de medida");
    }
  };
  
  const handleChangePrecioVenta = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    const [idPrecioVentaApi, simboloUnidadMedida] = selectedValue.split('|');
    
    const nuevoPrecioVenta = datosPrecioVentaSelect.find((precio) => precio.idPrecioVentaApi === idPrecioVentaApi);
    
    if (nuevoPrecioVenta && !preciosSeleccionados.some((precio) => precio.idPrecioVentaApi === idPrecioVentaApi)) {
      setPreciosSeleccionados([...preciosSeleccionados, nuevoPrecioVenta]);
    }
  };
  
  const handleChangeUnidadMedida = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedUnidadMedida(e.target.value);

    const selectedUnidadMedida = datosUnidadMedidaSelect.find(UnidadMedia => UnidadMedia.idUnidadMedidaApi === e.target.value);
    if (selectedUnidadMedida) {
      setSelectedUnidadMedidaTipo(selectedUnidadMedida.tipoUnidad)
      setSelectedUnidadMedidaSimbolo(selectedUnidadMedida.simboloApi)
    }

    setLongitudNumero(prevState => ({
      valor: prevState?.valor || 0,
      unidadMedida: e.target.value
    }));
  };

  const openModal = useCallback(async (id: string, nombreProductoBase: string, idProductoApi: string, longitud: number, unidadMedidaId: string, pesoId: string, unidadMedidaPesoId: string, precioVentaId: string, simboloUnidadMedida: string) => {
    await fetchProductos();
    setLongitudNumero({ valor: longitud, unidadMedida: unidadMedidaId });
    setSelectedProducto(idProductoApi)
    setPesoMedidaProducto({ valor: pesoId, unidadMedida: unidadMedidaPesoId })
    setSelectedPrecioVenta(precioVentaId)
    setPesoSimboloMedidaProducto(simboloUnidadMedida)
    setSelectedUnidadMedidaSimbolo(simboloUnidadMedida)
    setSelectedUnidadMedida(unidadMedidaPesoId)
    setModalData({
      id,
      idProductoApi,
      nombreProductoBase,
      longitud,
      unidadMedidaId,
      pesoId,
      precioVentaId,
    });

    setIsModalOpen(true);
  }, [modalData, fetchProductos]);

  const limpiarDatos = () => {
    setSelectedProducto('');
  
    setPesoMedidaProducto(prevState => ({
      valor: "vacio",
      unidadMedida: prevState?.unidadMedida || "vacio"
    }));
  
    setPesoSimboloMedidaProducto(prevState => prevState || 'gm');
  
    setSelectedPrecioVenta('');

    setSelectedUnidadMedida('');

    setLongitudNumero(prevState => ({
      valor: 0,
      unidadMedida: prevState?.unidadMedida || "vacio"
    }));
  
    setPrecioVentaSeleccionado('')
    setPreciosSeleccionados([]);
    setModalData(null);
  };
  
  const closeModal = useCallback(() => {
    limpiarDatos();
    setIsModalOpen(false);
  }, []);

  const abrirModalAgregar = useCallback(() => {
    setIsModalAgregar(true);
  }, []);

  const cerrarModalAgregar = useCallback(() => {
    limpiarDatos();
    setIsModalAgregar(false);
  }, []);

  const agregarMedidaProducto = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
  
    let valor: number | string;
    let pesos: {  
      valor: string;
      unidadMedida: string;
    };
  
    if (!ProductoSeleccionado || !UnidadMedidaSeleccionado || preciosSeleccionados.length ===0) {
      Swal.fire({
        title: '¡Error!',
        text: 'Por favor selecciona todos los campos obligatorios antes de agregar la medida.',
        icon: 'error',
        timerProgressBar: true,
        timer: 1500,
        showConfirmButton: false,
      });
      return;
    }
  
    if (ingresarLongitud && logitudNumero) {
      valor = logitudNumero.valor;
      pesos = PesoMedidaProductoSeleccionado && PesoMedidaProductoSeleccionado.valor !== 'vacio'
        ? { valor: PesoMedidaProductoSeleccionado.valor, unidadMedida: PesoMedidaProductoSeleccionado.unidadMedida }
        : { valor: IdPesoUnico, unidadMedida: UnicaUnidadMedidaUnic };

    } else if (!UnidadMedidaSeleccionadoSimbolo || UnidadMedidaSeleccionadoSimbolo === "Unic") {
      valor = 0;
      pesos = { valor: IdPesoUnico, unidadMedida: UnicaUnidadMedidaUnic };
    } else if (ingresarPeso && PesoMedidaProductoSeleccionado) {
      valor = 0;
      pesos = { valor: PesoMedidaProductoSeleccionado.valor, unidadMedida: PesoMedidaProductoSeleccionado.unidadMedida };
    } else {
      valor = 0;
      pesos = { valor: IdPesoUnico, unidadMedida: UnicaUnidadMedidaUnic };
    }
  preciosSeleccionados
    try {
      const response = await AgregarMedidaProducto(
        ProductoSeleccionado,
        {
          valor,
          unidadMedida: logitudNumero ? logitudNumero.unidadMedida : UnidadMedidaSeleccionado,
        },
        pesos,
        preciosSeleccionados,
      );
  
      if (response && (response.status === 200 || response.status === 500)){
        Swal.fire({
          title: response.status === 200 ? '¡Exitoso!' : '¡Error!',
          text: response.status === 200 ? 'Medida agregada exitosamente!' : '¡La medida no pudo ser agregada!',
          icon: response.status === 200 ? 'success' : 'error',
          timerProgressBar: true,
          timer: 1500,
          showConfirmButton: false,
        });
      }else if (response && response.msg) {
        Swal.fire({
          title:'¡Error!',
          text: '¡' + response.msg + '!',
          icon: 'error',
          timerProgressBar: true,
          timer: 2000,
          showConfirmButton: false,
        });
      }
  
      if (response && response.status === 200) {
        cerrarModalAgregar();
        setRefreshData(true);
        limpiarDatos();
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
  }, [ProductoSeleccionado, logitudNumero, ingresarLongitud, ingresarPeso, UnidadMedidaSeleccionado, PesoMedidaProductoSeleccionado, preciosSeleccionados, cerrarModalAgregar, setRefreshData]);

  const editarMedidaProducto = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  
    let valor: number | string;
    let pesos: {  
      valor: string;
      unidadMedida: string;
    };
    if (!ProductoSeleccionado || !logitudNumero || !UnidadMedidaSeleccionado || preciosSeleccionados.length ===0) {
      Swal.fire({
        title: '¡Error!',
        text: 'Por favor selecciona todos los campos antes de editar la medida.',
        icon: 'error',
        timerProgressBar: true,
        timer: 1500,
        showConfirmButton: false,
      });
      return;
    }
  
    if (!UnidadMedidaSeleccionadoSimbolo || UnidadMedidaSeleccionadoSimbolo === "Unic") {
      valor = 0;
      pesos = { valor: IdPesoUnico, unidadMedida: UnicaUnidadMedidaUnic };
    } else if (PesoMedidaProductoSeleccionado) {
      valor = logitudNumero.valor;
      pesos = {
        valor: PesoMedidaProductoSeleccionado.valor,
        unidadMedida: PesoMedidaProductoSeleccionado.unidadMedida
      };
    } else {
      valor = logitudNumero.valor;
      pesos = { valor: IdPesoUnico, unidadMedida: UnicaUnidadMedidaUnic };
    }
  
    if (modalData?.id) {
      try {
        const response = await EditarMedidaProducto(
          modalData.id,
          ProductoSeleccionado,
          { valor, unidadMedida: logitudNumero.unidadMedida },
          pesos,
          preciosSeleccionados
        );
  
        Swal.fire({
          title: response ? '¡Exitoso!' : '¡Error!',
          text: response ? 'Medida editada exitosamente!' : '¡La medida no pudo ser editada!',
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
  }, [ProductoSeleccionado, logitudNumero, UnidadMedidaSeleccionado, PesoMedidaProductoSeleccionado, preciosSeleccionados, modalData, closeModal, setRefreshData]);

  const eliminarMedidaProducto = useCallback(async (identificador: string) => {
    try {
      const response = await EliminarMedidaProducto(identificador);
      Swal.fire({
        title: response ? '¡Exitoso!' : '¡Error!',
        text: response ? '¡Medida eliminada exitosamente!' : '¡El Medida no pudo ser eliminada!',
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
  }, [setRefreshData]);

  const generatePDF = () => {
    const doc = new jsPDF();

    const columnsToInclude = [0, 1, 2, 3];
    
    const tableColumn = columns
      .filter((_, index) => columnsToInclude.includes(index))
      .map((col) => col.Header as string);
  
    const tableRows = data.map((row) => {
      const rowData = Object.values(row);
      
      const filteredRowData = columnsToInclude.map((index) => {
        if (index === 1) {
          return rowData[3]; 
        } else if (index === 2) {
          return rowData[1]; 
        } else if (index === 3) {
          return rowData[4] ? "Habilitado" : "Inhabilitado";
        }
        return rowData[index];
      });
  
      return filteredRowData;
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
        Agregar Medida
      </button>

      <Table<DataRowMedidaProducto> columns={columns} data={data} setRefreshData={() => {}}/>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Edit Modal"
        className="Modal"
        overlayClassName="Overlay"
      >
        <div className="ModalContentSinImagen">
          <form className="formularioEditar" onSubmit={editarMedidaProducto}>
            <div>
              <h2 className="titleSinFondoModal">Editar Medida Producto</h2>
              <label htmlFor="categoria-select" className="LabelModal">Selecciona un producto</label>
              <select
                id="categoria-select"
                className="selectModal"
                value={ProductoSeleccionado}
                onChange={handleChangeProducto}
              >
                {modalData && (
                  <option value={modalData.idProductoApi}>
                    {modalData.nombreProductoBase}
                  </option>
                )}
                {datosProducto
                  .filter((Producto) => Producto.nombreProductoApi !== modalData?.nombreProductoBase)
                  .map((Producto) => (
                    <option key={Producto.idProductoApi} value={Producto.idProductoApi}>
                      {Producto.nombreProductoApi}
                    </option>
                  ))}
              </select>

              <label htmlFor="unidad-medida-select" className="LabelModal">Unidad de medida</label>
              <select
                id="unidad-medida-select"
                className="selectModal"
                value={modalData?.unidadMedidaId || ""}
                onChange={handleChangeLongitudSelect}
              >
                {datosUnidadMedidaSelect
                .filter((unidadMedida) => unidadMedida.idUnidadMedidaApi === modalData?.unidadMedidaId)
                .map((unidadMedida) => (
                  <option key={unidadMedida.idUnidadMedidaApi} value={unidadMedida.idUnidadMedidaApi}>
                    {unidadMedida.nombreUnidadMedida + " (" + unidadMedida.simboloApi + ")"}
                  </option>
                ))}
              </select>
              {UnidadMedidaSeleccionadoSimbolo && UnidadMedidaSeleccionadoSimbolo !== "Unic"  ? (
                <>
                  <label htmlFor="longitud" className="LabelModal">Longitud</label>
                  <input
                    id="longitud"
                    type="number"
                    value={modalData?.longitud || 0}
                    onChange={handleChangeLongitud}
                    className="inputEditarForm"
                  />
                </>
              ) : null}
              {((UnidadMedidaSeleccionadoTipo === "longitud" && (UnidadMedidaSeleccionadoSimbolo !== "Mt²" && UnidadMedidaSeleccionadoSimbolo !== "cm²" && UnidadMedidaSeleccionadoSimbolo !== "mt")) || UnidadMedidaSeleccionadoTipo === "peso" ) && UnidadMedidaSeleccionadoSimbolo !== "YD" ? (
                <>
                  <label htmlFor="peso-select" className="LabelModal">Peso</label>
                  <select
                    id="peso-select"  
                    className="selectModal"
                    value={PesoMedidaProductoSeleccionado?.valor}
                    onChange={handleChangePeso}
                  >
                    {datosPesoSelect.map((peso) => (
                      <option key={peso.idPesoApi} value={peso.idPesoApi}>
                        {peso.PesoApi + " " + peso.simboloUnidadMedida}
                      </option>
                    ))}
                  </select>
                </>
              ) : null}
              
              <label htmlFor="precio-select" className="LabelModal">Precio de venta</label>
              <select
                id="precio-select"
                className="selectModal"
                value={PrecioVentaSeleccionado}
                onChange={handleChangePrecioVenta}
              >
                {datosPrecioVentaSelect
                  .filter((precioVenta) => PesoSimboloMedidaProducto === precioVenta.simboloUnidadMedida)
                  .map((precioVenta) => (
                    <option key={precioVenta.idPrecioVentaApi} value={precioVenta.idPrecioVentaApi}>
                      {"$" + precioVenta.precioUnitarioApi + " X " + precioVenta.simboloUnidadMedida + " en color " + precioVenta.color}
                    </option>
                  ))}
              </select>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" className="botonEditarModal">
                Editar
              </button>
              <button type="button" onClick={closeModal} className="CerrarModalBotonGeneral">
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
        className="ModalDashboard"
        overlayClassName="Overlay"
      >
        <div className="ModalDashboard" style={{gap:'60px'}}>
          <div className="ModalContentSinImagen">
              <form className="formularioAgregar" onSubmit={agregarMedidaProducto}>
                <div>
                <h2 className="titleSinFondoModal">Agregar Medida Producto</h2>
                  <label htmlFor="producto-select" className="LabelModal">Selecciona un producto</label>
                  <select
                    id="producto-select"
                    className="selectModal"
                    value={ProductoSeleccionado || ""}
                    onChange={handleChangeProducto}
                  >
                    <option value="" disabled>Selecciona un producto</option>
                    {datosProducto.map((producto) => (
                      <option key={producto.idProductoApi} value={producto.idProductoApi}>
                        {producto.nombreProductoApi}
                      </option>
                    ))}
                  </select>

                  <label htmlFor="unidad-medida-select" className="LabelModal">Seleccione una unidad de medida</label>
                  <select
                    id="unidad-medida-select"
                    className="selectModal"
                    value={UnidadMedidaSeleccionado || ""}
                    onChange={handleChangeUnidadMedida}
                  >
                    <option value="" disabled>Selecciona una unidad de medida</option>
                    {datosUnidadMedidaSelect.map((unidadMedida) => (
                      <option key={unidadMedida.idUnidadMedidaApi} value={unidadMedida.idUnidadMedidaApi}>
                        {unidadMedida.nombreUnidadMedida + " (" + unidadMedida.simboloApi + ")"}
                      </option>
                    ))}
                  </select>

                  <label className="LabelModal">
                    <input
                      type="checkbox"
                      checked={UnidadMedidaSeleccionadoSimbolo !== "Unic" && ingresarLongitud}
                      onChange={handleCheckboxLongitud}
                      disabled={UnidadMedidaSeleccionadoSimbolo === "Unic"}
                    />
                    Ingresar Longitud
                  </label>
                  <label className="LabelModal">
                    <input
                      type="checkbox"
                      checked={ingresarPeso}
                      onChange={handleCheckboxPeso}
                    />
                    Ingresar Peso
                  </label>
                  {ingresarLongitud && (
                    <>
                      <label htmlFor="longitud" className="LabelModal">Longitud</label>
                      <input
                        id="longitud"
                        type="number"
                        value={logitudNumero?.valor || ""}
                        onChange={handleChangeLongitud}
                        className="inputEditarForm"
                      />
                    </>
                  )}

                  {ingresarPeso && (
                    <>
                      <label htmlFor="peso-select" className="LabelModal">Seleccione un peso</label>
                      <select
                        id="peso-select"
                        className="selectModal"
                        value={PesoMedidaProductoSeleccionado?.valor || ""}
                        onChange={handleChangePeso}
                      >
                        <option value="" disabled>Selecciona un peso</option>
                        {datosPesoSelect.map((peso) => (
                          <option key={peso.idPesoApi} value={peso.idPesoApi}>
                            {peso.PesoApi + " " + peso.simboloUnidadMedida}
                          </option>
                        ))}
                      </select>
                    </>
                  )}

                  <label htmlFor="precio-select" className="LabelModal">Seleccione un precio de venta</label>
                  <select 
                    id="precio-select"
                    className="selectModal"
                    value={PrecioVentaSeleccionado || ""}
                    onChange={handleChangePrecioVenta}
                  >
                    <option value="" disabled>Selecciona un precio</option>
                    {datosPrecioVentaSelect
                      .filter((precioVenta) => {
                        const yaSeleccionado = preciosSeleccionados.some(
                          (p) => p.idPrecioVentaApi === precioVenta.idPrecioVentaApi
                        );
                        if (yaSeleccionado) return false;
                        if ( (ingresarPeso && (PesoMedidaProductoSeleccionado !== null && PesoMedidaProductoSeleccionado.valor !== '')) || UnidadMedidaSeleccionadoTipo === 'longitud' || UnidadMedidaSeleccionadoSimbolo === precioVenta.simboloUnidadMedida) {
                          
                          return ((ingresarPeso && (PesoMedidaProductoSeleccionado !== null && PesoMedidaProductoSeleccionado.valor !== ''))) ? 'peso' === precioVenta.tipoPrecioVenta ||  UnidadMedidaSeleccionadoSimbolo === precioVenta.simboloUnidadMedida : UnidadMedidaSeleccionadoSimbolo === precioVenta.simboloUnidadMedida ? UnidadMedidaSeleccionadoSimbolo === precioVenta.simboloUnidadMedida : false;
                        }

                        // return ["Unic", UnidadMedidaSeleccionadoSimbolo].includes(precioVenta.simboloUnidadMedida);
                      })
                      .map((precioVenta) => (
                        <option key={precioVenta.idPrecioVentaApi} value={`${precioVenta.idPrecioVentaApi}|${precioVenta.simboloUnidadMedida}`}>
                          {"$" + precioVenta.precioUnitarioApi + " X " + precioVenta.simboloUnidadMedida + " en color " + precioVenta.color}
                        </option>
                      ))}
                  </select>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button type="submit" className="botonEditarModal">
                    Agregar
                  </button>
                  <button type="button" onClick={cerrarModalAgregar} className="CerrarModalBotonGeneral">
                    Cerrar
                  </button>
                </div>
              </form>
            </div>
            {preciosSeleccionados.length > 0 ? (
            <>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "40px", width: "260px",}}>
                <div className="ImageContent">
                  <PrecioSelect
                      selectedPrecio={preciosSeleccionados}
                      datosPrecioVentaSelect={datosPrecioVentaSelect}
                      onSelect={(datosSelect) => {
                        if (JSON.stringify(datosSelect) !== JSON.stringify(preciosSeleccionados)) {
                          setPreciosSeleccionados(datosSelect);
                        }
                      } } UnidadMedidaSeleccionadoTipo={UnidadMedidaSeleccionadoTipo} UnidadMedidaSeleccionadoSimbolo={UnidadMedidaSeleccionadoSimbolo} PesoSimboloMedidaProducto={PesoSimboloMedidaProducto} ingresarPeso={PesoMedidaProductoSeleccionado?.valor ? PesoMedidaProductoSeleccionado?.valor : ''} />
                </div>
              </div>
            </>
            ) : null}
        </div>
      </Modal>

      </div>
    </>
  );
};

export default DataTable;
