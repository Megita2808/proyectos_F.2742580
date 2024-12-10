import React, { useState, useMemo, useEffect, useCallback } from 'react';
import ProductoSelectXmedidaProducto from '@/components/administrador/tablas/catalogo/selects/productoXmedidaProducto';
import InputFormato from '@/components/layaout/elementos/inputLog';

import { getMedidaProducto, MedidaProducto as MedidaProducto2 } from "@/service/api/catalogo/medidaProducto/TodoMedidaProducto";
import { getProveedores, DataRowProveedor } from "@/service/api/compra/proveedor/TodoProveedor";

interface UnidadMedida {
  _id: string;
  nombre: string;
  simbolo: string;
}

interface PesoValor {
  _id: string;
  peso: number;
}

interface PrecioVenta {
  PrecioVenta: {  
    _id: string;
    precioUnitario: string;
    unidadMedida: UnidadMedida;
    color: {
      _id: string;
      nombreColor: string;
    }
  };
}

interface Colores {
  _id: string;
  PrecioVenta: PrecioVenta;
  imagen: string;
  idImagen: string;
}

interface MedidaProducto {
  _id: string;
  longitudMedida: {
    valor: number;
    unidadMedida: UnidadMedida;
  };
  peso: {
    valores: {
      _id: string;
      valor: PesoValor;
    }[];
    unidadMedida: UnidadMedida;
  };
  colores: Colores[];
}

interface CompraDetalle {
  medidaProducto: MedidaProducto;
  color: PrecioVenta;
  cantidad: number;
  total: number;
  proveedor: {
    _id: string;
    nombre: string;
  };
  producto: string;
}

interface PreciosListProps {
  onSelect: (datosSelect: CompraDetalle[]) => void;
  DatoCompletosMedida: CompraDetalle[];
  datosPrecioVentaSelect: PrecioVenta;
}

