import axios, { AxiosResponse } from 'axios';
import axios2 from '@/utils/axiosConfig';

interface DatosUnidadMedida {
  _id: string;
}

const EliminarUnidadMedida = async ( 
  _id: string
): Promise<DatosUnidadMedida | void> => {

  if (typeof _id !== 'string') {
    console.error('La contraseña debe ser string');
    return 
  }

  try {
    const response: AxiosResponse<DatosUnidadMedida> = await axios2.delete<DatosUnidadMedida>('/api/unidadMedida/'+_id);

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error('Error en la solicitud:', error.response?.data || error.message);
    } else {
      console.error('Error desconocido:', error);
    }
  }
};

export default EliminarUnidadMedida;
