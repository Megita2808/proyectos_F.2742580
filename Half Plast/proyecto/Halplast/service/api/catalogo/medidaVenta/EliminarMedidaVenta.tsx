import axios, { AxiosResponse } from 'axios';
import axios2 from '@/utils/axiosConfig';

interface DatosMedidaVenta {
  _id: string;
}

const EliminarMedidaVenta = async ( 
  _id: string
): Promise<DatosMedidaVenta | void> => {

  if (typeof _id !== 'string') {
    console.error('El id debe ser string');
    return 
  }

  try {
    const response: AxiosResponse<DatosMedidaVenta> = await axios2.delete<DatosMedidaVenta>('/api/medidaVenta/'+_id);

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error('Error en la solicitud:', error.response?.data || error.message);
    } else {
      console.error('Error desconocido:', error);
    }
  }
};

export default EliminarMedidaVenta;
