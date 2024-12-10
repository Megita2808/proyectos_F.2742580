import axios, { AxiosResponse } from 'axios';
import axios2 from '@/utils/axiosConfig';

interface DatoPermiso {
  nombrePermiso: string;
  descripcionPermiso: string;
}

const AgregarPermiso = async (
  nombrePermiso: string,
  descripcionPermiso: string,
): Promise<DatoPermiso | void> => {

  if (nombrePermiso.length < 3) {
    console.error('El nombre del permiso debe ser mayor a 2');
    return
  }

  if (descripcionPermiso.length < 3) {
    console.error('La descripcion del permiso debe ser mayor a 2');
    return
  }

  try {
    const response: AxiosResponse<DatoPermiso> = await axios2.post<DatoPermiso>('/api/permiso' ,{
      nombrePermiso,
      descripcionPermiso,
    });

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error('Error en la solicitud:', error.response?.data || error.message);
    } else {
      console.error('Error desconocido:', error);
    }
  }
};

export default AgregarPermiso;
