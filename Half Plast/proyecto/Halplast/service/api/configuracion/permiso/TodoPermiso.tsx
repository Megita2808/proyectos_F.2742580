import axios, { AxiosResponse } from 'axios';
import axios2 from '@/utils/axiosConfig';

interface DataRowPermiso{
  col1: number;
  _id: string;
  nombrePermiso: string;
  descripcionPermiso: string;
  estado: boolean;
}

interface GetPesoResponse {
  permisos: DataRowPermiso[];
}

export const getPermisos = async (): Promise<DataRowPermiso[]> => {
  try {
    const response: AxiosResponse<GetPesoResponse> = await axios2.get<GetPesoResponse>('/api/permisos');
    return response.data.permisos;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error('Error en la solicitud:', error.response?.data || error.message);
    } else {
      console.error('Error desconocido:', error);
    }
    return [];
  }
};