import axios, { AxiosResponse } from 'axios';
import axios2 from '@/utils/axiosConfig';

interface DatosPrecioVenta {
  _id: string;
}

const EliminarPrecioVenta = async ( 
  _id: string
): Promise<DatosPrecioVenta | void> => {
  if (typeof _id !== 'string') {
    console.error('El id debe ser string');
    return 
  }

  try {
    const response: AxiosResponse<DatosPrecioVenta> = await axios2.delete<DatosPrecioVenta>('/api/precioVenta/'+_id);

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error('Error en la solicitud:', error.response?.data || error.message);
    } else {
      console.error('Error desconocido:', error);
    }
  }
};

export default EliminarPrecioVenta;
