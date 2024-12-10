import axios, { AxiosResponse } from 'axios';
import axios2 from '@/utils/axiosConfig';

interface DatosImagen {
  nombreCategoria: boolean;
  _id: string;
}

const CambiarEstado = async (
  estado: boolean, 
  _id: string
): Promise<DatosImagen | void> => {

  try {
    const response: AxiosResponse<DatosImagen> = await axios2.put<DatosImagen>('/api/imagen/estado/'+_id, {
      estado,
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

export default CambiarEstado;
