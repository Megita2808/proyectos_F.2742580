import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
  const [loading, setLoading] = useState<boolean>(true);

  const fetchImagenes = useCallback(async () => {
    try {
      const modulo = await getImagenesModuloUnico(moduduloBusqueda);
      if (modulo && modulo.images.length > 0) {
        setDatosImagenes(modulo.images);
  
        if (!selectedImagen || selectedImagen === primerDato) {
          const imageFromPrimerDato = modulo.images.find(imagen => imagen.imageUrl === primerDato);
          if (imageFromPrimerDato) {
            setSelectedImagen(imageFromPrimerDato.id);
            onSelect(imageFromPrimerDato.id, imageFromPrimerDato.imageUrl);
          } else {
            const firstImage = modulo.images[0];
            setSelectedImagen(firstImage.id);
            onSelect(firstImage.id, firstImage.imageUrl);
          }
        }
      }
    } catch (error) {
      console.error('Error al obtener las imágenes:', error);
    } finally {
      setLoading(false);
    }
  }, [moduduloBusqueda, primerDato, selectedImagen, onSelect]);

  useEffect(() => {
    fetchImagenes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  const memorizedImages = useMemo(() => datosImagenes.map(imagen => (
    <option key={imagen.id} value={imagen.id}>
      {imagen.imageUrl.split('/').pop()?.split('.')[0]}
    </option>
  )), [datosImagenes]);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = event.target.value;
    setSelectedImagen(selectedId);

    const selectedImage = datosImagenes.find(imagen => imagen.id === selectedId);
    if (selectedImage) {
      onSelect(selectedId, selectedImage.imageUrl);
    }
  };

  return (
    <div>
      <label htmlFor="imagen-select" className="LabelModal">Selecciona una imagen</label>
      <select
        id="imagen-select"
        className="selectModal"
        value={selectedImagen}
        onChange={handleChange}
        disabled={loading}
      >
        {loading && <option value="" disabled>Cargando imágenes...</option>}
        {memorizedImages}
      </select>
    </div>
  );
};

export default ImagenSelect;
