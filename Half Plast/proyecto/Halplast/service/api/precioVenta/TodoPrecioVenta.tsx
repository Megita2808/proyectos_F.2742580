import axios, { AxiosResponse } from 'axios';
import axios2 from '@/utils/axiosConfig';

interface UnidadMedida {
  _id: string;
  nombre: string;
  simbolo: string;
  tipo: string;
}

interface Color {
  _id: string;
  nombreColor: string;
}

export interface PrecioVenta {
  _id: string;
  precioUnitario: number;
  unidadMedida: UnidadMedida;
  color: Color;
  estado: boolean;
}

interface GetPrecioVentaResponse {
  preciosVenta: PrecioVenta[];
}

export const getPreciosVenta = async (): Promise<PrecioVenta[]> => {
  try {
    const response: AxiosResponse<GetPrecioVentaResponse> = await axios2.get<GetPrecioVentaResponse>('/api/precioVenta');
    return response.data.preciosVenta;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error('Error en la solicitud:', error.response?.data || error.message);
    } else {
      console.error('Error desconocido:', error);
    }
    return [];
  }
};
