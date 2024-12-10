import axios, { AxiosResponse } from 'axios';
import axios2 from '@/utils/axiosConfig';

interface DatoPrecioVenta {
  precioUnitario: number;
  unidadMedida: string;
  color: string;
}

const AgregarPrecioVenta = async (
  precioUnitario: number, 
  unidadMedida: string, 
  color: string,
): Promise<DatoPrecioVenta | void> => {

  if (precioUnitario <= 0) {
    console.error('El precio unitario debe ser mayor que 0');
    return;
  }
  console.log(precioUnitario);
  console.log(unidadMedida);
  console.log(color);

  try {
    const response: AxiosResponse<DatoPrecioVenta> = await axios2.post<DatoPrecioVenta>('/api/precioVenta', {
      precioUnitario,
      unidadMedida,
      color,
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

export default AgregarPrecioVenta;
