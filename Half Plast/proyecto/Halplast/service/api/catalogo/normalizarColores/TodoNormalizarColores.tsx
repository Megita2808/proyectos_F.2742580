import axios, { AxiosResponse } from 'axios';
import axios2 from '@/utils/axiosConfig';

interface Producto {
  _id: string;
  nombreProducto: string;
  estado: boolean;
  categoria: string;
}

interface GetProductosResponse {
  productos: Producto[];
}

export const getProductos = async (): Promise<Producto[]> => {
  try {
    const response: AxiosResponse<GetProductosResponse> = await axios2.get<GetProductosResponse>('/api/producto');
    return response.data.productos;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error('Error en la solicitud:', error.response?.data || error.message);
    } else {
      console.error('Error desconocido:', error);
    }
    return [];
  }
};