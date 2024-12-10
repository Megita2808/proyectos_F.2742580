import axios, { AxiosResponse } from 'axios';
import axios2 from '@/utils/axiosConfig';

interface DatosUnidadMedida {
  nombre: string;
  _id: string;
  simbolo: string;
  tipo: string;
}

const EditarUnidadMedida = async (
  nombre: string,
  _id: string,
  simbolo: string,
  tipo: string,
): Promise<DatosUnidadMedida | void> => {

  if (nombre.length < 2) {
    console.error('El nombre de la unidad de medida deberia tener al menos 1 digito');
    return
  }

  try {
    const response: AxiosResponse<DatosUnidadMedida> = await axios2.put<DatosUnidadMedida>('/api/unidadMedida/'+_id, {
      nombre,
      simbolo,
      tipo,
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

export default EditarUnidadMedida;