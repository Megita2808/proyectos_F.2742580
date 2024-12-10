/* eslint-disable react-hooks/exhaustive-deps */

"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import { Column } from "react-table";
import Image from "next/image";

import jsPDF from "jspdf";
import "jspdf-autotable";

import Modal from "react-modal";
import Swal from 'sweetalert2';

import { Image as ImageIcon, Pencil, Trash2 } from "lucide-react";

import { DataRowMedidaVenta, PesoMedidaVenta, Colores, ColoresInterface, Peso } from '../tiposFilas/medidaVenta';

import PrecioSelect from './selects/SelectPrecio';
import ImagenSelectEditar from './selects/selectImagenesEditar';
import Table from '../tabla/formatoTabla';
import StatusBoton from './estado/estado';
import PaginatedCheckboxGroup from './checkBox/listaPesos';

import EditarMedidaVenta from '@/service/api/catalogo/medidaVenta/EditarMedidaVenta';
import EliminarMedidaVenta from '@/service/api/catalogo/medidaVenta/EliminarMedidaVenta';
import AgregarMedidaVenta from '@/service/api/catalogo/medidaVenta/AgregarMedidaVenta';

import { getMedidaProducto, MedidaProducto } from "@/service/api/catalogo/medidaProducto/TodoMedidaProducto";
import { getPesos } from "@/service/api/catalogo/peso/TodoPeso";
import { getPreciosVenta } from "@/service/api/precioVenta/TodoPrecioVenta";
import { getUnidadMedidaTipo } from "@/service/api/unidadMedida/TipoUnidadMedida";

import { useModal } from '../../Sidebar/use-modale';
import { useSidebar } from '../../Sidebar/use-sidebar'; 

Modal.setAppElement('#root');

interface DataTableProps {  
  data: DataRowMedidaVenta[];
  setRefreshData: React.Dispatch<React.SetStateAction<boolean>>;
}

