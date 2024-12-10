import axios, { AxiosResponse } from 'axios';
import axios2 from '@/utils/axiosConfig';

interface DatosProducto {
  _id: string;
}

const EliminarProducto = async ( 
  _id: string
): Promise<DatosProducto | void> => {
  if (typeof _id !== 'string') {
    console.error('El id debe ser string');
    return 
  }

  try {
    const response: AxiosResponse<DatosProducto> = await axios2.delete<DatosProducto>('/api/producto/'+_id);

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error('Error en la solicitud:', error.response?.data || error.message);
    } else {
      console.error('Error desconocido:', error);
    }
  }
};

export default EliminarProducto;
