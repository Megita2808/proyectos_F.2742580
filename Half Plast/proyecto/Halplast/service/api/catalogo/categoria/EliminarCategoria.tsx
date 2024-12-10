import axios, { AxiosResponse } from 'axios';
import axios2 from '@/utils/axiosConfig';

interface DatosCategoria {
  _id: string;
}

const EliminarCategoria = async ( 
  _id: string
): Promise<DatosCategoria | void> => {

  if (typeof _id !== 'string') {
    console.error('La contraseña debe ser string');
    return 
  }

  try {
    const response: AxiosResponse<DatosCategoria> = await axios2.delete<DatosCategoria>('/api/categoria/'+_id);

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error('Error en la solicitud:', error.response?.data || error.message);
    } else {
      console.error('Error desconocido:', error);
    }
  }
};

export default EliminarCategoria;