const DataTable: React.FC<DataTableProps> = ({ data, setRefreshData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ModalAgregarAbrir, setIsModalAgregar] = useState(false);
  const [isModalAbrirImagen, setIsModalAbrirImagen] = useState(false);

  const { isSidebarOpen, toggleSidebar } = useSidebar();
  const { setModalOpen, setModalAgregar, setModalAbrirImagen } = useModal();

  const [datosMedidaProducto, setDataMedidaProducto] = useState<MedidaProducto[]>([]);
  const [PrecioVentaSeleccionado, setSelectedPrecioVenta] = useState<Colores[]>([]);
  const [selectedPrecio, setSelectedPrecio] = useState<string>('');
  const [MedidaProductoSeleccionado, setSelectedMedidaProducto] = useState<string>('');
  const [PesoSimboloMedidaProducto, setPesoSimboloMedidaProducto] = useState<string>('gm');
  const [UnidadMedidaSeleccionado, setSelectedUnidadMedida] = useState<string>('');
  const [logitudNumero, setLongitudNumero] = useState<{ valor: number; unidadMedida: string } | null>(null);
  const [selectedPesos, setSelectedPesos] = useState<{ valor: string; unidadMedida: string }[]>([]);
  
  const [datosPesoSelect, setDataPeso] = useState<{ idPesoApi: string; PesoApi: number; idUnidadMedida: string; simboloUnidadMedida: string }[]>([]);
  const [datosPrecioVentaSelect, setDataPrecioVenta] = useState<{ idPrecioVentaApi: string; precioUnitarioApi: number; idUnidadMedidaPrecioVenta: string; color: string; simboloUnidadMedida: string }[]>([]);
  const [datosUnidadMedidaSelect, setDataUnidadMedida] = useState<{ idUnidadMedidaApi: string; nombreUnidadMedida: string; simboloApi: string;}[]>([]);
  
  const [selectedImageId, setSelectedImageId] = useState<string | undefined>(undefined);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | undefined>(undefined);

  const [showAgregarButton, setShowAgregarButton] = useState(false);
  const [modalImageUrl, setModalImageUrl] = useState<string | null>(null);

  const [MedidaProductoSeleccionadoCompleto, setSelectedMedidaProductoCompleto] = useState<MedidaProducto | null>()
  
  const [modalData, setModalData] = useState<{
    id: string;
    idMedidaProductoApi: string;
    nombreMedidaProductoBase: string;
    longitud: number;
    unidadMedidaId: string;
    pesoId: string;
    precioVentaId: string;
    urlImagen: string;
  } | null>(null);

  const fetchMedidasProducto = useCallback(async () => {
    try {
      const medidasProducto = await getMedidaProducto();
      setDataMedidaProducto(medidasProducto);
    } catch (error) {
      console.error('Error al obtener las medidas de producto:', error);
    }
  }, []);

  const fetchPrecioVenta = useCallback(async () => {
    try {
      const preciosVenta = await getPreciosVenta();
      const datosPrecioVentaSelect = preciosVenta.map((precioVenta) => ({
        idPrecioVentaApi: precioVenta._id,
        precioUnitarioApi: precioVenta.precioUnitario,
        color: precioVenta.color?.nombreColor || "sin color del precio",
        idUnidadMedidaPrecioVenta: precioVenta.unidadMedida?._id || "sin identificador de la unidad de medida",
        simboloUnidadMedida: precioVenta.unidadMedida?.simbolo || "sin simbolo de la unidad de medida",
      }));
      setDataPrecioVenta(datosPrecioVentaSelect);
    } catch (error) {
      console.error('Error al obtener las categorías:', error);
    }
  }, []);

  const fetchPesos = useCallback(async () => {
    try {
      const pesos = await getPesos();
      const datosPesoSelect = pesos.map((peso) => ({
        idPesoApi: peso._id,
        PesoApi: peso.peso,
        simboloUnidadMedida: peso.unidadMedida?.simbolo || "sin simbolo de la unidad de medida",
        idUnidadMedida: peso.unidadMedida?._id || "sin id de la unidad de medida",
      }));
      setDataPeso(datosPesoSelect);
    } catch (error) {
      console.error('Error al obtener las categorías:', error);
    }
  }, []);

  const fetchUnidadMedida = useCallback(async () => {
    try {
      const unidadesMedida = await getUnidadMedidaTipo("longitud");
      const datosUnidadesMedidaSelect = unidadesMedida.map((unidadMedida) => ({
        idUnidadMedidaApi: unidadMedida._id,
        nombreUnidadMedida: unidadMedida.nombre,
        simboloApi: unidadMedida.simbolo,
      }));
      setDataUnidadMedida(datosUnidadesMedidaSelect);
    } catch (error) {
      console.error('Error al obtener las categorías:', error);
    }
  }, []);

  useEffect(() => {
    fetchMedidasProducto();
    fetchPrecioVenta();
    fetchPesos();
    fetchUnidadMedida();
  }, []);

  useEffect(() => {
    setModalOpen(isModalOpen);
  }, [isModalOpen, setModalOpen]);

  useEffect(() => {
    setModalAgregar(ModalAgregarAbrir);
  }, [ModalAgregarAbrir, setModalAgregar]);

  useEffect(() => {
    setModalAbrirImagen(isModalAbrirImagen);
  }, [isModalAbrirImagen, setModalAbrirImagen]);

  const columns: Column<DataRowMedidaVenta>[] = useMemo(
    () => [
      { 
        Header: "ID", 
        accessor: "col1", 
        Cell: ({ value }) => <div style={{ textAlign: 'center' }}>{value}</div>, 
      },
      { 
        Header: "Medida de Producto", 
        accessor: "medidaProducto", 
        Cell: ({ value }) => <div style={{ textAlign: 'center' }}>{value}</div>, 
      },
      { 
        Header: "Nombre", 
        accessor: "medidaVenta", 
        Cell: ({ value }) => <div style={{ textAlign: 'center' }}>{value}</div>, 
      },
      {
        Header: "Imagen",
        accessor: "urlImagen",
        Cell: ({ value }) => (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <button onClick={() => abrirModalImagen(value)}>
              <ImageIcon className="h-6 w-6 hover:text-blue-600" />
            </button>
          </div>
        ),
      },
      {
        Header: "Estado",
        accessor: "enabled",
        Cell: ({ value, row }) => (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <StatusBoton isEnabled={value} id={row.original.id} modulo="medidaVenta" disabled={false}/>
          </div>
        ),
      },
      {
        Header: "Editar",
        Cell: ({ row }) => (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <button
              onClick={() => openModal(
                row.original.id,
                row.original.medidaProducto,
                row.original.idMedidaProducto,
                row.original.longitud,
                row.original.idUnidadMedida,
                row.original.datosPesoTodo,
                row.original.idPeso,
                row.original.idUnidadMedidaPeso,
                row.original.datosColoresTodo,
                row.original.unidadMedidaSimbolo
              )}
            >
              <Pencil className="h-6 w-6 hover:text-green-600" />
            </button>
          </div>
        ),
      },
      {
        Header: "Eliminar",
        Cell: ({ row }) => (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <button onClick={() => eliminarMedidaVenta(row.original.id)}>
              <Trash2 className="h-6 w-6 hover:text-red-600" />
            </button>
          </div>
        ),
      },
    ],
    [setRefreshData]
  );

  const handleChangeMedidaProducto = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMedidaProducto(e.target.value);
  };

  const handleChangeLongitudSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nuevoValor = e.target.value;
    if (modalData) {
      setModalData({ ...modalData, unidadMedidaId: nuevoValor });
    }
    setLongitudNumero({ valor: logitudNumero?.valor || modalData?.longitud || 0, unidadMedida: nuevoValor});
  };
  
  const handleChangeLongitud = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nuevoValor = Number(e.target.value);
    if (modalData) {
      setModalData({ ...modalData, longitud: nuevoValor });
    }
    setLongitudNumero({ valor: nuevoValor, unidadMedida: modalData?.unidadMedidaId || "sin identificador"});
  };

  const handleChangePeso = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
  
    const selectedOption = datosPesoSelect.find((peso) => peso.idPesoApi === value);
  
    if (selectedOption) {
      const updatedPesos = checked
        ? selectedOption.idUnidadMedida
          ? [...selectedPesos, { valor: selectedOption.idPesoApi, unidadMedida: selectedOption.idUnidadMedida }]
          : selectedPesos
        : selectedPesos.filter(peso => peso.valor !== value);
  
      setSelectedPesos(updatedPesos);
      setPesoSimboloMedidaProducto(selectedOption.simboloUnidadMedida);
    }
  };
  
  const handleChangePrecioVenta = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    setSelectedPrecio(selectedValue)
    if (selectedImageUrl && PrecioVentaSeleccionado) {
      setShowAgregarButton(true)
    }
  };

  const handleChangeUnidadMedida = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedUnidadMedida(e.target.value);

    setLongitudNumero(prevState => ({
      valor: prevState?.valor || 0,
      unidadMedida: e.target.value
    }));
  };

  const handleLongitudChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valorNumerico = Number(e.target.value);
    setLongitudNumero(prevState => ({
      valor: valorNumerico,
      unidadMedida: prevState?.unidadMedida || "vacio"
    }));
  };

  const agregarConjuntoDeDatos = () => {
    const nuevoConjunto: Colores = {
      PrecioVenta: selectedPrecio,
      imagen: selectedImageId || "",
    };
    
    const existe = PrecioVentaSeleccionado.some(
      (item) =>
        item.PrecioVenta === nuevoConjunto.PrecioVenta &&
        item.imagen === nuevoConjunto.imagen
    );

    if (!existe) {
      setSelectedPrecioVenta((prevState) => [
        ...prevState,
        nuevoConjunto,
      ]);
    }

    setShowAgregarButton(false);
    setSelectedPrecio('');
  };

  const abrirModalImagen = (imageUrl: string) => {
    setModalImageUrl(imageUrl);
    setIsModalAbrirImagen(true);
  };

  const cerrarModalImagen = () => {
    setIsModalAbrirImagen(false);
    setModalImageUrl(null);
  };

  const openModal = useCallback(async (id: string, nombreMedidaProductoBase: string, idMedidaProductoApi: string, longitud: number, unidadMedidaId: string, pesoDatos: Peso, pesoId: string, unidadMedidaPesoId: string, coloresDatos: ColoresInterface, simboloUnidadMedida: string) => {
    setLongitudNumero({ valor: longitud, unidadMedida: unidadMedidaId });
    setSelectedMedidaProducto(idMedidaProductoApi)
    pesoDatos.valores.forEach(item => {
      setSelectedPesos(prevState => [
        ...prevState,
        { valor: item.valor._id, unidadMedida: unidadMedidaPesoId }
      ]);
    });

    const nuevosDatos = coloresDatos.colores.map(itemNuevo => ({
      PrecioVenta: itemNuevo.PrecioVenta._id,
      imagen: itemNuevo.idImagen
    }));
    setSelectedPrecioVenta(nuevosDatos);
    
    setPesoSimboloMedidaProducto(simboloUnidadMedida)
    setModalData({
      id,
      idMedidaProductoApi,
      nombreMedidaProductoBase,
      longitud,
      unidadMedidaId,
      pesoId,
      precioVentaId : coloresDatos.colores[0].PrecioVenta._id,
      urlImagen : coloresDatos.colores[0].imagen,
    });
    setIsModalOpen(true);
  }, [modalData, fetchMedidasProducto]);

  const limpiarDatos = () => {
    setSelectedMedidaProducto('');

    setModalImageUrl('');

    setSelectedPrecioVenta([]);

    setSelectedPesos([]);

    setPesoSimboloMedidaProducto(prevState => prevState || 'gm');
  
    setSelectedPrecioVenta

    setSelectedUnidadMedida('');

    setLongitudNumero(prevState => ({
      valor: 0,
      unidadMedida: prevState?.unidadMedida || "vacio"
    }));
  
    setDataPeso(prevState => prevState.length > 0 ? prevState : []);
    setDataPrecioVenta(prevState => prevState.length > 0 ? prevState : []);
    setDataUnidadMedida(prevState => prevState.length > 0 ? prevState : []);
  
    setModalData(null);

    if (isSidebarOpen) {
      toggleSidebar();
    }
  };

  const closeModal = useCallback(() => {
    limpiarDatos()
    setIsModalOpen(false);
  }, []);

  const abrirModalAgregar = useCallback(() => {
    limpiarDatos();
    if (isSidebarOpen) {
      toggleSidebar();
    }
    setIsModalAgregar(true);
  }, []);

  const cerrarModalAgregar = useCallback(() => {
    limpiarDatos();
    setIsModalAgregar(false);
  }, []);

  const agregarMedidaVenta = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!MedidaProductoSeleccionado || !logitudNumero || !UnidadMedidaSeleccionado || !selectedPesos || !PrecioVentaSeleccionado || !selectedImageId) {
      Swal.fire({
        title: '¡Error!',
        text: 'Por favor selecciona todos los campos antes de agregar la medida.',
        icon: 'error',
        timerProgressBar: true,
        timer: 1500,
        showConfirmButton: false,
      });
      return;
    }
  
    try {
      const pesoFormatted: PesoMedidaVenta = {
        valores: selectedPesos.map(peso => ({ valor: peso.valor })),
        unidadMedida: selectedPesos[0].unidadMedida,
      };

      const PrecioVentaSeleccionadoFormato: Colores[] = PrecioVentaSeleccionado.map(precioVenta => ({
        PrecioVenta: precioVenta.PrecioVenta,
        imagen: precioVenta.imagen,
      }));
      
      const response = await AgregarMedidaVenta(
        MedidaProductoSeleccionado,
        logitudNumero,
        pesoFormatted,
        PrecioVentaSeleccionadoFormato
      );
  
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
  }, [MedidaProductoSeleccionado, selectedPesos, PrecioVentaSeleccionado, UnidadMedidaSeleccionado, logitudNumero, selectedImageId]);

  const editarMedidaVenta = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (modalData?.id && logitudNumero && selectedPesos && MedidaProductoSeleccionado && PrecioVentaSeleccionado && selectedImageId) {
      try {
        const pesoFormatted: PesoMedidaVenta = {
          valores: selectedPesos.map(peso => ({ valor: peso.valor })),
          unidadMedida: selectedPesos[0].unidadMedida,
        };
        
        const PrecioVentaSeleccionadoFormato: Colores[] = PrecioVentaSeleccionado.map(precioVenta => ({
          PrecioVenta: precioVenta.PrecioVenta,
          imagen: precioVenta.imagen,
        }));

        const response = await EditarMedidaVenta(
          modalData.id,
          MedidaProductoSeleccionado,
          logitudNumero,
          pesoFormatted,
          PrecioVentaSeleccionadoFormato
        );
  
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
  }, [MedidaProductoSeleccionado, selectedPesos, PrecioVentaSeleccionado, UnidadMedidaSeleccionado, logitudNumero, selectedImageId]);

  const eliminarMedidaVenta = useCallback(async (identificador: string) => {
    try {
      const response = await EliminarMedidaVenta(identificador);
      Swal.fire({
        title: response ? '¡Exitoso!' : '¡Error!',
        text: response ? '¡Producto eliminada exitosamente!' : '¡El producto no pudo ser eliminada!',
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

  useEffect(() => {
    const medidaUnicaDatos = datosMedidaProducto.find(
      medida => medida._id === MedidaProductoSeleccionado
    );
  
    setSelectedMedidaProductoCompleto(medidaUnicaDatos || null);
  }, [MedidaProductoSeleccionado, datosMedidaProducto]);

  return (
    <>
      <div style={{ padding: "20px" }}>
        <button className="botonAgregado" onClick={abrirModalAgregar}>
          Agregar Medida
        </button>

        <Table<DataRowMedidaVenta> columns={columns} data={data} setRefreshData={() => {}}/>
        
        <Modal
          isOpen={isModalAbrirImagen}
          onRequestClose={cerrarModalImagen}
          contentLabel="Imagen"
          className="modal-abrir-imagen"
        >
          {modalImageUrl && (
            <div className="imagen-contenedor"> 
              <Image 
                src={modalImageUrl}           
                layout="intrinsic"
                width={200}
                height={200}
                alt="Imagen"
                className="imagen-modal"
              />
            </div>
          )}
        </Modal>

        <Modal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          contentLabel="Edit Modal"
          className="ModalDashboard"
          overlayClassName="Overlay"
        >
          <div className="ModalDashboard">
            <div className="ModalContentSinImagen">
              <form className="formularioEditar" onSubmit={editarMedidaVenta}>
                <div>
                  <h2 className="titleSinFondoModal">Editar Medida Venta</h2>
                  <label htmlFor="producto-select" className="LabelModal">Selecciona una medida de producto</label>
                  <select
                    id="categoria-select"
                    className="selectModal"
                    value={MedidaProductoSeleccionado}
                    onChange={handleChangeMedidaProducto}
                  >
                    {modalData && (
                      <option value={modalData.idMedidaProductoApi}>
                        {modalData.nombreMedidaProductoBase}
                      </option>
                    )}
                    {datosMedidaProducto
                      .filter((MedidaProducto) => (MedidaProducto.longitudMedida?.valor + " " + MedidaProducto.longitudMedida?.unidadMedida?.simbolo) !== modalData?.nombreMedidaProductoBase)
                      .map((MedidaProducto) => (
                        <option key={MedidaProducto._id} value={MedidaProducto._id}>
                          {MedidaProducto.longitudMedida?.valor + " " + MedidaProducto.longitudMedida?.unidadMedida?.simbolo}
                        </option>
                      ))}
                  </select>
                  <label htmlFor="longitud" className="LabelModal">Longitud</label>
                  <input
                    id="longitud"
                    type="number"
                    value={modalData?.longitud || 0}
                    onChange={handleChangeLongitud}
                    className="inputEditarForm"
                  />

                  <label htmlFor="unidad-medida-select" className="LabelModal">Unidad de medida</label>
                  <select
                    id="unidad-medida-select"
                    className="selectModal"
                    value={modalData?.unidadMedidaId || ""}
                    onChange={handleChangeLongitudSelect}
                  >
                    {datosUnidadMedidaSelect.map((unidadMedida) => (
                      <option key={unidadMedida.idUnidadMedidaApi} value={unidadMedida.idUnidadMedidaApi}>
                        {unidadMedida.nombreUnidadMedida + " (" + unidadMedida.simboloApi + ")"}
                      </option>
                    ))}
                  </select>

                  <label htmlFor="precio-select" className="LabelModal">Precio de venta</label>
                  <select
                    id="precio-select"
                    className="selectModal"
                    value={selectedPrecio}
                    onChange={handleChangePrecioVenta}
                  >
                    {datosPrecioVentaSelect.map((precioVenta) => (
                      <option key={precioVenta.idPrecioVentaApi} value={precioVenta.idPrecioVentaApi}>
                        {precioVenta.precioUnitarioApi + " Pesos X " + precioVenta.simboloUnidadMedida + " en color " + precioVenta.color}
                      </option>
                    ))}
                  </select>
                </div>
                <ImagenSelectEditar primerDato={modalData?.urlImagen || ""} moduduloBusqueda="MedidaVenta" onSelect={(id, url) => {
                  setSelectedImageId(id);
                  setSelectedImageUrl(url);
                }} />
                <div style={{ display: 'flex', gap: '10px' }}>
                  {showAgregarButton && (
                    <button type="button" className="botonAgregar" onClick={agregarConjuntoDeDatos}>
                      Agregar conjunto de datos
                    </button>
                  )}
                  <button type="submit" className="botonEditarModal">
                    Editar Medida de Producto
                  </button>
                  <button type="button" onClick={closeModal} className="CerrarModalBotonGeneral">
                    Cerrar
                  </button>
                </div>
              </form>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "40px", width: "260px", marginRight: "50px", marginLeft: "-95px",  }}>
              <div className="ImageContent">
                <PrecioSelect selectedPrecio={PrecioVentaSeleccionado} datosPrecioVentaSelect={datosPrecioVentaSelect}
                  onSelect={(datosSelect, selectedImageUrl2) => {
                    if(datosSelect != PrecioVentaSeleccionado){
                      setSelectedPrecioVenta(datosSelect);
                    }
                    if(selectedImageUrl2 != "vacio"){
                      setSelectedImageUrl(selectedImageUrl2)
                    };
                }}/>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "40px", width: "600px"  }}>
              <div className="ImageContent">
                <PaginatedCheckboxGroup
                  datosPesoSelect={datosPesoSelect}
                  selectedPesos={selectedPesos}
                  onChange={handleChangePeso}
                />
              </div>
              <div className="ImageContent">
                {selectedImageUrl && (
                  <div className="imagen-contenedor"> 
                    <Image 
                      src={selectedImageUrl}           
                      layout="intrinsic"
                      width={150}
                      height={150}
                      alt="Imagen"
                      className="imagen-modal"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </Modal>

        <Modal
          isOpen={ModalAgregarAbrir}
          onRequestClose={cerrarModalAgregar}
          contentLabel="Edit Modal"
          className="ModalDashboard"
          overlayClassName="Overlay"
        >
          <div className="ModalDashboard">
           <div className="ModalContentSinImagen">
              <form className="formularioAgregar" onSubmit={agregarMedidaVenta}>
                <div>
                  <h2 className="titleSinFondoModal">Agregar Medida Venta</h2>
                  <label htmlFor="producto-select" className="LabelModal">Selecciona una medida de producto</label>
                  <select
                    id="producto-select"
                    className="selectModal"
                    value={MedidaProductoSeleccionado || ""}
                    onChange={handleChangeMedidaProducto}
                  >
                    <option value="" disabled>Selecciona un producto</option>
                    {datosMedidaProducto.map((medidaProducto) => (
                      <option key={medidaProducto._id} value={medidaProducto._id}>
                        {medidaProducto.longitudMedida?.valor + " " + medidaProducto.longitudMedida?.unidadMedida?.simbolo}
                      </option>
                    ))}
                  </select>

                  <label htmlFor="categoryName" className="LabelModal">Longitud</label>
                  <input
                    id="longitud"
                    type="number"
                    value={logitudNumero?.valor}
                    onChange={handleLongitudChange}
                    className="inputEditarForm" 
                  />

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
                  <label htmlFor="precio-select" className="LabelModal">Seleccione un precio de venta</label>
                  <select
                    id="precio-select"
                    className="selectModal"
                    value={selectedPrecio}
                    onChange={handleChangePrecioVenta}
                  >
                    <option value="" disabled>Selecciona un precio</option>
                    
                    {datosPrecioVentaSelect
                      .filter(medida => 
                        MedidaProductoSeleccionadoCompleto?.colores.some(
                          precioVenta => precioVenta.PrecioVenta.color.nombreColor === medida.color
                        )
                      )
                      .map(precioVenta => (
                        <option 
                          key={precioVenta.idPrecioVentaApi} 
                          value={precioVenta.idPrecioVentaApi}
                        >
                          {`${precioVenta.precioUnitarioApi} Pesos X ${precioVenta.simboloUnidadMedida} en color ${precioVenta.color}`}
                        </option>
                      ))}
                  </select>
                </div>
                <ImagenSelectEditar primerDato={modalData?.urlImagen || ""} moduduloBusqueda="MedidaVenta" onSelect={(id, url) => {
                  setSelectedImageId(id);
                  setSelectedImageUrl(url);
                }} />
                <div style={{ display: 'flex', gap: '10px' }}>
                {showAgregarButton && (
                  <button type="button" className="botonAgregar" onClick={agregarConjuntoDeDatos}>
                    Agregar conjunto de datos
                  </button>
                )}
                  <button type="submit" className="botonEditarModal">
                    Agregar Medida Producto
                  </button>
                  <button type="button" onClick={cerrarModalAgregar} className="CerrarModalBotonGeneral">
                    Cerrar
                  </button>
                </div>
              </form>
            </div>
            {PrecioVentaSeleccionado.length > 0 ? (
            <>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "40px", width: "260px", marginRight: "50px", marginLeft: "-95px",  }}>
                <div className="ImageContent">
                  <PrecioSelect selectedPrecio={PrecioVentaSeleccionado} datosPrecioVentaSelect={datosPrecioVentaSelect}
                    onSelect={(datosSelect, selectedImageUrl2) => {
                      if(datosSelect != PrecioVentaSeleccionado){
                        setSelectedPrecioVenta(datosSelect);
                      }
                      if(selectedImageUrl2 != "vacio"){
                        setSelectedImageUrl(selectedImageUrl2)
                      };
                  }}/>
                </div>
              </div>
            </>
            ) : null}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "40px", width: "600px", marginLeft:'-40px'  }}>  
              <div className="ImageContent">
                <PaginatedCheckboxGroup
                  datosPesoSelect={datosPesoSelect}
                  selectedPesos={selectedPesos}
                  onChange={handleChangePeso}
                />
              </div>
              <div className="ImageContent" style={{marginTop:'20px'}}>
                {selectedImageUrl && (
                  <div className="imagen-contenedor"> 
                    <Image 
                      src={selectedImageUrl}           
                      layout="intrinsic"
                      width={150}
                      height={150}
                      alt="Imagen"
                      className="imagen-modal"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </Modal>

      </div>
    </>
  );
};

export default DataTable;