const PrecioSelect: React.FC<PreciosListProps> = ({
  onSelect,
  DatoCompletosMedida
}) => {
  const [selectedSetIndex, setSelectedSetIndex] = useState<number | null>(null);
  const [tempEditedPrices, setTempEditedPrices] = useState<{ [key: number]: string }>({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 1;

  const [Proveedores, setProveedores] = useState<DataRowProveedor[]>([]);
  const [ProveedorUnico, setProveedor] = useState<{identificador: string, nombre: string}>({identificador: '', nombre: ''});

  const [datosMedidaProducto, setDataMedidaProducto] = useState<MedidaProducto2[]>([]);
  const [MedidaProductoSeleccionado, setSelectedMedidaProducto] = useState<MedidaProducto2>();
  const [ProductoIdentificador, setProducto] = useState<string>('');
  const [PrecioVentaSeleccionado, setPrecioVentaSeleccionado] = useState<PrecioVenta>();
  const [CambioMedidaBase, setCambioMedida] = useState<boolean>(false);

  const [cantidadNueva, setCantidadNueva] = useState<number>(0);
  const [totalNueva, setTotalNueva] = useState<number>(0);

  const getPrecioVentaSelectValue = (precioVentaId: string) => {
    const precioVenta = DatoCompletosMedida.find(item => item.color.PrecioVenta._id === precioVentaId);
    return precioVenta ? precioVenta.color.PrecioVenta.precioUnitario : '';

  };

  const GetObtenerNombreProducto = (identificador : string) => {
    const medidaUnica = datosMedidaProducto.find(medida => medida._id === identificador);
    return medidaUnica?.producto.nombreProducto
  }

  const handleSetSelect = (index: number) => {
    setSelectedSetIndex(index === selectedSetIndex ? null : index);
    setTempEditedPrices({});
    setProducto('');
    setProveedor({identificador: '', nombre: ''});
    setSelectedMedidaProducto(undefined);
    setPrecioVentaSeleccionado(undefined);
    setCantidadNueva(0);
    setTotalNueva(0);
  };

  const handleSave = (index: number) => {
    const updatedPrecio = [...DatoCompletosMedida];
    const updatedId = tempEditedPrices[index];

    if (updatedId) {
      const updatedData = DatoCompletosMedida.find(d => d.color.PrecioVenta._id === updatedId);
      if (updatedData) {
        updatedPrecio[index] = updatedData;
      }
    }

    onSelect(updatedPrecio);
    setTempEditedPrices({});
    setSelectedSetIndex(null);
  };

  const handleDelete = (index: number) => {
    const updatedPrecio = DatoCompletosMedida.filter((_, i) => i !== index);
    onSelect(updatedPrecio);
  };

  const handleSaveEdit = useCallback((selectedSetIndex: any) => {
    if (selectedSetIndex !== null) {
      
      const updatedData = DatoCompletosMedida.map((item) => {
        if (item === selectedSetIndex) {
  
          const nuevaCantidad = cantidadNueva !== 0 ? cantidadNueva : selectedSetIndex.cantidad;
          const nuevoTotal = totalNueva !== 0 ? totalNueva : selectedSetIndex.total;
          if (nuevaCantidad !== item.cantidad || nuevoTotal !== item.total) {
            return {
                ...item,
                cantidad: nuevaCantidad,
                total: nuevoTotal,
            };
          }else {
            return {
              ...item,
              medidaProducto: {
                ...item.medidaProducto,
                colores: item.medidaProducto.colores.map((color) => {
                  if ((color.PrecioVenta.PrecioVenta._id !== PrecioVentaSeleccionado?.PrecioVenta._id) && MedidaProductoSeleccionado?.colores.length !== 1 ) {
                    return {
                      ...color,
                      PrecioVenta: {
                        ...color.PrecioVenta,
                        color: {
                          nombreColor: PrecioVentaSeleccionado?.PrecioVenta.color.nombreColor,
                          _id: PrecioVentaSeleccionado?.PrecioVenta.color._id,
                        },
                        precioUnitario: PrecioVentaSeleccionado?.PrecioVenta.precioUnitario,
                        unidadMedida: PrecioVentaSeleccionado?.PrecioVenta.unidadMedida,
                        _id: PrecioVentaSeleccionado?.PrecioVenta._id,
                      },
                    };
                  }else if (MedidaProductoSeleccionado?.colores.length === 1 && (MedidaProductoSeleccionado?.colores[0].PrecioVenta.unidadMedida)){
                    return {
                      ...color,
                      PrecioVenta: {
                        ...color.PrecioVenta,
                        color: {
                          nombreColor:  MedidaProductoSeleccionado?.colores[0].PrecioVenta.color.nombreColor,
                          _id: MedidaProductoSeleccionado?.colores[0].PrecioVenta.color._id,
                        },
                        precioUnitario: MedidaProductoSeleccionado?.colores[0].PrecioVenta.precioUnitario.toString(),
                        unidadMedida: MedidaProductoSeleccionado?.colores[0].PrecioVenta.unidadMedida,
                        _id: MedidaProductoSeleccionado?.colores[0].PrecioVenta._id,
                      },
                    };
                  }
                  return color;
                }),
                longitudMedida: {
                  valor: MedidaProductoSeleccionado?.longitudMedida.valor || item.medidaProducto.longitudMedida.valor,
                  unidadMedida: MedidaProductoSeleccionado?.longitudMedida.unidadMedida || item.medidaProducto.longitudMedida.unidadMedida
                },
                Peso: MedidaProductoSeleccionado?.peso || item.medidaProducto.peso ,
                _id: MedidaProductoSeleccionado?._id || item.medidaProducto._id
              },
              color: {
                PrecioVenta:
                  PrecioVentaSeleccionado?.PrecioVenta._id !== item.color.PrecioVenta._id && PrecioVentaSeleccionado &&  MedidaProductoSeleccionado?.colores.length !== 1
                    ? {
                        color: {
                          nombreColor: PrecioVentaSeleccionado.PrecioVenta.color.nombreColor,
                          _id: PrecioVentaSeleccionado.PrecioVenta.color._id,
                        },
                        precioUnitario: PrecioVentaSeleccionado.PrecioVenta.precioUnitario,
                        unidadMedida: PrecioVentaSeleccionado.PrecioVenta.unidadMedida,
                        _id: PrecioVentaSeleccionado.PrecioVenta._id,
                      }
                    : 
                    (MedidaProductoSeleccionado?.colores.length === 1 && MedidaProductoSeleccionado?.colores[0].PrecioVenta.unidadMedida)
                    ?                         
                    {
                      color: {
                        nombreColor:  MedidaProductoSeleccionado?.colores[0].PrecioVenta.color.nombreColor,
                        _id: MedidaProductoSeleccionado?.colores[0].PrecioVenta.color._id,
                      },
                      precioUnitario: MedidaProductoSeleccionado?.colores[0].PrecioVenta.precioUnitario.toString(),
                      unidadMedida: MedidaProductoSeleccionado?.colores[0].PrecioVenta.unidadMedida,
                      _id: MedidaProductoSeleccionado?.colores[0].PrecioVenta._id, 
                    } 
                  : item.color.PrecioVenta,
              },              
              proveedor:
                ProveedorUnico.identificador !== item.proveedor._id && ProveedorUnico.identificador !== ''
                  ? {
                      _id: ProveedorUnico.identificador,
                      nombre: ProveedorUnico.nombre,
                    }
                  : item.proveedor,
              producto: ProductoIdentificador ? ProductoIdentificador : item.producto ,   
              cantidad: nuevaCantidad,
              total: nuevoTotal,
            }
          }
        }
        return item;
      });
      onSelect(updatedData);
      setTempEditedPrices({});
      setSelectedSetIndex(null);
    }
  }, [DatoCompletosMedida, cantidadNueva, totalNueva, ProveedorUnico, MedidaProductoSeleccionado, PrecioVentaSeleccionado, onSelect]);  
  
  const handleChangeProveedor = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;

    const selectedProveedor = Proveedores.find((Proveedor) => Proveedor._id === selectedId);
    if (selectedProveedor) {
      setProveedor({ identificador: selectedProveedor._id, nombre: selectedProveedor.nombre });
    }
  };

  const handleChangeProducto = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setProducto(e.target.value);
    setSelectedMedidaProducto(undefined);
    setPrecioVentaSeleccionado(undefined);
  };

  const handleChangeMedidaProducto = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const medidaUnica = datosMedidaProducto.find(medida => medida._id === e.target.value);
    setSelectedMedidaProducto(medidaUnica);
    setCambioMedida(false)
  };

  const handleChangePrecioVenta = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [selectedId, selectedMedidaId, selectedProducto] = e.target.value.split(',');

    const medida = datosMedidaProducto
      .filter((datos) => datos.producto.idProducto === (MedidaProductoSeleccionado?.producto.idProducto ? MedidaProductoSeleccionado?.producto.idProducto : selectedProducto))
      .find((datosMedida) => datosMedida._id === (MedidaProductoSeleccionado?._id? MedidaProductoSeleccionado?._id: selectedMedidaId));

    const precioVenta = medida?.colores.find((color) => color.PrecioVenta._id === selectedId);
  
    if (precioVenta && precioVenta.PrecioVenta?.unidadMedida) {
      setPrecioVentaSeleccionado({
        PrecioVenta: {
          _id: precioVenta.PrecioVenta._id,
          precioUnitario: String(precioVenta.PrecioVenta.precioUnitario),
          unidadMedida: precioVenta.PrecioVenta.unidadMedida,
          color: {
            _id: precioVenta.PrecioVenta.color._id,
            nombreColor: precioVenta.PrecioVenta.color.nombreColor,
          },
        },
      });
    }
  };
  
  const handleChangeCantidad = (e: React.ChangeEvent<HTMLInputElement>) => { 
    const value = Math.floor(Number(e.target.value));
    if (value > 0) {
      setCantidadNueva(value);
    }
  };

  const handleChangeTotal = (e: React.ChangeEvent<HTMLInputElement>) => { 
    const value = Number(e.target.value);
    if (value > 0){
      setTotalNueva(value);
    }
  };

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
      console.error('Error al obtener los proveedores:', error);
    }
  }, []);

  useEffect(() => {
    fetchMedidasProducto();
    fetchProveedores();
  }, [fetchMedidasProducto, fetchProveedores]);

  useEffect(() => {
    if (ProductoIdentificador !== '') {
      const medidaUnica = datosMedidaProducto.find(medida => medida.producto.idProducto === ProductoIdentificador);
      setSelectedMedidaProducto(medidaUnica || undefined);
      setCambioMedida(true)
    }
  }, [ProductoIdentificador, datosMedidaProducto]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = DatoCompletosMedida.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="precio-select-container">
      {DatoCompletosMedida.length === 0 ? (
        <p>No hay precios seleccionados.</p>
      ) : (
        <>
          {currentItems.map((MedidaProductoCompleto, index) => {
            const precioActual = MedidaProductoCompleto.color.PrecioVenta || {};
            return (
              <div key={index} className={`precio-item ${selectedSetIndex === index ? 'expanded' : ''}`}>
                <button
                  onClick={() => handleSetSelect(index)}
                  className="precio-button"
                  style={{ width: '300px' }}
                >
                  {`${ typeof precioActual === 'object' && MedidaProductoCompleto.medidaProducto ? GetObtenerNombreProducto(MedidaProductoCompleto.medidaProducto._id) + ' - ' + MedidaProductoCompleto.medidaProducto.longitudMedida.valor + ' ' + MedidaProductoCompleto.medidaProducto.longitudMedida.unidadMedida.simbolo : 'N/A'} - ${precioActual.color?.nombreColor || 'sin color'}`}
                </button>

                {selectedSetIndex === index && (
                  <div className="precio-edit-form">
                    <label htmlFor="proveedor-select" className="LabelModal">Proveedores</label>
                    <select
                      id="proveedor-select"
                      className="selectModal"
                      value={ ProveedorUnico.identificador === '' && ProveedorUnico.nombre === '' ? MedidaProductoCompleto.proveedor._id : ProveedorUnico.identificador || ""}
                      onChange={handleChangeProveedor}
                    >
                      <option value="" disabled>Selecciona un proveedor</option>
                      <option key={MedidaProductoCompleto.proveedor._id}  value={MedidaProductoCompleto.proveedor._id}>
                        {MedidaProductoCompleto.proveedor.nombre}
                      </option>
                      {Proveedores
                        .filter(proveedor => proveedor._id !== MedidaProductoCompleto.proveedor._id)
                        .map(proveedor => (
                          <option key={proveedor._id} value={proveedor._id}>
                            {proveedor.nombre}
                          </option>
                        ))}
                    </select>

                    <label htmlFor="producto-select" className="LabelModal">Productos</label>
                    <ProductoSelectXmedidaProducto
                      datosMedidaProducto={datosMedidaProducto || []}
                      handleChangeProducto={handleChangeProducto}
                      ProductoSeleccionado={ProductoIdentificador === '' ? MedidaProductoCompleto?.producto : ProductoIdentificador}
                    />

                    {MedidaProductoCompleto.producto && (
                      <>
                        <label htmlFor="medida-producto-select" className="LabelModal">Medidas de producto</label>
                        <select
                          id="medida-producto-select"
                          className="selectModal"
                          value={!MedidaProductoSeleccionado || CambioMedidaBase ? MedidaProductoCompleto?.medidaProducto._id : MedidaProductoSeleccionado._id || ""}
                          onChange={handleChangeMedidaProducto}
                        >
                          <option value="" disabled>Selecciona una medida producto</option>
                          {datosMedidaProducto
                            .filter(
                              medidaProducto => 
                                (
                                  (ProductoIdentificador === '' ? MedidaProductoCompleto?.producto : ProductoIdentificador)
                                  === medidaProducto.producto.idProducto
                                )
                                || 
                                ( 
                                  ( ( medidaProducto.producto.idProducto === ProductoIdentificador )  || (ProductoIdentificador === '' && MedidaProductoSeleccionado && MedidaProductoSeleccionado?.producto === medidaProducto.producto)) && (MedidaProductoCompleto.medidaProducto._id !== medidaProducto._id ) 
                                )
                              )
                            .map(medidaProducto => (
                              <option key={medidaProducto._id} value={medidaProducto._id}>
                                {`${medidaProducto.longitudMedida?.valor} ${medidaProducto.longitudMedida?.unidadMedida?.simbolo}`}
                              </option>
                            ))}
                        </select>
                      </>
                    )}

                    {(ProductoIdentificador !== '' || MedidaProductoCompleto.producto) && ( (MedidaProductoSeleccionado && MedidaProductoSeleccionado?.colores.length > 1 ) || !MedidaProductoSeleccionado) &&  (
                      <>
                        <label htmlFor="precioVenta-select" className="LabelModal">Colores de medida</label>
                        <select
                          id="precioVenta-select"
                          className="selectModal"
                          value={
                            PrecioVentaSeleccionado?.PrecioVenta._id
                            && 
                            PrecioVentaSeleccionado?.PrecioVenta._id !== ''
                            ? `${PrecioVentaSeleccionado.PrecioVenta._id },${ (!ProductoIdentificador || ProductoIdentificador === '') && !MedidaProductoSeleccionado
                              ? MedidaProductoCompleto.medidaProducto._id : MedidaProductoSeleccionado?._id},${!ProductoIdentificador || ProductoIdentificador === '' 
                                ? MedidaProductoCompleto.producto: ProductoIdentificador}`
                            : (
                              (ProductoIdentificador !== '' && ProductoIdentificador !== MedidaProductoCompleto.producto) 
                                && (MedidaProductoSeleccionado?._id !== MedidaProductoCompleto.medidaProducto._id)
                              ) && MedidaProductoSeleccionado 
                              ? `${MedidaProductoSeleccionado.colores[0].PrecioVenta._id},${MedidaProductoSeleccionado._id},${MedidaProductoSeleccionado.producto.idProducto}` : 
                              `${MedidaProductoCompleto.color.PrecioVenta._id },${MedidaProductoCompleto.medidaProducto._id},${MedidaProductoCompleto.producto}`
                          }
                          onChange={handleChangePrecioVenta}
                        >
                          <option value="" disabled>Selecciona un color</option>
                          {datosMedidaProducto
                            .filter((datos) =>
                              ( 
                                datos.producto.idProducto === MedidaProductoCompleto.producto
                                && 
                                !MedidaProductoSeleccionado
                              ) 
                              ||
                              (datos.producto.idProducto === MedidaProductoSeleccionado?.producto.idProducto)
                            )
                            .filter((datosMedida) =>
                              ( 
                                (datosMedida._id === MedidaProductoCompleto.medidaProducto._id) 
                                && 
                                (
                                  (!MedidaProductoSeleccionado || (MedidaProductoSeleccionado && MedidaProductoSeleccionado._id === datosMedida._id)) 
                                  && 
                                  ( !ProductoIdentificador || (ProductoIdentificador && ProductoIdentificador ===  MedidaProductoCompleto.producto))
                                )
                              ) 
                              ||
                              (
                                ((!ProductoIdentificador || (ProductoIdentificador && ProductoIdentificador ===  MedidaProductoCompleto.producto) ) && MedidaProductoSeleccionado)
                                && datosMedida._id ===  MedidaProductoSeleccionado._id
                              )
                              ||
                              (
                                (
                                  ProductoIdentificador !== ''
                                  && 
                                  MedidaProductoSeleccionado
                                )
                              &&
                                (
                                  datosMedida._id === MedidaProductoSeleccionado._id 
                                  && 
                                  MedidaProductoSeleccionado.producto.idProducto !== MedidaProductoCompleto.producto
                                )
                              )
                            )
                            .flatMap(medidaProducto => 
                              medidaProducto.colores.map(color => (
                                <option key={color.PrecioVenta._id} value={`${color.PrecioVenta._id},${ MedidaProductoSeleccionado ? MedidaProductoSeleccionado._id : medidaProducto._id},${medidaProducto.producto.idProducto}`}>
                                  {color.PrecioVenta.color.nombreColor}
                                </option>
                              ))
                            )
                          }
                        </select>
                      </>
                    )}

                    <InputFormato nombreInput="Cantidad" tipoInput="number" nameInput="cantidad" handleChangeCantidad={handleChangeCantidad} valor={MedidaProductoCompleto.cantidad !== cantidadNueva && cantidadNueva !== 0 ? cantidadNueva : MedidaProductoCompleto.cantidad} />
                    
                    <InputFormato nombreInput="Total" tipoInput="number" nameInput="total" handleChangeCantidad={handleChangeTotal} valor={MedidaProductoCompleto.total !== totalNueva && totalNueva !== 0 ? totalNueva : MedidaProductoCompleto.total} />
                    
                    <div className="edit-buttons">
                      <button onClick={() => (setSelectedSetIndex(index), handleSaveEdit(MedidaProductoCompleto))} className="save-button">Editar</button>
                      <button onClick={() => handleSetSelect(index)} className="cancel-button">Cancelar</button>
                      <button onClick={() => handleDelete(index)} className="delete-button">Eliminar</button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </>
      )}

      {DatoCompletosMedida.length > itemsPerPage && (

        <div className="pagination-container">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            className={`pagination-button ${currentPage === 1 ? 'active' : ''}`}
            disabled={currentPage === 1}
          >
            Anterior
          </button>
          <span>Página {currentPage}</span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(DatoCompletosMedida.length / itemsPerPage)))}
            className={`pagination-button ${currentPage === 1 ? 'active' : ''}`}
            disabled={currentPage === Math.ceil(DatoCompletosMedida.length / itemsPerPage)}
          >
            Siguiente
          </button>
        </div>
      )}
      
    </div> 
  );
};

export default PrecioSelect;
