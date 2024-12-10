import React, { useState, useEffect } from 'react';
import ImagenSelectEditar from './selectImagenesEditarSelect';
import './PrecioSelect.css';

interface Colores {
  PrecioVenta: string;
  imagen: string;
}

interface DatosPrecioVentaSelect {
  idPrecioVentaApi: string;
  precioUnitarioApi: number;
  idUnidadMedidaPrecioVenta: string;
  color: string;
  simboloUnidadMedida: string;
}

interface PreciosListProps {
  onSelect: (datosSelect: Colores[], UrlImagenSelect: string) => void;
  selectedPrecio: Colores[];
  datosPrecioVentaSelect: DatosPrecioVentaSelect[];
}

const PrecioSelect: React.FC<PreciosListProps> = ({ onSelect, selectedPrecio, datosPrecioVentaSelect }) => {
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | undefined>();
  const [selectedImageId, setSelectedImageId] = useState<string | undefined>();
  const [selectedSetIndex, setSelectedSetIndex] = useState<number | null>(null);
  const [tempEditedPrices, setTempEditedPrices] = useState<{ [key: number]: string }>({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const getPrecioVentaSelectValue = (precioVentaId: string) => {
    const precioVenta = datosPrecioVentaSelect.find(
      (item) => item.idPrecioVentaApi === precioVentaId
    );
    return precioVenta ? precioVenta.precioUnitarioApi : '';
  };

  const handleSetSelect = (index: number) => {
    setSelectedSetIndex(index === selectedSetIndex ? null : index);
    if (index !== selectedSetIndex) {
      setTempEditedPrices({});
      setSelectedImageUrl(undefined);
    }
  };

  const handleSave = (index: number) => {
    const updatedPrecio = [...selectedPrecio];
    if (tempEditedPrices[index]) {
      updatedPrecio[index].PrecioVenta = tempEditedPrices[index];
    }
    updatedPrecio[index].imagen = selectedImageId || "vacio";

    onSelect(updatedPrecio, selectedImageUrl || "vacio");

    setTempEditedPrices({});
    setSelectedImageUrl(undefined);
    setSelectedImageUrl(selectedImageUrl || "vacio");
    setSelectedSetIndex(null);
  };

  const handleDelete = (index: number) => {
    const updatedPrecio = selectedPrecio.filter((_, i) => i !== index);
    onSelect(updatedPrecio, selectedImageUrl || 'vacio');
  };

  const handleChangeImagen = (id: string, url: string) => {
    setSelectedImageId(url);
    setSelectedImageId(id);
    onSelect(selectedPrecio, url);
  };

  const handlePriceChange = (index: number, newPrice: string) => {
    const updatedTempPrices = { ...tempEditedPrices, [index]: newPrice };
    setTempEditedPrices(updatedTempPrices);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = selectedPrecio.slice(indexOfFirstItem, indexOfLastItem);

  const showPagination = selectedPrecio.length > itemsPerPage;

  return (
    <div className="precio-select-container">
      {selectedPrecio.length === 0 ? (
        <p>No hay precios seleccionados.</p>
      ) : (
        <>
          {currentItems.map((precio, index) => {
            const precioActual = getPrecioVentaSelectValue(precio.PrecioVenta) || 'Precio no disponible';
            const matchedPrecioVenta = datosPrecioVentaSelect.find(
              (item) => item.idPrecioVentaApi === precio.PrecioVenta
            );

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
                    <label htmlFor="precio-select" className="LabelModal">
                      Selecciona un precio
                    </label>
                    <select
                      value={tempEditedPrices[index] || getPrecioVentaSelectValue(precio.PrecioVenta)}
                      onChange={(e) => handlePriceChange(index, e.target.value)}
                      className="precio-select"
                    >
                      <option value="">Selecciona un precio</option>
                      {datosPrecioVentaSelect.map((dato, i) => (
                        <option key={i} value={dato.precioUnitarioApi}>
                          {`${dato.precioUnitarioApi} ${dato.simboloUnidadMedida}`}
                        </option>
                      ))}
                    </select>

                    <ImagenSelectEditar
                      primerDato={precio.imagen}
                      moduduloBusqueda="MedidaVenta"
                      onSelect={handleChangeImagen}
                    />
                    <div className="edit-buttons">
                      <button onClick={() => handleSave(index)} className="save-button">
                        Guardar
                      </button>
                      <button onClick={() => handleSetSelect(index)} className="cancel-button"> 
                        Cancelar 
                      </button>
                      <button onClick={() => handleDelete(index)} className="delete-button">
                        Eliminar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {showPagination && (
            <div className="pagination-container">
              <button
                className="pagination-button"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Anterior
              </button>
              <button
                className="pagination-button"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === Math.ceil(selectedPrecio.length / itemsPerPage)}
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
