import axios, { AxiosResponse } from 'axios';
import axios2 from '@/utils/axiosConfig';

interface DatosMedidaProducto {
  _id: string;
}

const EliminarMedidaProducto = async ( 
  _id: string
): Promise<DatosMedidaProducto | void> => {

  if (typeof _id !== 'string') {
    console.error('El id debe ser string');
    return 
  }

  try {
    const response: AxiosResponse<DatosMedidaProducto> = await axios2.delete<DatosMedidaProducto>('/api/medidaProducto/'+_id);

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error('Error en la solicitud:', error.response?.data || error.message);
    } else {
      console.error('Error desconocido:', error);
    }
  }
};

export default EliminarMedidaProducto;
