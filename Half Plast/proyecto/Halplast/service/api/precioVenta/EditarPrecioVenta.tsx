import axios, { AxiosResponse } from 'axios';
import axios2 from '@/utils/axiosConfig';

interface DatosPrecioVenta {
  _id: string, 
  precioUnitario: number;
  unidadMedida: string;
  color: string;
}

const EditarPrecioVenta = async (
  _id: string, 
  precioUnitario: number, 
  unidadMedida: string, 
  color: string,
): Promise<DatosPrecioVenta | void> => {
  
  if (precioUnitario <=0) {
    console.error('El nombre del producto debe tener al menos 1 digito');
    return
  }
  try {
    const response: AxiosResponse<DatosPrecioVenta> = await axios2.put<DatosPrecioVenta>('/api/precioVenta/'+_id, {
      precioUnitario,
      unidadMedida,
      color
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

export default EditarPrecioVenta;
