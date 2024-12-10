import axios, { AxiosResponse } from 'axios';
import axios2 from '@/utils/axiosConfig';

interface UnidadMedida {
  _id: string;
  nombre: string;
  simbolo: string;
  tipo: string;
}

export interface Peso {
  _id: string;
  peso: number;
  estado: boolean;
  unidadMedida: UnidadMedida | null;
}

interface GetPesoResponse {
  pesos: Peso[];
}

export const getPesos = async (): Promise<Peso[]> => {
  try {
    const response: AxiosResponse<GetPesoResponse> = await axios2.get<GetPesoResponse>('/api/peso');
    return response.data.pesos;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error('Error en la solicitud:', error.response?.data || error.message);
    } else {
      console.error('Error desconocido:', error);
    }
    return [];
  }
};