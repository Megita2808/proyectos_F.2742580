import axios, { AxiosResponse } from 'axios';
import axios2 from '@/utils/axiosConfig';

interface DatoImagen {
  _id: string;
}

const EliminarImagen = async ( 
  _id: string
): Promise<DatoImagen | void> => {

  if (typeof _id !== 'string') {
    console.error('El id debe ser string');
    return 
  }

  try {
    const response: AxiosResponse<DatoImagen> = await axios2.delete<DatoImagen>(`/api/imagen/unica/${_id}`);
    return response.data;
  }  
  catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error('Error en la solicitud:', error.response?.data || error.message);
    } else {
      console.error('Error desconocido:', error);
    }
  }
};

export default EliminarImagen;
