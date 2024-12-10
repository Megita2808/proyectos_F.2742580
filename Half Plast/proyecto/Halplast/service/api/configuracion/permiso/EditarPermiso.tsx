import axios, { AxiosResponse } from 'axios';
import axios2 from '@/utils/axiosConfig';

interface DatosPermiso {
  _id: string;
  nombrePermiso: string,
  descripcionPermiso: string,
}

const EditarPermiso = async (
  _id: string,
  nombrePermiso: string,
  descripcionPermiso: string,
): Promise<DatosPermiso | void> => {

  if (nombrePermiso.length < 3) {
    console.error('El nombre del permiso debe ser mayor a 2');
    return
  }

  if (descripcionPermiso.length < 3) {
    console.error('La descripcion del permiso debe ser mayor a 2');
    return
  }

  try {
    const response: AxiosResponse<DatosPermiso> = await axios2.put<DatosPermiso>('/api/permiso/'+_id, {
      nombrePermiso,
      descripcionPermiso
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

export default EditarPermiso;
