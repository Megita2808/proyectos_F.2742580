/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { getImagenesModuloUnico } from '@/service/api/img/ModuloUnicoImagen';

interface Imagen {
  id: string;
  imageUrl: string;
}

interface ImagenSelectProps {
  onSelect: (selectedId: string, selectedUrl: string) => void;
  primerDato: string;
  moduduloBusqueda: string;
}

const ImagenSelect: React.FC<ImagenSelectProps> = ({ onSelect, primerDato, moduduloBusqueda }) => {
  const [datosImagenes, setDatosImagenes] = useState<Imagen[]>([]);
  const [selectedImagen, setSelectedImagen] = useState<string>(primerDato);

  useEffect(() => {
    const fetchImagenes = async () => {
      try {
        const modulo = await getImagenesModuloUnico(moduduloBusqueda);
        if (modulo && modulo.images.length > 0) {
          setDatosImagenes(modulo.images);

          const imageFromPrimerDato = modulo.images.find(imagen => imagen.id === primerDato);
          if (imageFromPrimerDato) {
            setSelectedImagen(imageFromPrimerDato.id);
            onSelect(imageFromPrimerDato.id, imageFromPrimerDato.imageUrl);
          } else if (!selectedImagen && modulo.images.length > 0) {
            const firstImage = modulo.images[0];
            setSelectedImagen(firstImage.id);
            onSelect(firstImage.id, firstImage.imageUrl);
          }
        }
      } catch (error) {
        console.error('Error al obtener las imágenes:', error);
      }
    };

    fetchImagenes();
  }, [primerDato]);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = event.target.value;
    setSelectedImagen(selectedId);

    const selectedImage = datosImagenes.find(imagen => imagen.id === selectedId);
    if (selectedImage) {
      onSelect(selectedId, selectedImage.imageUrl);
    }
  };

  const getFileName = (url: string) => {
    const fullFileName = url.substring(url.lastIndexOf('/') + 1);
    return fullFileName.substring(0, fullFileName.lastIndexOf('.'));
  };

  return (
    <div>
      <label htmlFor="imagen-select" className="LabelModal">Selecciona una imagen</label>
      <select
        id="imagen-select"
        className="selectModal"
        value={selectedImagen}
        onChange={handleChange} 
      >
        {datosImagenes.length === 0 && <option value="" disabled>Cargando imágenes...</option>}
        {datosImagenes
          .map(imagen => (
            <option key={imagen.id} value={imagen.id}>
              {getFileName(imagen.imageUrl)}
            </option>
          ))}
      </select>
    </div>
  );
};

export default ImagenSelect;
