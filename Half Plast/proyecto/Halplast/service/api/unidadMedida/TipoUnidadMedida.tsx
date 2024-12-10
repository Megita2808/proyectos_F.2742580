import axios, { AxiosResponse } from 'axios';
import axios2 from '@/utils/axiosConfig';

interface UnidadMedida {
  _id: string;
  nombre: string;
  simbolo: string;
  estado: boolean;
  tipo: string;
}

export const getUnidadMedidaTipo = async (tipo: string): Promise<UnidadMedida[]> => {
  try {
    const response: AxiosResponse<UnidadMedida[]> = await axios2.get<UnidadMedida[]>(`/api/unidadMedida/tipo/${tipo}`);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error('Error en la solicitud:', error.response?.data || error.message);
    } else {
      console.error('Error desconocido:', error);
    }
    return [];
  }
};
