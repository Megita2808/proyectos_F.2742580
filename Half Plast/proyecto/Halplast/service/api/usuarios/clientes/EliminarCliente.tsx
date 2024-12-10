import axios, { AxiosResponse } from 'axios';
import axios2 from '@/utils/axiosConfig';

interface DatosUsuario {
  _id: string;
}

const EliminarUsuario = async ( 
  _id: string
): Promise<DatosUsuario | void> => {

  try {
    const response: AxiosResponse<DatosUsuario> = await axios2.delete<DatosUsuario>('/api/usuarios/'+_id);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error('Error en la solicitud:', error.response?.data || error.message);
    } else {
      console.error('Error desconocido:', error);
    }
  }
};

export default EliminarUsuario;
