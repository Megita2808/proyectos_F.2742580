import axios, { AxiosResponse } from 'axios';
import axios2 from '@/utils/axiosConfig';

interface Categoria {
  _id: string;
  nombreCategoria: string;
  estado: boolean;
}

interface GetCategoriasResponse {
  categorias: Categoria[];
}

export const getCategorias = async (): Promise<Categoria[]> => {
  try {
    const response: AxiosResponse<GetCategoriasResponse> = await axios2.get<GetCategoriasResponse>('/api/categoria');
    return response.data.categorias;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error('Error en la solicitud:', error.response?.data || error.message);
    } else {
      console.error('Error desconocido:', error);
    }
    return [];
  }
};