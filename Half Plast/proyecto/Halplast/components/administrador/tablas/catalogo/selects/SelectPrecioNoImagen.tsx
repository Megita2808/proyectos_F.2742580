import React, { useState, useMemo } from 'react';
import './PrecioSelect.css';

interface PrecioVenta {
  idPrecioVentaApi: string;
  simboloUnidadMedida: string;  
  precioUnitarioApi: number;
  color: string;
}

interface DatosPrecioVentaSelect {
  idPrecioVentaApi: string;
  precioUnitarioApi: number;
  idUnidadMedidaPrecioVenta: string;
  color: string;
  simboloUnidadMedida: string;
}

interface PreciosListProps {
  onSelect: (datosSelect: PrecioVenta[]) => void;
  selectedPrecio: PrecioVenta[];
  datosPrecioVentaSelect: DatosPrecioVentaSelect[];
  UnidadMedidaSeleccionadoTipo: string;
  UnidadMedidaSeleccionadoSimbolo: string;
  PesoSimboloMedidaProducto: string;
  ingresarPeso: string;
}

const PrecioSelect: React.FC<PreciosListProps> = ({
  onSelect,
  selectedPrecio,
  datosPrecioVentaSelect,
  UnidadMedidaSeleccionadoTipo,
  UnidadMedidaSeleccionadoSimbolo,
  PesoSimboloMedidaProducto,
  ingresarPeso,
}) => {
  const [selectedSetIndex, setSelectedSetIndex] = useState<number | null>(null);
  const [tempEditedPrices, setTempEditedPrices] = useState<{ [key: number]: string }>({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const getPrecioVentaSelectValue = (precioVentaId: string) => {
    const precioVenta = datosPrecioVentaSelect.find(item => item.idPrecioVentaApi === precioVentaId);
    return precioVenta ? precioVenta.precioUnitarioApi : '';
  };

  const filteredPrecios = useMemo(() => datosPrecioVentaSelect.filter(precioVenta => {
    const seleccionado = selectedPrecio.some(p => p.idPrecioVentaApi === precioVenta.idPrecioVentaApi);
    if (seleccionado) return false;

    if (UnidadMedidaSeleccionadoTipo === "peso") {
      return PesoSimboloMedidaProducto === precioVenta.simboloUnidadMedida;
    }
    if (UnidadMedidaSeleccionadoSimbolo === "mt" && ingresarPeso) {
      return ["mt", "Kg"].includes(precioVenta.simboloUnidadMedida);
    }
    if (UnidadMedidaSeleccionadoSimbolo === "Mt²" && ingresarPeso) {
      return ["Mt²", "Kg"].includes(precioVenta.simboloUnidadMedida);
    }
    if (UnidadMedidaSeleccionadoTipo === "longitud" && !["YD", "Mt²", "cm²", "mt"].includes(UnidadMedidaSeleccionadoSimbolo)) {
      return PesoSimboloMedidaProducto === precioVenta.simboloUnidadMedida;
    }
    return ["Unic", UnidadMedidaSeleccionadoSimbolo].includes(precioVenta.simboloUnidadMedida);
  }), [datosPrecioVentaSelect, selectedPrecio, UnidadMedidaSeleccionadoSimbolo, UnidadMedidaSeleccionadoTipo, PesoSimboloMedidaProducto, ingresarPeso]);

  const handleSetSelect = (index: number) => {
    setSelectedSetIndex(index === selectedSetIndex ? null : index);
    setTempEditedPrices({});
  };

  const handleSave = (index: number) => {
    const updatedPrecio = [...selectedPrecio];
    const updatedId = tempEditedPrices[index];

    if (updatedId) {
      const updatedData = datosPrecioVentaSelect.find(d => d.idPrecioVentaApi === updatedId);
      if (updatedData) {
        updatedPrecio[index] = {
          ...updatedPrecio[index],
          idPrecioVentaApi: updatedData.idPrecioVentaApi,
          precioUnitarioApi: updatedData.precioUnitarioApi,
          simboloUnidadMedida: updatedData.simboloUnidadMedida,
          color: updatedData.color,
        };
      }
    }

    onSelect(updatedPrecio);
    setTempEditedPrices({});
    setSelectedSetIndex(null);
  };

  const handleDelete = (index: number) => {
    const updatedPrecio = selectedPrecio.filter((_, i) => i !== index);
    onSelect(updatedPrecio);
  };

  const handlePriceChange = (index: number, newPrice: string) => {
    setTempEditedPrices(prev => ({ ...prev, [index]: newPrice }));
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = selectedPrecio.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="precio-select-container">
      {selectedPrecio.length === 0 ? (
        <p>No hay precios seleccionados.</p>
      ) : (
        <>
          {currentItems.map((precio, index) => {
            const precioActual = getPrecioVentaSelectValue(precio.idPrecioVentaApi) || 'Precio no disponible';
            const matchedPrecioVenta = datosPrecioVentaSelect.find(item => item.idPrecioVentaApi === precio.idPrecioVentaApi);

            return (
              <div key={index} className={`precio-item ${selectedSetIndex === index ? 'expanded' : ''}`}>
                <button
                  onClick={() => handleSetSelect(index)}
                  className="precio-button"
                  style={{ width: '300px' }}
                >
                  {`${precioActual} pesos X ${matchedPrecioVenta?.simboloUnidadMedida || 'unidad'} en ${matchedPrecioVenta?.color || 'sin color'}`}
                </button>

                {selectedSetIndex === index && (
                  <div className="precio-edit-form">
                    <label htmlFor="precio-select" className="LabelModal">Selecciona un precio</label>
                    <select
                      value={tempEditedPrices[index] || getPrecioVentaSelectValue(precio.idPrecioVentaApi)}
                      onChange={(e) => handlePriceChange(index, e.target.value)}
                      className="precio-select"
                    >
                      <option value="" disabled>Selecciona un precio</option>
                      <option key={precio.idPrecioVentaApi} value={precio.idPrecioVentaApi}>
                        {`${precio.precioUnitarioApi} ${precio.simboloUnidadMedida}`}
                      </option>
                      {filteredPrecios.map(dato => (
                        <option key={dato.idPrecioVentaApi} value={dato.idPrecioVentaApi}>
                          {`${dato.precioUnitarioApi} ${dato.simboloUnidadMedida}`}
                        </option>
                      ))}
                    </select>
                    <div className="edit-buttons">
                      <button onClick={() => handleSave(index)} className="save-button">Guardar</button>
                      <button onClick={() => handleSetSelect(index)} className="cancel-button">Cancelar</button>
                      <button onClick={() => handleDelete(index)} className="delete-button">Eliminar</button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {selectedPrecio.length > itemsPerPage && (
            <div className="pagination-container">
              <button
                className="pagination-button"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              >
                Anterior
              </button>
              <button
                className="pagination-button"
                onClick={() => setCurrentPage(prev => prev + 1)}
              >
                Siguiente
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PrecioSelect;
